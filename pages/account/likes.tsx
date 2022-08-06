import { NextPage } from 'next/'
import React, { useEffect, useState } from 'react'
import Menu, { menuItems } from '../../components/Account/Menu'
import CircularProgress from '../../components/common/CircularProgress'
import Container from '../../components/Container'
import Layout from '../../components/Layout'
import Post from '../../components/Post'
import {
    CategoryProps,
    getCategories,
    getLikes,
    LikeProps,
} from '../../services/api/requests'
import { relativeToAbsoluteURL } from '../../utils/convertors'
import { makeClasses } from '../../utils/style'

export const getStaticProps = async (): Promise<unknown> => {
    let categories: CategoryProps[] = await getCategories()
    return { props: { categories }, revalidate: 2000 }
}

const Likes: NextPage<{ categories: CategoryProps[] }> = ({ categories }) => {
    const [likes, setLikes] = useState<LikeProps[]>([])
    const [loading, setLoading] = useState(false)

    const classes = makeClasses({
        grid: [
            'grid',
            'grid-cols-2 sm:grid-cols-4',
            'gap-2 sm:gap-6',
            'sm:px-5',
            'sm:py-5',
        ],
    })
    const handleGetProducts = async () => {
        setLoading(true)
        try {
            const data: LikeProps[] = await getLikes()
            setLoading(false)
            setLikes(data)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        handleGetProducts()
    }, [])
    return (
        <Layout
            categories={categories}
            ignoreFooterMarginTop
            title={'account-likes'}
        >
            <div
                className={'grid grid-cols-10 relative'}
                style={{ minHeight: 'calc(100vh - 80px)' }}
            >
                <Menu hiddenInMobile={true} activeItem={menuItems.likes} />
                <Container
                    className={'col-span-10 sm:col-span-8 p-5 pl-6 pr-6'}
                >
                    {loading && (
                        <div className={'mt-8'}>
                            <CircularProgress />
                        </div>
                    )}
                    <div className={classes.grid}>
                        {likes.map(({ product }, i) => {
                            return (
                                <Post
                                    totalQuantity={product.total_quantity}
                                    variantsLength={product.variants_length}
                                    key={i}
                                    fullWidth={true}
                                    disableMeta={true}
                                    title={product.title}
                                    to={product.id}
                                    image={relativeToAbsoluteURL(product.image)}
                                    categoryTitle={product?.category?.name}
                                    price={0}
                                    discount={0}
                                    originPrice={0}
                                    className={'px-1 py-1'}
                                />
                            )
                        })}
                    </div>
                </Container>
            </div>
        </Layout>
    )
}

export default Likes
