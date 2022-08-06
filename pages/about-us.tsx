import { NextPage } from 'next'
import React from 'react'
import Container from '../components/Container'
import Layout from '../components/Layout'
import Image from 'next/image'
import { data } from '../components/Footer'
import { CategoryProps, getCategories } from '../services/api/requests'

export const getStaticProps = async (): Promise<unknown> => {
    let categories: CategoryProps[] = await getCategories()
    return { props: { categories }, revalidate: 2000 }
}

const AboutUs: NextPage<{ categories: CategoryProps[] }> = ({ categories }) => {
    return (
        <Layout title="درباره ما" categories={categories}>
            <Container>
                <div className={'bg-white p-5 rounded-xl mt-8 min-h-screen'}>
                    <div
                        className={
                            'w-full relative rounded-xl shadow-md overflow-hidden'
                        }
                    >
                        <Image
                            src={'/team.jpg'}
                            alt={'medicaap team'}
                            layout={'responsive'}
                            width={700}
                            height={400}
                        />
                    </div>

                    <div className={'mt-10 flex flex-col gap-2'}>
                        <div>
                            <p>
                                شرکت آرمان اطلس پارسا به طور رسمی از سال ۱۳۹۸
                                فعالیت خود را با برند مدیکپ در زمینه دندانپزشکی
                                و پزشکی آغاز کرد. فروشگاه اینترنتی مدیکپ با
                                استفاده از عرصه دیجیتال یک وبسایت نوآورانه با
                                آخرین روندهای جهانی توسعه محصولات جدید،مارک های
                                معروف این اصناف را در اختیار شما قرار می دهد.
                            </p>
                            <p>
                                اهداف مهم این مجموعه ارتقا و بهبود کیفیت در
                                اقلام و محصولات و دسترسی و خرید کردن آسان برای
                                کاربران میباشد .
                            </p>
                            <p>
                                شرکت آرمان اطلس پارسا،ثبت در اداره کل تجهیزات
                                پزشکی و سامانه تدارکات الکترونیکی دولت و زیرنظر
                                اتحادیه و اصناف دندانپزشکی میباشد.
                            </p>
                        </div>
                        <div className={'mt-5'}>
                            <p className={'text-lg pb-2 text-primary-500'}>
                                تماس با ما
                            </p>
                            {data.phones.map((phone, index) => (
                                <p key={index}>
                                    {phone.title}:{' '}
                                    <span className={'text-left'} dir={'ltr'}>
                                        {phone.number}
                                    </span>
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            </Container>
        </Layout>
    )
}

export default AboutUs
