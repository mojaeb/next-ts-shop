export const toTomanCurrency = (price: number): number => {
    return price / 10
}

export const toPercent = (price: number, discount: number): number => {
    return Math.round(100 / (price / discount))
}
