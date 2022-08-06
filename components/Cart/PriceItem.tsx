import React from 'react'
import { sizeTypes } from '../../types/tailwindcss'
import PriceText from '../common/PriceText'

type PriceItemTypes = {
    price: number | undefined
    label: string
    size?: sizeTypes
    ignoreColor?: boolean
    error?: boolean
}
const PriceItem = ({
    price = 0,
    label,
    size = 'md',
    ignoreColor,
    error = false,
}: PriceItemTypes): JSX.Element => {
    let color = !ignoreColor
        ? error
            ? 'bg-red-100 text-red-500'
            : `bg-gray-100 text-gray-600`
        : ''
    return (
        <div
            className={`px-3 py-3 text-${size} flex items-center justify-between`}
        >
            <p>{label}</p>
            <p className={`px-5 py-1 flex gap-1 ${color} rounded-lg`}>
                <PriceText price={price} />
                <p>تومان</p>
            </p>
        </div>
    )
}

export default PriceItem
