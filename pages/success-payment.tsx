import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import CircularProgress from '../components/common/CircularProgress'
import Layout from '../components/Layout'
import {
    CategoryProps,
    getCategories,
    verifyPayment,
} from '../services/api/requests'

export const getStaticProps = async (): Promise<unknown> => {
    let categories: CategoryProps[] = await getCategories()
    return { props: { categories }, revalidate: 200 }
}

const SuccessPayment: NextPage<{ categories: CategoryProps[] }> = ({
    categories,
}) => {
    const router = useRouter()

    useEffect(() => {
        // handle verify payment
        const handleVerifyPayment = async () => {
            const authority: string = router?.query.Authority as string
            const status: string = router?.query.Status as string
            try {
                await verifyPayment({ authority, status })
                setTimeout(() => {
                    router.push('/account/orders')
                }, 2000)
            } catch (err) {
                toast.error('پرداخت انجام نشد')
                setTimeout(() => {
                    router.push('/checkout')
                }, 1000)
            }
        }
        // check address
        if (router.query?.Authority) {
            handleVerifyPayment()
        }
    }, [router])

    return (
        <Layout title={'success payment'} categories={categories}>
            <div
                className={
                    'min-h-screen flex justify-center flex-col items-center pb-32'
                }
            >
                <div className={'p-5'}>
                    <CircularProgress size={'20'} />
                </div>
                <p className={'text-lg font-bold mx-10 text-primary-600'}>
                    در حال بررسی پرداخت
                </p>
                <span
                    className={'text-primary-500 py-2 text-sm cursor-pointer'}
                >
                    <p>منتظر بمانید</p>
                </span>
            </div>
            <Toaster position={'bottom-center'} />
        </Layout>
    )
}

export default SuccessPayment
