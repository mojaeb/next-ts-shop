import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { toPercent } from '../../utils/calculate'
import { joinClasses } from '../../utils/style'
import CurrencyText from '../CurrencyText'
import DiscountLabel from './DiscountLabel'
import './../../utils/global'
import { MdPhone } from 'react-icons/md'

interface PostProps {
    fullWidth?: boolean
    className?: string
    disableMeta?: boolean
    categoryTitle?: string
    title?: string
    price?: number
    discount?: number
    image?: string
    to?: string | number
    loading?: boolean
    totalQuantity: number
    variantsLength: number
    originPrice: number
    variablePrice?: boolean
}

const Post: React.FC<PostProps> = ({
    fullWidth = false,
    className = '',
    disableMeta = false,
    title = '',
    categoryTitle = '',
    price = 0,
    discount = 0,
    image,
    to = '',
    totalQuantity = 0,
    variantsLength = 0,
    originPrice = 0,
    variablePrice = false,
}) => {
    const containerClasses = joinClasses([
        'bg-white',
        'active:bg-gray-100',
        'shadow-sm',
        'cursor-pointer',
        fullWidth ? 'w-full' : 'w-60',
        disableMeta ? 'h-auto pb-5' : 'h-60 sm:h-72',
        'p-2',
        'rounded-2xl',
        'flex',
        'flex-col',
        'hover:shadow-lg',
        'duration-300',
        'border border-gray-100',
        'relative',
        'overflow-hidden',
        className,
    ])

    const price_after_discount = price.toToman()
    const origin_price = originPrice.toToman()
    const discountPrice = discount.toToman()

    const percent = toPercent(origin_price, discountPrice)

    return (
        <LinkWrapper
            disabled={!(totalQuantity && variantsLength) && !variablePrice}
            to={`/product/${to}`}
        >
            <a className={containerClasses}>
                <div
                    className={
                        'relative border bg-gray-200 border-gray-100 w-full h-44 overflow-hidden rounded-2xl'
                    }
                >
                    {image && (
                        <Image
                            src={image}
                            objectFit={'cover'}
                            layout={'fill'}
                            alt={title}
                        />
                    )}
                </div>

                <p className={'px-2 pt-3 sm:text-base text-sm text-gray-800'}>
                    {title}
                </p>
                <a
                    className={
                        'px-2 pt-1 hidden sm:inline text-xs text-gray-500 cursor-pointer'
                    }
                >
                    {categoryTitle}
                </a>
                {variablePrice && (
                    <div className={'flex items-end flex-1 m-1'}>
                        <div
                            className={
                                'flex items-center mt-2 bg-gray-100 gap-2 rounded-xl py-1.5 px-2 text-gray-600'
                            }
                        >
                            <i
                                className={
                                    'p-1  text-white rounded-full bg-gradient-to-b from-green-400 to-green-600'
                                }
                            >
                                <MdPhone size={15} />
                            </i>
                            <div className={'ml-2 text-sm'}>تماس بگیرید</div>
                        </div>
                    </div>
                )}
                {!disableMeta && !variablePrice && (
                    <div
                        className={
                            'flex items-end justify-between px-2 flex-grow pb-3'
                        }
                    >
                        <div className={'flex flex-col items-start'}>
                            {discountPrice ? (
                                <DiscountLabel>
                                    {percent}%{' '}
                                    <span
                                        className={'text-xs hidden sm:inline'}
                                    >
                                        تخفیف
                                    </span>
                                </DiscountLabel>
                            ) : null}
                        </div>
                        <div>
                            {discountPrice ? (
                                <CurrencyText
                                    currency={origin_price}
                                    isDiscounted={true}
                                    size={'xs sm:text-sm'}
                                />
                            ) : null}
                            {price_after_discount && (
                                <CurrencyText
                                    currency={price_after_discount}
                                    size={'md sm:text-lg'}
                                />
                            )}
                        </div>
                    </div>
                )}
                {!(totalQuantity && variantsLength) && !variablePrice && (
                    <div
                        className={
                            'absolute inset-0 bg-white bg-opacity-70  flex items-center justify-center px-10'
                        }
                    >
                        <div
                            className={
                                'bg-white text-sm text-center shadow-sm text-gray-600 bg-opacity-90 rounded-lg px-5 py-5'
                            }
                        >
                            {!variantsLength ? (
                                <p>قیمتی برای این کالا تعریف نشده</p>
                            ) : (
                                <p>موجودی کالا به اتمام رسیده</p>
                            )}
                        </div>
                    </div>
                )}
            </a>
        </LinkWrapper>
    )
}

const LinkWrapper = ({
    disabled = false,
    children,
    to,
}: {
    to: string
    disabled: boolean
    children: React.ReactChild
}): JSX.Element => {
    if (disabled) {
        return <React.Fragment>{children}</React.Fragment>
    }
    return <Link href={to}>{children}</Link>
}

export default Post
