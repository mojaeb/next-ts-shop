import { NextPage } from 'next/'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Menu, { menuItems } from '../../components/Account/Menu'
import Chip from '../../components/common/Chip'
import CircularProgress from '../../components/common/CircularProgress'
import PriceText from '../../components/common/PriceText'
import Container from '../../components/Container'
import Layout from '../../components/Layout'
import {
    CartProps,
    CategoryProps,
    getCategories,
    getOrders,
} from '../../services/api/requests'
import { relativeToAbsoluteURL } from '../../utils/convertors'
import { format } from '../../utils/datetime'
import '../../utils/global'

export const useOrder = (): { orders: CartProps[]; loading: boolean } => {
    const [orders, setOrders] = useState<CartProps[]>([])
    const [loading, setLoading] = useState(false)

    const handleGetOrders = async () => {
        setLoading(true)
        try {
            const data = await getOrders()
            setOrders(data)
            setLoading(false)
        } catch (err) {
            setLoading(false)
            toast.error('ارتباط شما برقرار نیست یا به این صفحه دسترسی ندارید')
        }
    }

    useEffect(() => {
        handleGetOrders()
    }, [])

    return {
        orders,
        loading,
    }
}

export const getStaticProps = async (): Promise<unknown> => {
    let categories: CategoryProps[] = await getCategories()
    return { props: { categories }, revalidate: 2000 }
}

const Orders: NextPage<{ categories: CategoryProps[] }> = ({ categories }) => {
    const { orders, loading } = useOrder()
    return (
        <Layout
            categories={categories}
            ignoreFooterMarginTop
            title={'account-Orders'}
        >
            <div
                className={'grid grid-cols-10 relative'}
                style={{ minHeight: 'calc(100vh - 80px)' }}
            >
                <Menu hiddenInMobile activeItem={menuItems.orders} />
                <Container
                    className={
                        'col-span-10 sm:col-span-8 sm:p-5 p-2 sm:pl-6 sm:pr-6'
                    }
                >
                    <div
                        className={
                            'h-full bg-white rounded-xl overflow-hidden flex flex-col divide-y'
                        }
                    >
                        <div className={'flex-1 relative'}>
                            <div
                                className={
                                    'inset-0 sm:absolute py-2 sm:px-4 scrollbar-thin overflow-y-auto flex flex-col divide-y'
                                }
                            >
                                {loading && (
                                    <div className={'mt-8'}>
                                        <CircularProgress />
                                    </div>
                                )}
                                {/* items */}
                                {orders.map((o, index) => (
                                    <OrderItem {...o} key={index} />
                                ))}
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        </Layout>
    )
}

export const OrderItem: React.FC<CartProps> = (props): JSX.Element => {
    return (
        <div className={'px-2 py-2 flex flex-col'}>
            <div className={'flex justify-between items-center sm:mx-4'}>
                <div
                    className={
                        'flex flex-col w-full sm:w-auto sm:flex-row gap-2 sm:gap-5'
                    }
                >
                    <Chip color={'red'}>{format(props.created_at)}</Chip>
                    {/*<Chip>شناسه: MA-43245</Chip> */}
                    {props.canceled ? (
                        <Chip color={'red'}>لغو شده</Chip>
                    ) : props.payment_succeed &&
                      !props.warehouse_confirmation ? (
                        <Chip>درحال بررسی</Chip>
                    ) : props.payment_succeed &&
                      props.warehouse_confirmation &&
                      !props.delivered ? (
                        <Chip>موجود در انبار</Chip>
                    ) : props.payment_succeed && props.delivered ? (
                        <Chip>ارسال شده</Chip>
                    ) : (
                        <Chip>پرداخت نشده</Chip>
                    )}
                </div>
                {/* <div
                    className={
                        'underline text-primary-500 px-5 py-2 rounded-lg'
                    }
                >
                    مشاهده جزییات
                </div> */}
            </div>
            <div
                className={
                    'rounded-lg bg-gray-50 px-6 py-4 my-2 flex justify-between items-center'
                }
            >
                <div className={'hidden sm:flex gap-3'}>
                    {props.order_items.slice(0, 5).map((oi, index) => (
                        <div
                            key={index}
                            className={
                                'w-14 h-14 rounded-lg relative overflow-hidden'
                            }
                        >
                            <Image
                                alt={'image1'}
                                src={relativeToAbsoluteURL(oi.product.image)}
                                layout={'fill'}
                            />
                        </div>
                    ))}
                    {props.order_items.length > 5 && (
                        <div
                            className={
                                'w-14 h-14 rounded-lg bg-white border border-gray-100 shadow-sm flex justify-center items-center text-2xl text-gray-400'
                            }
                        >
                            {props.order_items.length - 5}+
                        </div>
                    )}
                </div>
                <div className={'flex flex-col items-end'}>
                    <p className={'text-2xl text-green-500 flex gap-2'}>
                        <PriceText
                            price={
                                props?.amount
                                    ? props.amount.toToman()
                                    : props.total_price.toToman() | 0
                            }
                        />{' '}
                        کل
                    </p>
                    <p
                        className={
                            'text-sm text-red-400 flex flex-col items-end gap-2'
                        }
                    >
                        <span>
                            {Number(props.total_discount | 0)
                                .toToman()
                                .toString()
                                .separateThousand()}{' '}
                            تخفیف
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Orders
