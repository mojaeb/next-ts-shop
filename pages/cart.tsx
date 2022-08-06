import { NextPage } from 'next'
import React, { useContext, useEffect, useState } from 'react'
import CartItemsSheet from '../components/Cart/CartItemSheet'
import PriceItem from '../components/Cart/PriceItem'
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import Container from '../components/Container'
import Layout from '../components/Layout'
import Link from 'next/link'
import './../utils/global'
import {
    CartProps,
    CategoryProps,
    decrementQuantityOfOrderItem,
    getCart,
    getCategories,
    incrementQuantityOfOrderItem,
    removeCartItem,
} from '../services/api/requests'
import toast, { Toaster } from 'react-hot-toast'
import { StoreContext } from '../components/StoreState'

export enum CartType {
    checkout,
}

export const useCart = (
    type: CartType | null | undefined | void
): {
    handleDecrementQuantity: (orderId: number) => void
    handleIncrementQuantity: (orderId: number) => void
    cart: CartProps | null
    handleRemoveCartItem: (orderId: number, quantity: number) => void
    loading: boolean
    setLoading: (status: boolean) => void
    handleGetCart: () => void
} => {
    const [cart, setCart] = useState<CartProps | null>(null)
    const [loading, setLoading] = useState(false)
    const { incrementCartCount } = useContext(StoreContext)

    const handleGetCart = async (hasShippingPrice = false) => {
        setLoading(true)
        try {
            const cart = await getCart(hasShippingPrice)
            setLoading(false)
            setCart(cart)
        } catch {
            setLoading(false)
        }
    }

    const handleReload = () => {
        handleGetCart(type === CartType.checkout)
    }

    const handleIncrementQuantity = async (orderId: number) => {
        setLoading(true)
        try {
            await incrementQuantityOfOrderItem(orderId)
            handleReload()
            incrementCartCount(1)
        } catch (err) {
            toast.error('موجودی به اتمام رسیده')
            setLoading(false)
        }
    }
    const handleDecrementQuantity = async (orderId: number) => {
        setLoading(true)
        await decrementQuantityOfOrderItem(orderId)
        incrementCartCount(-1)
        handleReload()
    }
    const handleRemoveCartItem = async (orderId: number, quantity: number) => {
        setLoading(true)
        try {
            await removeCartItem(orderId)
            incrementCartCount(-quantity)
            setTimeout(() => {
                handleReload()
            }, 500)
        } catch (err) {
            setLoading(false)
        }
    }
    useEffect(() => {
        handleGetCart(type === CartType.checkout)
    }, [type])

    return {
        handleDecrementQuantity,
        handleIncrementQuantity,
        cart,
        handleRemoveCartItem,
        loading,
        setLoading,
        handleGetCart: handleReload,
    }
}

export const getStaticProps = async (): Promise<unknown> => {
    let categories: CategoryProps[] = await getCategories()
    return { props: { categories }, revalidate: 200 }
}

const CartPage: NextPage<{ categories: CategoryProps[] }> = ({
    categories,
}) => {
    const {
        handleDecrementQuantity,
        handleIncrementQuantity,
        cart,
        handleRemoveCartItem,
        loading,
    } = useCart()

    return (
        <Layout title={'cart page'} categories={categories}>
            <Container
                className={
                    'flex flex-col min-h-96 md:flex-row pt-3 sm:pt-10 pb-10 gap-5'
                }
            >
                <div className={'flex-1'}>
                    <CartItemsSheet
                        removeItem={handleRemoveCartItem}
                        items={cart?.order_items}
                        loading={loading}
                        incrementQuantity={handleIncrementQuantity}
                        decrementQuantity={handleDecrementQuantity}
                    />
                </div>
                <div>
                    <Card width={'auto md:w-80'}>
                        <div className={'flex flex-col pb-5 divide-y'}>
                            <PriceItem
                                price={cart?.total_price.toToman()}
                                label={'قیمت کل'}
                            />
                            <PriceItem
                                price={cart?.total_discount.toToman()}
                                label={'قیمت تخفیف'}
                            />
                            <PriceItem
                                price={cart?.total_price_after_discount.toToman()}
                                size={'lg'}
                                ignoreColor
                                label={'قیمت نهایی'}
                            />
                        </div>
                        <Link href={'/checkout'} passHref>
                            <Button title={'ادامه فراید خرید'} />
                        </Link>
                    </Card>
                </div>
            </Container>
            <Toaster position="bottom-center" />
        </Layout>
    )
}

export default CartPage
