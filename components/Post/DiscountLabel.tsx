import React from 'react'

const DiscountLabel = ({
    children,
}: {
    children: React.ReactNode
}): JSX.Element => {
    return (
        <div
            className={
                'bg-gradient-to-r from-red-400 to-red-600 rounded-2xl text-white text-sm px-3'
            }
            style={{
                paddingTop: 2,
                paddingBottom: 2,
            }}
        >
            {children}
        </div>
    )
}

export default DiscountLabel
