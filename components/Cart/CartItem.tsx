import NumberField from '../common/NumberField'
import PriceText from '../common/PriceText'
import Image from 'next/image'
import { RiDeleteBinLine } from 'react-icons/ri'
import Link from 'next/link'

interface CartItemProps {
    onDelete: () => void
    onIncrement: () => void
    onDecrement: () => void
    quantity: number
    slug: string
    title: string
    productId: number
    pictureUrl: string
    unitPrice: number | string
    unitDiscount: number | string
    totalPrice: number | string
}
const CartItem: React.FC<CartItemProps> = ({
    quantity,
    onIncrement,
    onDecrement,
    onDelete,
    unitPrice,
    unitDiscount,
    pictureUrl,
    slug,
    title,
    totalPrice,
    productId,
}): JSX.Element => {
    return (
        <div
            className={
                'bg-white rounded-lg px-3 py-3 flex  items-center gap-2 sm:gap-7'
            }
        >
            <div
                className={
                    'h-16 w-28 bg-gray-400 overflow-hidden rounded-lg relative'
                }
            >
                <Image
                    src={pictureUrl}
                    alt={'product image'}
                    layout={'fill'}
                    objectFit={'cover'}
                />
            </div>
            <div className={'flex flex-col sm:flex-row flex-1 gap-6 sm:gap-2'}>
                <div className={'sm:flex-1 relative'}>
                    <Link href={`/product/${productId}`}>
                        <a
                            className={
                                'sm:absolute h-6 inset-0 hover:underline'
                            }
                        >
                            <p
                                className={
                                    'text-md absolute sm:static overflow-ellipsis overflow-hidden w-full sm:text-lg whitespace-nowrap'
                                }
                            >
                                {title}
                            </p>
                            <p
                                className={
                                    'text-sm hidden sm:block text-gray-400'
                                }
                            >
                                {slug}
                            </p>
                        </a>
                    </Link>
                </div>
                <div
                    className={
                        'flex flex-row-reverse sm:flex-row gap-2 sm:gap-4 items-center'
                    }
                >
                    <NumberField
                        number={quantity}
                        onIncrement={onIncrement}
                        onDecrement={onDecrement}
                    />

                    <div className={'text-center hidden md:block'}>
                        <p className={'text-red-400 line-through text-sm'}>
                            <PriceText price={unitDiscount} />
                        </p>
                        <PriceText price={unitPrice} />
                    </div>
                    <div className={'text-center'}>
                        <p className={'text-gray-500 text-xs sm:block hidden'}>
                            قیمت کل
                        </p>
                        <p className={'whitespace-nowrap'}>
                            <PriceText
                                price={totalPrice}
                                className={'text-sm sm:text-base inline'}
                            />
                            <span className={'text-xs'}> تومان</span>
                        </p>
                    </div>
                    <div
                        onClick={onDelete}
                        className={
                            'p-2 m-2 hidden sm:block hover:bg-red-500 hover:text-white rounded-xl transition cursor-pointer'
                        }
                    >
                        <RiDeleteBinLine />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartItem
