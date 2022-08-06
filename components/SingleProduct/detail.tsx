import React from 'react'

const ProductDetail = ({
    children,
}: {
    children: React.ReactChild
}): JSX.Element => {
    return <p className={'h-96 sm:h-auto'}>{children}</p>
}

export default ProductDetail
