from flask import Flask, request, jsonify, send_file
import pandas as pd
from flask_cors import CORS
import seaborn as sns
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import os

# ✅ NEW: Auth
import pymysql
from flask_bcrypt import Bcrypt

app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)

# ✅✅✅ ---------------------------
# 🔑 MYSQL SETUP (adjust to your DB)
connection = pymysql.connect(
    host='localhost',
    user='root',
    password='Sakshi@123',
    database='demandwise',
    cursorclass=pymysql.cursors.DictCursor
)

# ✅✅✅ ---------------------------
# Your demand forecast setup
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
weekly_path = os.path.join(BASE_DIR, "weekly_forecast_output.csv")
monthly_path = os.path.join(BASE_DIR, "monthly_forecast_output.csv")

print("✅ BASE_DIR:", BASE_DIR)
print("✅ Weekly CSV exists?", os.path.exists(weekly_path))
print("✅ Monthly CSV exists?", os.path.exists(monthly_path))

if not os.path.exists(weekly_path):
    raise FileNotFoundError(f"❌ weekly_forecast_output.csv not found in {BASE_DIR}")

if not os.path.exists(monthly_path):
    raise FileNotFoundError(f"❌ monthly_forecast_output.csv not found in {BASE_DIR}")

weekly_df = pd.read_csv(weekly_path)
monthly_df = pd.read_csv(monthly_path)
combined_df = pd.concat([weekly_df, monthly_df])

# ✅✅✅ ---------------------------
# AUTH ENDPOINT: SIGNUP
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    contact = data.get('contact')
    password = data.get('password')

    if not name or not email or not contact or not password:
        return jsonify({"error": "All fields required"}), 400

    hashed_pw = bcrypt.generate_password_hash(password).decode('utf-8')

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "INSERT INTO users (name, email, contact, password_hash) VALUES (%s, %s, %s, %s)",
                (name, email, contact, hashed_pw)
            )
            connection.commit()
        return jsonify({"message": "Signup successful ✅"})
    except pymysql.err.IntegrityError:
        return jsonify({"error": "Email already registered"}), 409

# ✅✅✅ ---------------------------
# AUTH ENDPOINT: LOGIN
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    with connection.cursor() as cursor:
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()

        if user and bcrypt.check_password_hash(user['password_hash'], password):
            return jsonify({"message": "Login successful ✅"})
        else:
            return jsonify({"error": "Invalid email or password"}), 401

# ✅✅✅ ---------------------------
# Your EXISTING routes: Options, Filter, Months, Heatmap

@app.route('/api/options', methods=['GET'])
def get_options():
    cities = combined_df['City'].dropna().unique().tolist()
    products = combined_df['Product Name'].dropna().unique().tolist()
    return jsonify({"cities": cities, "products": products})

@app.route('/api/filter', methods=['POST'])
def filter_data():
    data = request.json
    city = data.get('city')
    product = data.get('product')
    timeline = data.get('timeline')
    start_date = data.get('start_date')

    if not start_date:
        return jsonify({"error": "Start date required"}), 400

    df = weekly_df if timeline == 'Weekly' else monthly_df
    df = df.copy()

    if city:
        df = df[df['City'] == city]
    if product:
        df = df[df['Product Name'] == product]

    df['ds'] = pd.to_datetime(df['ds'])
    start_date = pd.to_datetime(start_date)

    if timeline == 'Weekly':
        end_date = start_date + pd.Timedelta(days=6)
    else:
        end_date = start_date + pd.Timedelta(days=29)

    mask = (df['ds'] >= start_date) & (df['ds'] <= end_date)
    filtered = df.loc[mask]

    total_demand = filtered['yhat'].sum() if not filtered.empty else 0

    result = [{
        "City": city,
        "Date Range": f"{start_date.date()} to {end_date.date()}",
        "Product Name": product,
        "Quantity": round(total_demand, 2)
    }]

    return jsonify(result)

@app.route('/api/months', methods=['GET'])
def get_months():
    df = monthly_df.copy()
    df['ds'] = pd.to_datetime(df['ds'])
    months = df['ds'].dt.to_period('M').astype(str).unique().tolist()
    months.sort()
    return jsonify({"months": months})

@app.route('/api/heatmap', methods=['POST'])
def generate_heatmap():
    data = request.json
    selected_month = data.get('month')

    if not selected_month:
        return jsonify({"error": "Month required"}), 400

    df = monthly_df.copy()
    df['City'] = df['City'].str.strip()
    df['Product Name'] = df['Product Name'].str.strip()
    df = df.dropna(subset=['City', 'Product Name', 'yhat'])

    df['ds'] = pd.to_datetime(df['ds'])
    df['Month'] = df['ds'].dt.to_period('M').astype(str)

    df = df[df['Month'] == selected_month]

    if df.empty:
        return jsonify({"error": "No data for selected month"}), 404

    all_cities = sorted(monthly_df['City'].str.strip().unique())
    all_products = sorted(monthly_df['Product Name'].str.strip().unique())

    pivot_table = df.pivot_table(
        index='City',
        columns='Product Name',
        values='yhat',
        aggfunc='mean'
    )

    pivot_table = pivot_table.reindex(index=all_cities, columns=all_products, fill_value=0)

    plt.figure(figsize=(18, 9))
    sns.heatmap(pivot_table, annot=True, fmt=".0f", cmap="YlOrBr",
                linewidths=0.5, linecolor='gray')
    plt.title(f"🔥 Heatmap for {selected_month}")
    plt.xlabel("Product Name")
    plt.ylabel("City")
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()

    if not os.path.exists("static"):
        os.makedirs("static")

    output_path = os.path.join("static", "heatmap.png")
    plt.savefig(output_path)
    plt.close()

    return send_file(output_path, mimetype='image/png')

# ✅✅✅ ---------------------------
# Run server
if __name__ == '__main__':
    app.run(debug=True)
