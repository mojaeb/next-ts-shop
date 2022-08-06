import React from 'react'

const DescriptionText = ({
    children,
}: {
    children: React.ReactNode
}): JSX.Element => {
    return (
        <p className={'text-sm text-gray-500 text-center px-5'}>{children}</p>
    )
}

export default DescriptionText
