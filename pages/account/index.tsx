import { NextPage } from 'next/'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import AddressField from '../../components/Account/AddressField'
import Menu, { menuItems } from '../../components/Account/Menu'
import CircularProgress from '../../components/common/CircularProgress'
import Container from '../../components/Container'
import Layout from '../../components/Layout'
import { CategoryProps, getCategories } from '../../services/api/requests'
import { useAddress } from './addresses'
import { OrderItem, useOrder } from './orders'

export const getStaticProps = async (): Promise<unknown> => {
    let categories: CategoryProps[] = await getCategories()
    return { props: { categories }, revalidate: 2000 }
}

const Account: NextPage<{ categories: CategoryProps[] }> = ({ categories }) => {
    const router = useRouter()
    const { addresses, loading: addressLoading } = useAddress()
    const { orders, loading: orderLoading } = useOrder()

    return (
        <Layout categories={categories} ignoreFooterMarginTop title={'داشبورد'}>
            <div
                className={'grid grid-cols-10 relative'}
                style={{ minHeight: 'calc(100vh - 80px)' }}
            >
                <Menu activeItem={menuItems.dashboard} />
                <Container
                    className={'hidden sm:block col-span-8 p-6'}
                    hasDefaultStyle={false}
                >
                    <div className={'grid-cols-6 flex flex-col lg:grid gap-6'}>
                        <div
                            className={
                                'col-span-3 divide-y bg-white h-60  rounded-lg overflow-hidden '
                            }
                        >
                            <div className={'px-8 py-3 flex justify-between'}>
                                <p className={'text-gray-600'}>آدرس ها</p>
                                <Link passHref href={'/account/addresses'}>
                                    <p
                                        className={
                                            'text-primary-500 cursor-pointer text-sm underline'
                                        }
                                    >
                                        بیشتر
                                    </p>
                                </Link>
                            </div>
                            <div>
                                {addressLoading && (
                                    <div className={'mt-8'}>
                                        <CircularProgress />
                                    </div>
                                )}
                                {addresses.map((a, index) => (
                                    <AddressField
                                        city={a.city}
                                        state={a.state}
                                        address={a.address}
                                        onEdit={() =>
                                            router.push('/account/addresses')
                                        }
                                        receiverName={
                                            a.is_mine
                                                ? `${a.user.first_name} ${a.user.last_name}`
                                                : `${a.first_name} ${a.last_name} `
                                        }
                                        phoneNumber={a.user.phone_number}
                                        key={index}
                                        ignoreMeta={true}
                                    />
                                ))}
                            </div>
                        </div>
                        <div
                            className={
                                'col-span-3 divide-y bg-white h-60  rounded-lg overflow-hidden '
                            }
                        >
                            <div className={'px-8 py-3 flex justify-between'}>
                                <p className={'text-gray-600'}>سفارش ها</p>
                                <Link passHref href={'/account/orders'}>
                                    <p
                                        className={
                                            'text-primary-500 cursor-pointer text-sm underline'
                                        }
                                    >
                                        بیشتر
                                    </p>
                                </Link>
                            </div>
                            <div>
                                {orderLoading && (
                                    <div className={'mt-8'}>
                                        <CircularProgress />
                                    </div>
                                )}
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

export default Account
