import { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import { RiArrowLeftLine } from 'react-icons/ri'
import { FreeMode } from 'swiper'
import 'swiper/css'
import 'swiper/css/free-mode'
import { Swiper, SwiperSlide } from 'swiper/react'
import Container from '../components/Container'
import ImageSlider from '../components/Home/ImageSlider'
import Layout from '../components/Layout'
import Post from '../components/Post'
import {
    BannerProps,
    CategoriesProps,
    CategoryProps,
    getBanners,
    getCategories,
    getHomeCategories,
    getProductsWithCategoryId,
    getProductsWithDiscount,
    getSliders,
    ProductProps,
} from '../services/api/requests'
import { baseURL } from '../services/urls'
import styles from '../styles/home.module.css'

interface CategoryWithProductsProps extends CategoryProps {
    products: Array<ProductProps>
}

export const pageTitleText = 'فروشگاه اینترنتی مدیکپ'

export async function getStaticProps(): Promise<unknown> {
    let categories: CategoriesProps = await getHomeCategories()
    let allCategories: CategoryProps[] = await getCategories()
    let categoriesWithProducts: Array<CategoryWithProductsProps> = []

    for (let c of categories) {
        const products: Array<ProductProps> = await getProductsWithCategoryId(
            c.id
        )
        categoriesWithProducts = [...categoriesWithProducts, { ...c, products }]
    }
    const productsHasDiscount = await getProductsWithDiscount()
    const slides = await getSliders()
    const banners = await getBanners()

    return {
        props: {
            categories: categoriesWithProducts,
            productsHasDiscount,
            slides,
            banners,
            allCategories,
        },
        revalidate: 200,
    }
}

interface HomeProps {
    categories: CategoryWithProductsProps[]
    productsHasDiscount: ProductProps[]
    slides: []
    banners: []
    allCategories: CategoryProps[]
}

const Home: NextPage<HomeProps> = ({
    categories,
    productsHasDiscount,
    slides,
    banners,
    allCategories,
}) => {
    return (
        <Layout title={'home page'} categories={allCategories}>
            <Head>
                <title>{pageTitleText}</title>
                <meta
                    name="description"
                    content="فروش اینترنتی انواع تجهیزات دندانپزشکی و
                    پزشکی"
                />
                <meta property="og:title" content="فروشگاه اینترنتی مدیکپ" />
                <meta
                    property="og:description"
                    content="فروش اینترنتی انواع تجهیزات دندانپزشکی و
                    پزشکی"
                />
                <meta property="og:url" content="https://medicaap.com/" />
                <meta property="og:type" content="website" />
                <meta
                    name="google-site-verification"
                    content="qNyBOQ7wOQ_SC59nHdY7XZud6ayiqBlFGFS4C0vsMho"
                />
                <meta
                    name="keywords"
                    content="لوازم پزشکی, دندانپزشکی, لوازم دندانپزشکی, پزشکی, لوازم پاک کننده"
                />
            </Head>
            <Container>
                <div
                    className={
                        'lg:grid flex flex-col lg:grid-cols-5 pt-3 sm:py-6 lg:py-10 gap-3 sm:gap-5 lg:gap-10'
                    }
                >
                    <ImageSlider slides={slides} />
                    <Banners banners={banners} />
                </div>
            </Container>
            <Container
                className={
                    'w-full my-3 bg-primary-500 py-5 sm:py-10 flex flex-col sm:grid grid-cols-4'
                }
            >
                <div
                    className={
                        'col-span-1 pb-5 px-2 sm:px-0 sm:pt-5 flex sm:flex-col justify-between w-full sm:justify-start items-start'
                    }
                >
                    <p className={'text-2xl sm:text-4xl text-white'}>
                        تخفیف های ویژه
                    </p>
                    <p
                        className={
                            'sm:block hidden text-white text-sm pt-2 pb-7'
                        }
                    >
                        محصولاتی که تخفیف های مدت دار و غیره دارند
                    </p>
                    <Link href={'/filter?has_discount=true'}>
                        <a>
                            <SeeAllButton />
                        </a>
                    </Link>
                </div>
                <div className={'col-span-3'}>
                    <Swiper
                        spaceBetween={20}
                        modules={[FreeMode]}
                        slidesPerView={'auto'}
                        breakpoints={{
                            500: {
                                spaceBetween: 50,
                            },
                        }}
                        freeMode
                    >
                        {productsHasDiscount.map((p, i) => {
                            return (
                                <SwiperSlide
                                    className={styles.productSlideSheet}
                                    key={i}
                                >
                                    <Post
                                        totalQuantity={p.total_quantity}
                                        variantsLength={p.variants_length}
                                        to={p.id}
                                        variablePrice={p.variable_price}
                                        title={p.title}
                                        image={`${baseURL}${p.image}`}
                                        categoryTitle={p?.category?.name}
                                        price={p.min_price_after_discount}
                                        discount={p.max_discount}
                                        originPrice={p.min_price}
                                        fullWidth
                                    />
                                </SwiperSlide>
                            )
                        })}
                    </Swiper>
                </div>
            </Container>
            <div className={'flex flex-col divide-y'}>
                {categories.map((category, index) => (
                    <div key={index}>
                        <div
                            className={
                                'px-5 sm:px-16 pb-3 pt-5 sm:pt-5 sm:pb-5 flex items-center gap-4'
                            }
                        >
                            <p className={'text-lg'}>
                                کالا های {category.name}
                            </p>
                            <div
                                className={
                                    'text-sm flex gap-2 items-center text-primary-500'
                                }
                            >
                                <Link
                                    href={'/filter?category_id=' + category.id}
                                >
                                    <a className={'cursor-pointer'}>
                                        مشاهده همه
                                    </a>
                                </Link>
                                <RiArrowLeftLine />
                            </div>
                        </div>
                        <div className={'px-5 sm:px-16 pb-5 sm:pb-10 gap-3'}>
                            <Swiper
                                spaceBetween={20}
                                modules={[FreeMode]}
                                slidesPerView={'auto'}
                                breakpoints={{
                                    500: {
                                        spaceBetween: 50,
                                    },
                                }}
                                freeMode
                            >
                                {category.products.map((p, i) => {
                                    return (
                                        <SwiperSlide
                                            className={styles.productSlideSheet}
                                            key={i}
                                        >
                                            <Post
                                                totalQuantity={p.total_quantity}
                                                variantsLength={
                                                    p.variants_length
                                                }
                                                variablePrice={p.variable_price}
                                                title={p.title}
                                                to={p.id}
                                                image={`${baseURL}${p.image}`}
                                                categoryTitle={
                                                    p?.category?.name
                                                }
                                                price={
                                                    p.min_price_after_discount
                                                }
                                                discount={p.max_discount}
                                                originPrice={p.min_price}
                                                fullWidth
                                            />
                                        </SwiperSlide>
                                    )
                                })}
                            </Swiper>
                        </div>
                    </div>
                ))}
            </div>
        </Layout>
    )
}

const SeeAllButton = () => {
    return (
        <div
            className={
                'flex cursor-pointer flex-row text-sm sm:text-base text-primary bg-white rounded-xl px-5 items-center gap-2 py-2'
            }
        >
            مشاهده همه
            <RiArrowLeftLine />
        </div>
    )
}

const Banners: React.FC<{ banners: BannerProps[] }> = ({ banners }) => {
    if (banners.length !== 2) {
        return null
    }
    return (
        <div
            className={
                'hidden cursor-pointer md:flex lg:flex-col h-24 lg:h-full gap-5 lg:gap-10 col-span-2'
            }
        >
            <Link href={banners[0].url} passHref>
                <div className={'flex-grow'}>
                    <div
                        className={`bg-primary-600 h-full rounded-xl relative transition  hover:shadow-xl`}
                        style={{
                            backgroundImage: `url('lines.svg')`,
                        }}
                    >
                        <div className={'absolute inset-7 flex flex-col'}>
                            <p className={'text-white lg:text-2xl'}>
                                {banners[0].title}
                            </p>
                            <p
                                className={
                                    'text-white text-opacity-70 pt-2 text-xs lg:text-base'
                                }
                            >
                                {banners[0].description}
                            </p>
                            <div
                                className={
                                    'flex-grow hidden lg:flex flex-col-reverse items-end'
                                }
                            >
                                <SeeAllButton />
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
            <Link href={banners[1].url} passHref>
                <div className={'flex-grow'}>
                    <div
                        className={`bg-green-600 h-full rounded-xl relative transition  hover:shadow-xl`}
                        style={{
                            backgroundImage: `url('lines.svg')`,
                        }}
                    >
                        <div className={'absolute inset-7 flex flex-col'}>
                            <p className={'text-white lg:text-2xl'}>
                                {banners[1].title}
                            </p>
                            <p
                                className={
                                    'text-white text-opacity-70 pt-2 text-xs lg:text-base'
                                }
                            >
                                {banners[1].description}
                            </p>
                            <div
                                className={
                                    'flex-grow hidden lg:flex flex-col-reverse items-end'
                                }
                            >
                                <SeeAllButton />
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default Home
