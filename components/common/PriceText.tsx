import React from 'react'
import { sizeTypes } from '../../types/tailwindcss'
import { joinClasses } from '../../utils/style'
import '../../utils/global'

interface DiscountLabelProps {
    price: number | string
    textSize?: sizeTypes
    className?: string
}

const PriceText: React.FC<DiscountLabelProps> = ({
    price,
    textSize = 'md',
    className = '',
}): JSX.Element => {
    const classes = joinClasses([`text-${textSize}`, className])
    return <p className={classes}>{price.toString().separateThousand()}</p>
}

export default PriceText
