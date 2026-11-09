export const formatMarketCap = (marketCap: number):string => {
    switch(true){
        case (marketCap >= 1000000000000):
            return (marketCap / 1000000000000).toFixed(2) + "T";
        case (marketCap >= 1000000000):
            return (marketCap / 1000000000).toFixed(1) + "B";
        case (marketCap >= 1000000):
            return (marketCap / 1000000).toFixed(1) + "M";    
        case (marketCap >= 1000):
            return (marketCap / 1000).toFixed(1) + "K";                    
        default:
            return marketCap.toLocaleString();
    }
}

// Price Coin Price for Display
export const formatPrice = (price:number) => {
      // Math.log10(0) is -Infinity, which made toFixed() throw for 0 (and NaN for negatives)
      if (!Number.isFinite(price) || price <= 0) return "0.00"
      return  price > 10
              ? price.toLocaleString(undefined,
                {'minimumFractionDigits':2,'maximumFractionDigits':2})
              : price > 1
              ? price.toFixed(2)
              : price.toFixed(Math.floor(Math.log10(price)) * -1 + 3)
}


export const formatPercent = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return "—"
  return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`
}

export const isPositive = (value: number | null | undefined): boolean => {
  return typeof value === "number" && value >= 0
}