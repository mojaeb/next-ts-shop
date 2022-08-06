import React, { useState } from 'react'
import {
    CartProps,
    getCart,
    getLikes,
    getUserInfo,
    LikeProps,
    UserInfoProps,
} from '../services/api/requests'
import { isAuthenticated } from '../utils/authentication'

interface ContextProps {
    cartCount: number
    incrementCartCount: (count: number) => void
    countOfLikedProducts: number
    checkProductInLikedList: (productId: number) => boolean
    addToLikeList: (productId: number) => void
    removeFromLikeList: (productId: number) => void
    profile: UserInfoProps | null
}

let counter = 0

export const StoreContext = React.createContext({
    cartCount: 0,
    countOfLikedProducts: 0,
    incrementCartCount: (): void => undefined,
    checkProductInLikedList: (): boolean => false,
    addToLikeList: () => undefined,
    removeFromLikeList: () => undefined,
    profile: null,
} as ContextProps)

export const StoreProvider = ({
    children,
}: {
    children: React.ReactNode
}): JSX.Element => {
    const [cartCount, setCartCount] = useState(0)
    const [likedProducts, setLikedProducts] = useState<number[]>([])
    const [profile, setProfile] = React.useState<UserInfoProps | null>(null)

    const incrementCartCount = (count = 1) => {
        counter += count
        setCartCount(counter)
    }

    const countOfLikedProducts = likedProducts.length

    const checkProductInLikedList = (productId: number) => {
        return Boolean(likedProducts.find((id) => id === productId))
    }

    const addToLikeList = (id: number) => {
        setLikedProducts([...likedProducts, id])
    }
    const removeFromLikeList = (id: number) => {
        setLikedProducts(likedProducts.filter((pid) => pid !== id))
    }

    const handleGetUserProfile = async () => {
        if (isAuthenticated()) {
            try {
                const profile = await getUserInfo()
                setProfile(profile)
            } catch (err) {
                console.log(err)
            }
        }
    }

    React.useEffect(() => {
        const handleGetCart = async () => {
            if (isAuthenticated()) {
                try {
                    const cart: CartProps = await getCart()
                    const likes: LikeProps[] = await getLikes()
                    const liked = likes.reduce((acc: number[], curr) => {
                        acc = [...acc, curr.product.id]
                        return acc
                    }, [] as number[])
                    setLikedProducts(liked)
                    const count = cart?.order_items.reduce(
                        (acc, curr) => acc + curr.quantity,
                        0
                    )
                    incrementCartCount(count)
                } catch (err) {
                    console.log(
                        'you are not logged in please login and enjoy features'
                    )
                }
            }
        }
        handleGetCart()
        handleGetUserProfile()
    }, [])
    return (
        <StoreContext.Provider
            value={{
                cartCount,
                incrementCartCount,
                countOfLikedProducts,
                checkProductInLikedList,
                addToLikeList,
                removeFromLikeList,
                profile,
            }}
        >
            {children}
        </StoreContext.Provider>
    )
}
