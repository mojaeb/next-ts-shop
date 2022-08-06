import { NextPage } from 'next/'
import React from 'react'
import Menu, { menuItems } from '../../components/Account/Menu'
import Button from '../../components/common/Button'
import Container from '../../components/Container'
import Layout from '../../components/Layout'
import { CategoryProps, getCategories } from '../../services/api/requests'

export const getStaticProps = async (): Promise<unknown> => {
    let categories: CategoryProps[] = await getCategories()
    return { props: { categories }, revalidate: 2000 }
}

const Notification: NextPage<{ categories: CategoryProps[] }> = ({
    categories,
}) => {
    return (
        <Layout
            categories={categories}
            ignoreFooterMarginTop
            title={'account-Addresses'}
        >
            <div
                className={'grid grid-cols-10 relative'}
                style={{ minHeight: 'calc(100vh - 80px)' }}
            >
                <Menu hiddenInMobile activeItem={menuItems.notifications} />
                <Container
                    className={
                        'col-span-10 sm:col-span-8 p-1 sm:p-5 sm:pl-6 sm:pr-6'
                    }
                >
                    <div
                        className={
                            'h-full bg-white rounded-xl overflow-hidden relative'
                        }
                    >
                        <div
                            className={
                                'inset-0 flex- flex-col divide-y sm:absolute overflow-auto scrollbar-thin sm:px-4'
                            }
                        >
                            {[...new Array(10)].map((_value, index) => (
                                <div
                                    key={index}
                                    className={
                                        'px-6 py-3 flex flex-row items-center gap-5'
                                    }
                                >
                                    <div>
                                        <p>اعلانات شماره 5 نمره 3</p>
                                        <p className={'text-xs text-gray-400'}>
                                            name of the product{' '}
                                        </p>
                                    </div>
                                    <div
                                        className={
                                            'flex-1 gap-12 flex items-center justify-end'
                                        }
                                    >
                                        <Button
                                            variant={'soft'}
                                            title={'مشاهده جزییات'}
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

export default Notification
