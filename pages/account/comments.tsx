import { NextPage } from 'next/'
import Image from 'next/image'
import React from 'react'
import { RiChat1Line } from 'react-icons/ri'
import Menu, { menuItems } from '../../components/Account/Menu'
import Button from '../../components/common/Button'
import Container from '../../components/Container'
import Layout from '../../components/Layout'
import { CategoryProps, getCategories } from '../../services/api/requests'

export const getStaticProps = async (): Promise<unknown> => {
    let categories: CategoryProps[] = await getCategories()
    return { props: { categories }, revalidate: 2000 }
}

const Comments: NextPage<{ categories: CategoryProps[] }> = ({
    categories,
}) => {
    return (
        <Layout
            categories={categories}
            ignoreFooterMarginTop
            title={'account-Comments'}
        >
            <div
                className={'grid grid-cols-10 relative'}
                style={{ minHeight: 'calc(100vh - 80px)' }}
            >
                <Menu hiddenInMobile activeItem={menuItems.comments} />
                <Container
                    className={
                        'col-span-10 sm:col-span-8 p-2 sm:p-5 sm:pl-6 sm:pr-6'
                    }
                >
                    <div
                        className={
                            'h-full bg-white rounded-xl overflow-hidden relative'
                        }
                    >
                        <div
                            className={
                                'inset-0 flex- flex-col divide-y sm:absolute overflow-auto scrollbar-thin px-4'
                            }
                        >
                            {[...new Array(10)].map((_value, index) => (
                                <div
                                    key={index}
                                    className={
                                        'sm:px-6 py-3 flex flex-row items-center gap-2 sm:gap-5'
                                    }
                                >
                                    <div
                                        className={
                                            'w-14 h-14 rounded-lg relative overflow-hidden'
                                        }
                                    >
                                        <Image
                                            alt={'image1'}
                                            src={'/product-2.webp'}
                                            layout={'fill'}
                                        />
                                    </div>
                                    <div>
                                        <p>محصول شماره 3 نقش برحسته</p>
                                        <p
                                            className={
                                                'hidden sm:block text-xs text-gray-400'
                                            }
                                        >
                                            name of the product{' '}
                                        </p>
                                    </div>
                                    <div
                                        className={
                                            'flex-1 gap-12 flex items-center justify-end'
                                        }
                                    >
                                        <div
                                            className={
                                                'hidden sm:flex gap-2 text-sm items-center text-gray-700'
                                            }
                                        >
                                            <RiChat1Line size={22} />
                                            34 نظر
                                        </div>
                                        <Button
                                            className={'text-sm'}
                                            variant={'soft'}
                                            title={'نظر دادن'}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Container>
            </div>
        </Layout>
    )
}

export default Comments
