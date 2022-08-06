import { NextPage } from 'next'
import { BaseRouter } from 'next/dist/shared/lib/router/router'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { MdClose } from 'react-icons/md'
import { RiFilter2Line } from 'react-icons/ri'
import OverlayLoading from '../components/common/OverlayLoading'
import Tab from '../components/common/Tab'
import Container from '../components/Container'
import Brands from '../components/Filter/Brands'
import Categories from '../components/Filter/Categories'
import Country from '../components/Filter/Country'
import HasDiscount from '../components/Filter/HasDiscount'
import HasReadyToShipment from '../components/Filter/HasReadyToShipment'
import Pagination from '../components/Filter/Pagination'
import Layout from '../components/Layout'
import Post from '../components/Post'
import {
    BrandProps,
    CategoriesProps,
    CountryProps,
    filterProducts,
    getBrands,
    getCategories,
    getCountries,
    PaginationProps,
    ProductProps,
} from '../services/api/requests'
import { relativeToAbsoluteURL } from '../utils/convertors'
import { useSetFilter } from '../utils/hooks'
import { makeClasses } from '../utils/style'

export async function getStaticProps(): Promise<unknown> {
    let categories: CategoriesProps = await getCategories()
    let brands: BrandProps[] = await getBrands()
    let countries: CountryProps[] = await getCountries()
    return {
        props: {
            categories,
            brands,
            countries,
        },
        revalidate: 200,
    }
}

interface FilterProps {
    categories: CategoriesProps
    brands: BrandProps[]
    countries: CountryProps[]
}

const FILTER_ORDER_ITEMS = [
    {
        id: '-created_at',
        text: 'جدید ترین ها',
    },
    {
        id: 'likes',
        text: 'محبوب ترین ها',
    },
]

const Filter: NextPage<FilterProps> = (props) => {
    const categories = props.categories
    const brands = props.brands
    const countries = props.countries

    const { setFilter, activeFilter } = useSetFilter('order_by')
    const [filterModalStatus, setFilterModalStatus] = useState(false)
    const [loading, setLoading] = useState(false)
    const [products, setProducts] = useState<ProductProps[]>([])
    const [pagination, setPagination] = useState<PaginationProps | null>(null)
    const router = useRouter()
    const handleFilter = async (page = 1, currentRouter: BaseRouter) => {
        const queryFilters = currentRouter.query
        setLoading(true)
        try {
            const {
                data,
                pagination,
            }: {
                data: ProductProps[]
                pagination: PaginationProps
            } = await filterProducts(queryFilters, page, 12)
            setProducts(data)
            setPagination(pagination)
            document.body.scrollTop = 0
            document.documentElement.scrollTop = 0
        } catch (err) {
            toast.error('مشکلی رخ داده لطفا دوباره امتحان کنید')
        } finally {
            setLoading(false)
        }
    }

    const handleOpenFullMenu = () => {
        setFilterModalStatus(true)
    }
    const handleCloseFullMenu = () => {
        setFilterModalStatus(false)
    }

    const handleChangePage = (page: number) => {
        handleFilter(page, router)
    }

    useEffect(() => {
        handleCloseFullMenu()
        handleFilter(1, router)
    }, [router])

    const classes = makeClasses({
        container: [
            'sm:mt-10',
            'grid',
            'grid-cols-8',
            'gap-10',
            'pl-1',
            'pr-1',
        ],
        filtersContainer: [
            'hidden sm:block',
            'col-span-3 lg:col-span-2',
            'bg-white',
            'rounded-xl',
            'px-4',
            'py-4',
        ],
        postContainers: [
            'col-span-8 md:col-span-5 lg:col-span-6',
            'sm:bg-white',
            'rounded-xl',
            'flex flex-col',
        ],
        postsGrid: [
            'relative',
            'flex-1',
            'grid',
            'grid-cols-2 md:grid-cols-2 lg:grid-cols-4',
            'gap-2 sm:gap-6',
            'grid-rows-3',
            'px-1 sm:px-5',
            'py-3 sm:py-5',
        ],

        pagination: ['flex gap-3 justify-center mt-10'],
        pageBtn: [
            'bg-primary-500 hover:bg-primary-600 rounded-md text-white px-4 py-1',
        ],
        pageNumberBtn: ['bg-gray-100 rounded-md text-gray-500 px-4 py-1'],
    })

    return (
        <Layout title={'filters'} categories={categories}>
            <Container className={classes.container}>
                <div className={classes.filtersContainer}>
                    <FilterItems
                        categories={categories}
                        brands={brands}
                        countries={countries}
                    />
                </div>
                <div className={classes.postContainers}>
                    <Tab
                        onChange={(o) => setFilter(o.id)}
                        activeId={
                            !activeFilter
                                ? FILTER_ORDER_ITEMS[0].id
                                : (activeFilter as string)
                        }
                        items={FILTER_ORDER_ITEMS}
                    />
                    <hr />

                    <div className={classes.postsGrid}>
                        {loading && <OverlayLoading />}
                        {products.map((p, i) => {
                            return (
                                <Post
                                    key={i}
                                    variantsLength={p.variants_length}
                                    totalQuantity={p.total_quantity}
                                    title={p.title}
                                    to={p.id}
                                    variablePrice={p.variable_price}
                                    image={relativeToAbsoluteURL(p.image)}
                                    categoryTitle={p?.category?.name}
                                    price={p.min_price_after_discount}
                                    discount={p.max_discount}
                                    originPrice={p.min_price}
                                    className={'px-1 py-1'}
                                    fullWidth={true}
                                />
                            )
                        })}
                    </div>
                    {!loading && (
                        <Pagination
                            onChangePage={handleChangePage}
                            pagination={pagination}
                        />
                    )}
                </div>

                <div
                    onClick={handleOpenFullMenu}
                    className={
                        ' bg-primary-500 cursor-pointer flex sm:hidden  active:bg-primary-700 text-white items-center justify-center fixed right-8 bottom-8 z-50 px-10  h-12 rounded-xl shadow-xl'
                    }
                >
                    <span>فیلتر</span>
                    <RiFilter2Line className={'text-white'} size={20} />
                </div>

                <div
                    hidden={!filterModalStatus}
                    className={
                        'bg-white px-4 py-4 sm:static fixed inset-0 overflow-auto'
                    }
                    style={{ zIndex: 200000 }}
                >
                    <div className={'flex justify-end fixed left-5 top-5'}>
                        <div
                            onClick={handleCloseFullMenu}
                            className={
                                'w-10 h-10 bg-gray-700 bg-opacity-70 rounded-full flex items-center justify-center shadow-lg  text-white mb-5'
                            }
                        >
                            <MdClose size={22} />
                        </div>
                    </div>
                    <FilterItems
                        countries={countries}
                        categories={categories}
                        brands={brands}
                    />
                </div>
            </Container>
            <Toaster />
        </Layout>
    )
}

const FilterItems = ({
    categories,
    brands,
    countries,
}: {
    categories: CategoriesProps
    brands: BrandProps[]
    countries: CountryProps[]
}): JSX.Element => (
    <React.Fragment>
        <TitleFilter />
        <Categories items={categories} />
        <Brands items={brands} />
        <Country items={countries} />
        {/* <Prices /> */}
        <HasReadyToShipment />
        <HasDiscount />
    </React.Fragment>
)

const TitleFilter = () => {
    const { activeFilter, removeFilter } = useSetFilter('title')
    if (!activeFilter) {
        return null
    }
    return (
        <div
            className={
                'border border-gray-200 flex items-center gap-3 rounded-xl p-3 mb-5'
            }
        >
            <div
                className={
                    'bg-primary-100 hover:bg-primary-500 transition cursor-pointer hover:text-white h-6 w-6 flex justify-center items-center text-primary-500 rounded-md'
                }
                onClick={() => removeFilter('title')}
            >
                <MdClose size={20} />
            </div>
            {activeFilter}
        </div>
    )
}

export default Filter
