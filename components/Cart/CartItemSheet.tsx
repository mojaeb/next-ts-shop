import React from 'react'
import { CartItemProps } from '../../services/api/requests'
import { relativeToAbsoluteURL } from '../../utils/convertors'
import OverlayLoading from '../common/OverlayLoading'
import CartItem from './CartItem'

const CartItemsSheet: React.FC<{
    items: CartItemProps[] | undefined
    loading: boolean
    incrementQuantity: (orderId: number) => void
    decrementQuantity: (orderId: number) => void
    removeItem: (orderId: number, quantity: number) => void
}> = ({
    items = [],
    loading,
    incrementQuantity,
    decrementQuantity,
    removeItem,
}): JSX.Element => {
    return (
        <div className={'flex relative flex-col gap-5'}>
            {loading && <OverlayLoading />}

            {items.map((item, index) => {
                return (
                    <CartItem
                        key={index}
                        productId={item.product.id}
                        quantity={item.quantity}
                        slug={item.product.slug}
                        onDelete={() => removeItem(item.id, item.quantity)}
                        onIncrement={() => incrementQuantity(item.id)}
                        onDecrement={() => decrementQuantity(item.id)}
                        unitPrice={item.product_variant.price.toToman()}
                        unitDiscount={item.product_variant.discount.toToman()}
                        totalPrice={item.total_price_after_discount.toToman()}
                        title={item.product.title}
                        pictureUrl={relativeToAbsoluteURL(item.product.image)}
                    />
                )
            })}
        </div>
    )
}

export default CartItemsSheet
