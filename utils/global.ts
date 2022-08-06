import { toTomanCurrency } from './calculate'

declare global {
    interface Number {
        toToman: () => number
    }
    interface String {
        separateThousand: () => string
    }
}

Number.prototype.toToman = function (): number {
    return toTomanCurrency(this as number)
}

String.prototype.separateThousand = function (): string {
    return this.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
