import { joinClasses } from '../utils/style'
import React from 'react'

type currencyTextTypes = {
    currency: number
    isDiscounted?: boolean
    size?: string | 'base' | 'md' | 'lg' | 'sm' | 'xs' // tailwindCss text parameters
    type?: currencyTypes | currencyTypes.toman | currencyTypes.rial
}

enum currencyTypes {
    toman = 'تومان',
    rial = 'ریال',
}

const CurrencyText = ({
    currency,
    isDiscounted,
    size,
    type,
}: currencyTextTypes): JSX.Element => {
    const classes = joinClasses([
        `text-${size}`,
        isDiscounted ? `text-red-500 line-through` : 'text-black',
    ])
    return (
        <p className={classes}>
            {currency.toString().separateThousand()}
            <span className={'text-xs'}>{type}</span>
        </p>
    )
}

CurrencyText.defaultProps = {
    type: currencyTypes.toman,
}

export default CurrencyText
