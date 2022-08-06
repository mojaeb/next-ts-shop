import React from 'react'

interface CardProps {
    children: React.ReactNode
    width?: number | string
    className?: string
    style?: React.StyleHTMLAttributes<StyleSheet>
}
const Card: React.FC<CardProps> = ({
    children,
    width = 'full',
    className = '',
    style,
}): JSX.Element => {
    return (
        <div
            style={style}
            className={`bg-white w-${width} ${className} rounded-xl flex flex-col px-4 py-4`}
        >
            {children}
        </div>
    )
}

export default Card
