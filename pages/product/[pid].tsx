import { GetStaticPaths, GetStaticPathsResult, NextPage } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useContext, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { MdOutlineDeliveryDining, MdPhone } from 'react-icons/md'
import {
    RiArrowLeftLine,
    RiArrowRightLine,
    RiArrowUpCircleLine,
    RiCommunityLine,
    RiHeart3Fill,
    RiHeart3Line,
} from 'react-icons/ri'
import SwiperCore, { Autoplay, Navigation } from 'swiper'
import 'swiper/css'
import 'swiper/css/free-mode'
import { Swiper, SwiperSlide } from 'swiper/react'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import NumberField from '../../components/common/NumberField'
import PriceText from '../../components/common/PriceText'
import Tab, { tabItemTypes } from '../../components/common/Tab'
import Container from '../../components/Container'
import Layout from '../../components/Layout'
import DiscountLabel from '../../components/Post/DiscountLabel'
import ProductDetail from '../../components/SingleProduct/detail'
import ProductComments from '../../components/SingleProduct/ProductComments'
import { StoreContext } from '../../components/StoreState'
import {
    addToCart,
    CategoryProps,
    dislikePost,
    getAllProducts,
    getCategories,
    getProductById,
    likePost,
    ProductProps,
    SingleProductProps,
    VariantProps,
} from '../../services/api/requests'
import { isAuthenticated } from '../../utils/authentication'
import { toPercent } from '../../utils/calculate'
import { relativeToAbsoluteURL } from '../../utils/convertors'
import styles from './../../styles/product.module.css'
import './../../utils/global'
import Link from 'next/link'
import CircularProgress from '../../components/common/CircularProgress'
import Head from 'next/head'
import { pageTitleText } from '..'

SwiperCore.use([Autoplay, Navigation])

const tabs = [
    {
        text: 'شرح',
        id: 'description',
    },
    {
        text: 'نظرات',
        id: 'comments',
    },
]
const detailTab = {
    text: 'جزییات',
    id: 'detail',
}

export const getStaticPaths: GetStaticPaths =
    async (): Promise<GetStaticPathsResult> => {
        const products: ProductProps[] = await getAllProducts()
        const paths = products.map((product) => ({
            params: { pid: product.id.toString() },
        }))
        return { paths, fallback: true }
    }

type StaticParams = { params: { pid: string } }

export const getStaticProps = async ({
    params: { pid },
}: StaticParams): Promise<unknown> => {
    let categories: CategoryProps[] = await getCategories()
    const product: SingleProductProps = await getProductById(parseInt(pid))
    return { props: { product, categories }, revalidate: 20 }
}

const ProductPage: NextPage<{
    product: SingleProductProps
    categories: CategoryProps[]
}> = ({ product, categories }) => {
    const {
        incrementCartCount,
        checkProductInLikedList,
        addToLikeList,
        removeFromLikeList,
    } = useContext(StoreContext)
    const [activeTab, setActiveTab] = React.useState<tabItemTypes>(tabs[0])
    const [productImage, setProductImage] = React.useState<null | string>(null)
    const [quantity, setQuantity] = React.useState(1)
    const [loadingAddLike, setLoadingAddLike] = useState(false)

    const [variants, setVariants] = useState<VariantProps[]>([])
    const [selectedVariant, setSelectedVariant] = useState<VariantProps | null>(
        null
    )

    const handleChangeTab = (tab: tabItemTypes) => {
        setActiveTab(tab)
    }
    const router = useRouter()
    const incrementQuantity = () => setQuantity(quantity + 1)
    const decrementQuantity = () => quantity > 1 && setQuantity(quantity - 1)

    const handleChangeProductImage = (imageUrl: string) => {
        setProductImage(imageUrl)
    }
    const handleSelectVariant = (v: VariantProps) => {
        setSelectedVariant(v)
    }
    const [loadingAddToCart, setLoadingAddToCart] = useState(false)

    const handleLikeProduct = async () => {
        if (isAuthenticated()) {
            setLoadingAddLike(true)
            try {
                if (!checkProductInLikedList(product.id)) {
                    await likePost(product.id)
                    addToLikeList(product.id)
                    toast.success('به لیست علاقه مندی ها اضافه شد')
                    setLoadingAddLike(false)
                } else {
                    await dislikePost(product.id)
                    removeFromLikeList(product.id)
                    toast.success('از لیست علاقه مندی ها حذف شد')
                    setLoadingAddLike(false)
                }
            } catch (err) {
                toast.error('مشکلی رخ داده لطفا دوباره امتحان کنید.')
                setLoadingAddLike(false)
            }
        } else {
            router.push('/login')
        }
    }

    const handleAddToCart = async () => {
        setLoadingAddToCart(true)
        if (!isAuthenticated()) {
            router.push('/login')
        } else {
            if (selectedVariant) {
                try {
                    await addToCart(product.id, quantity, selectedVariant.id)
                    incrementCartCount(quantity)
                    setQuantity(1)
                    toast.success('به سبد کالا اضافه شد')
                } catch (err) {
                    toast.error('موجودی کالا به اتمام رسیده')
                } finally {
                    setTimeout(() => {
                        setLoadingAddToCart(false)
                    }, 500)
                }
            }
        }
    }
    const handleInitialVariants = (p: SingleProductProps) => {
        if (p.variants && p.variants.length > 0) {
            setVariants(p.variants)
            setSelectedVariant(p.variants.find((v) => v.quantity > 0) || null)
            if (p.variants.length > 1) {
                setActiveTab(detailTab)
            }
        }
    }

    React.useEffect(() => {
        setProductImage(relativeToAbsoluteURL(product.image))
        handleInitialVariants(product)
    }, [product])
    if (!product) return null
    return (
        <Layout title={'product'} categories={categories}>
            <Head>
                <title>
                    {product.title} | {pageTitleText}
                </title>
                <meta name="description" content={product.details} />
                <meta property="og:title" content={product.title} />
                <meta property="og:description" content={product.details} />
                <meta
                    property="og:url"
                    content={`https://medicaap.com/product/${product.id}`}
                />
                <meta property="og:type" content="website" />
                <meta property="og:type" content="product" />
                <meta property="og:image" content={productImage || ''} />
            </Head>
            <Container className={'px-3 sm:px-8'} hasDefaultStyle={false}>
                <div className={'flex sm:flex-row flex-col pt-3 sm:pt-8'}>
                    <div
                        className={`${styles.imageSection} flex flex-col gap-4`}
                    >
                        <div
                            className={`relative w-full ${styles.productMainImage} rounded-xl overflow-hidden border border-gray-200`}
                        >
                            {productImage && (
                                <Image
                                    src={productImage}
                                    alt={'product name'}
                                    layout={'fill'}
                                    objectFit={'cover'}
                                />
                            )}
                            <div
                                onClick={handleLikeProduct}
                                className={
                                    'absolute top-5 right-5 cursor-pointer w-7'
                                }
                            >
                                <div>
                                    {loadingAddLike ? (
                                        <CircularProgress size={'8'} />
                                    ) : checkProductInLikedList(product.id) ? (
                                        <RiHeart3Fill
                                            className={'text-red-400'}
                                            size={30}
                                        />
                                    ) : (
                                        <RiHeart3Line
                                            className={
                                                'text-gray-400 text-opacity-50'
                                            }
                                            size={30}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                        <div
                            className={`w-full relative overflow-hidden ${styles.imagesGroupContainer}`}
                        >
                            <Swiper
                                spaceBetween={0}
                                effect={'fade'}
                                slidesPerView={'auto'}
                                freeMode
                                // modules={[FreeMode]}
                                navigation={{
                                    prevEl: '.prev-image-group',
                                    nextEl: '.next-image-group',
                                }}
                                className={'w-full'}
                            >
                                {product.gallery.length &&
                                    product.gallery.map((gallery, index) => (
                                        <SwiperSlide
                                            key={index}
                                            style={{
                                                width: '6em',
                                            }}
                                        >
                                            <div
                                                onClick={() =>
                                                    handleChangeProductImage(
                                                        relativeToAbsoluteURL(
                                                            gallery.image
                                                        )
                                                    )
                                                }
                                                className={
                                                    'relative h-16 sm:h-20 mx-1 hover:opacity-60 cursor-pointer border border-gray-200 hover:border-2 hover:border-primary-700 transition rounded-lg overflow-hidden'
                                                }
                                            >
                                                <Image
                                                    src={relativeToAbsoluteURL(
                                                        gallery.image
                                                    )}
                                                    alt={'product name'}
                                                    layout={'fill'}
                                                    objectFit={'cover'}
                                                />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                            </Swiper>
                            <div
                                className={`flex justify-center text-center gap-2 flex-col transition opacity-0 left-0 top-0 bottom-0 absolute z-10 px-3 py-3 ${styles.paginationButtonsContainer}`}
                            >
                                <div
                                    className={
                                        'px-2 py-1 active:bg-primary-700 prev-image-group bg-primary-500 text-white rounded-lg shadow-lg'
                                    }
                                >
                                    <RiArrowRightLine />
                                </div>
                                <div
                                    className={
                                        'px-2 py-1 active:bg-primary-700 next-image-group bg-primary-500 text-white rounded-lg shadow-md'
                                    }
                                >
                                    <RiArrowLeftLine />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={'flex-1 px-1 py-5 sm:py-0 sm:px-8'}>
                        <div className={'pb-3'}>
                            <h1 className={'text-xl sm:text-3xl text-gray-700'}>
                                {product.title}
                            </h1>
                            <p className={'text-gray-400 pt-2 text-sm'}>
                                {product.slug}
                            </p>
                            {/* {product.color && (
                                <div
                                    className={
                                        'w-5 h-2 rounded-full mt-2 -mb-2'
                                    }
                                    style={{
                                        backgroundColor:
                                            product.color || 'inherit',
                                    }}
                                />
                            )} */}
                        </div>
                        <div
                            className={
                                'sm:p-2 bg-gray-200 px-5 py-2 justify-between rounded-lg flex'
                            }
                        >
                            <Link
                                href={
                                    '/filter?category_id=' + product.category.id
                                }
                            >
                                <a
                                    className={
                                        'text-sm text-gray-500 sm:px-5 py-2 cursor-pointer hover:bg-gray-300 rounded-lg'
                                    }
                                >
                                    {product.category.name}
                                </a>
                            </Link>
                            <Link
                                href={'/filter?brand_id=' + product?.brand.id}
                            >
                                <a
                                    className={
                                        'text-sm text-gray-500 sm:px-5 py-2 cursor-pointer hover:bg-gray-300 rounded-lg'
                                    }
                                >
                                    {product.brand.name}
                                </a>
                            </Link>
                            <Link
                                href={
                                    '/filter?country_id=' + product?.country.id
                                }
                            >
                                <a
                                    className={
                                        'text-sm text-gray-500 sm:px-5 py-2 cursor-pointer hover:bg-gray-300 rounded-lg'
                                    }
                                >
                                    ساخت {product?.country?.name}
                                </a>
                            </Link>
                        </div>

                        {variants.length > 1 ? (
                            <div className={'grid grid-cols-3 gap-3 py-3'}>
                                {variants.map((v, index) => (
                                    <div
                                        onClick={() =>
                                            v.quantity && handleSelectVariant(v)
                                        }
                                        key={index}
                                        className={`col-span-1 relative border-2 overflow-hidden cursor-pointer ${
                                            selectedVariant?.id == v.id
                                                ? 'bg-primary-50 border-primary-400'
                                                : 'border-gray-200'
                                        } ${
                                            v.quantity > 0 && 'hover:shadow-md'
                                        } transition rounded-lg px-2 py-2`}
                                    >
                                        <p
                                            className={`text-center border-b pb-2 text-gray-700 ${
                                                selectedVariant?.id == v.id
                                                    ? 'border-primary-400'
                                                    : 'border-gray-200'
                                            }`}
                                        >
                                            <span
                                                className={
                                                    'text-sm font-bold text-gray-500'
                                                }
                                            >
                                                {v.options.map(
                                                    (op, index, arr) => (
                                                        <span key={index}>
                                                            {op.value.name}
                                                            {arr.length - 1 >
                                                                index && ' - '}
                                                        </span>
                                                    )
                                                )}
                                            </span>
                                        </p>
                                        {v.variable_price ? (
                                            <div
                                                className={
                                                    'px-1 flex items-center gap-3 text-green-600 pt-2 text-sm'
                                                }
                                            >
                                                <span
                                                    className={
                                                        'hidden sm:block'
                                                    }
                                                >
                                                    <MdPhone size={20} />
                                                </span>
                                                <div>
                                                    <p>تماس بگیرید</p>
                                                    <p
                                                        className={
                                                            'hidden sm:block text-xs'
                                                        }
                                                    >
                                                        برای نمایش شماره کلیک
                                                        کنید
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <p
                                                    className={
                                                        'text-xs text-red-500 pt-2 line-through text-left'
                                                    }
                                                >
                                                    {v.discount ? (
                                                        <span>
                                                            {v.price
                                                                .toToman()
                                                                .toString()
                                                                .separateThousand()}{' '}
                                                            تخفیف
                                                        </span>
                                                    ) : (
                                                        '0 تخفیف'
                                                    )}
                                                </p>
                                                <p
                                                    className={
                                                        'text-left flex items-center flex-row-reverse'
                                                    }
                                                >
                                                    <span
                                                        className={
                                                            'text-xs mr-1'
                                                        }
                                                    >
                                                        تومان
                                                    </span>
                                                    <PriceText
                                                        price={v.price_after_discount.toToman()}
                                                    />
                                                </p>
                                            </div>
                                        )}
                                        <div
                                            className={`w-4 h-4 rounded-full absolute top-2 ${
                                                selectedVariant?.id == v.id
                                                    ? 'bg-primary-200 border-2 border-primary-400'
                                                    : 'border-gray-300 border  bg-gray-50'
                                            } right-2 `}
                                        />
                                        {v.quantity <= 0 && !v.variable_price && (
                                            <div
                                                className={
                                                    'absolute bg-gray-100 inset-0 flex justify-center items-center bg-opacity-50'
                                                }
                                            >
                                                <p
                                                    className={
                                                        'px-2 py-2 bg-white rounded-lg text-sm'
                                                    }
                                                >
                                                    اتمام موجودی
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className={'px-2 pt-5 text-sm'}>
                                {product.details}
                            </p>
                        )}
                    </div>
                    <Card width={'auto sm:w-80'}>
                        <div className={'flex-1 flex flex-col divide-y'}>
                            {/* items */}
                            <ProductSaleOptionItem
                                // TODO fill
                                title={'موجود در انبار'}
                                description={
                                    'این محصول در انبار موجود میباشد و قابل خریداست'
                                }
                                icon={<RiCommunityLine size={40} />}
                            />
                            <ProductSaleOptionItem
                                title={'ارسال از طریق پست پیشتاز'}
                                description={
                                    'این محصول در انبار موجود میباشد و قابل خریداست'
                                }
                                icon={<MdOutlineDeliveryDining size={40} />}
                            />
                            <ProductSaleOptionItem
                                title={'قابلیت بازگشت'}
                                description={'این محصول قابلیت مرجوعی را دارد'}
                                icon={<RiArrowUpCircleLine size={40} />}
                            />
                        </div>

                        {product.variable_price ||
                        selectedVariant?.variable_price ? (
                            <div className={'flex items-end flex-col'}>
                                <a
                                    href={'tel:02166564732'}
                                    className={'w-full'}
                                >
                                    <Button
                                        icon={<MdPhone />}
                                        className={'justify-center gap-3'}
                                        color={'green'}
                                        title={'شماره تماس: 02166564732'}
                                    />
                                </a>
                            </div>
                        ) : (
                            <div className={'flex flex-col items-end gap-4'}>
                                {selectedVariant?.discount ? (
                                    <div className={'flex gap-3'}>
                                        <DiscountLabel>
                                            {toPercent(
                                                selectedVariant.price.toToman(),
                                                selectedVariant.discount.toToman()
                                            )}
                                            %
                                        </DiscountLabel>
                                        <p
                                            className={
                                                'line-through text-red-500'
                                            }
                                        >
                                            {selectedVariant.price.toToman()}
                                        </p>
                                    </div>
                                ) : null}
                                <div className={'flex justify-between w-full'}>
                                    <NumberField
                                        number={quantity}
                                        onIncrement={incrementQuantity}
                                        onDecrement={decrementQuantity}
                                    />
                                    <div
                                        className={
                                            'flex flex-row-reverse items-center'
                                        }
                                    >
                                        <span className={'text-xs mr-1'}>
                                            تومان
                                        </span>

                                        <PriceText
                                            price={
                                                selectedVariant?.price_after_discount.toToman() ||
                                                0
                                            }
                                            className={'text-3xl'}
                                        />
                                    </div>
                                </div>
                                <div className={'w-full'}>
                                    <Button
                                        loading={loadingAddToCart}
                                        onClick={handleAddToCart}
                                        disabled={
                                            !selectedVariant?.quantity ||
                                            loadingAddToCart
                                        }
                                        color={'green'}
                                        title={'افزودن به سبد خرید'}
                                    />
                                </div>
                            </div>
                        )}
                    </Card>
                </div>

                <div
                    className={
                        'bg-white mt-5 sm:mt-12 rounded-2xl flex flex-col divide-y'
                    }
                >
                    <Tab
                        onChange={handleChangeTab}
                        activeId={activeTab.id}
                        items={
                            variants.length > 1 ? [detailTab, ...tabs] : tabs
                        }
                    />
                    <div
                        className={
                            'px-5 sm:px-7 py-5 overflow-auto scrollbar-thin h-full'
                        }
                    >
                        {activeTab.id === 'description' ? (
                            <ProductDetail>{product.description}</ProductDetail>
                        ) : activeTab.id == 'comments' ? (
                            <ProductComments productId={product.id} />
                        ) : activeTab.id == 'detail' ? (
                            <ProductDetail>{product.details}</ProductDetail>
                        ) : null}
                    </div>
                </div>
            </Container>
            <Toaster position="bottom-center" />
        </Layout>
    )
}

type ProductSaleOptionItemPropTypes = {
    title: string
    description: string
    icon: React.ReactNode
}

const ProductSaleOptionItem = ({
    title,
    description,
    icon,
}: ProductSaleOptionItemPropTypes): JSX.Element => {
    return (
        <div className={'pb-4 pt-4 flex gap-2 items-center text-gray-400'}>
            {icon}
            <div>
                <p className={'text-lg text-gray-600'}>{title}</p>
                <p className={'text-xs text-gray-500'}>{description}</p>
            </div>
        </div>
    )
}

export default ProductPage
