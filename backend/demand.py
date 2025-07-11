import matplotlib.pyplot as plt
import seaborn as sns

def generate_heatmap(monthly_df, output_path, filter_city=None, filter_product=None):
    df = monthly_df.copy()
    if filter_city:
        df = df[df['City'] == filter_city]
    if filter_product:
        df = df[df['Product Name'] == filter_product]

    pivot_table = df.pivot_table(
        index='City',
        columns='Product Name',
        values='yhat',
        aggfunc='mean'
    )

    plt.figure(figsize=(12, 6))
    sns.heatmap(pivot_table, annot=True, fmt=".0f", cmap="YlOrBr")
    plt.title("Heatmap of Forecasted Monthly Demand by City and Product")
    plt.xlabel("Product Name")
    plt.ylabel("City")
    plt.tight_layout()
    plt.savefig(output_path)
    plt.close()
