class PriceFormatter {
  format(price: number): string {
    return price.toLocaleString('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
  }
}

export const priceFormatter = new PriceFormatter();
