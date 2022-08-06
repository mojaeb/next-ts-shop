import axios, { AxiosPromise } from 'axios'
import axiosInstance from '../axios'
import { baseURL } from '../urls'

export interface CategoryProps {
    id: number
    slug: string
    name: string
    parent_id: number
}

export interface AbstractUser {
    first_name: string
    phone_number: string
    last_name: string
    email: string
    user_name: string
}

export interface UserProps extends AbstractUser {
    id: number
    is_superuser: boolean
    profile_image: string
}

export interface RegisterUserProps extends AbstractUser {
    password: string
}

export interface UserInfoProps extends UserProps {
    email: string
}

export type CategoriesProps = Array<CategoryProps>

export interface ProductProps {
    title: string
    slug: string
    id: number
    image: string
    min_price: number
    max_discount: number
    total_quantity: number
    variants_length: number
    category: CategoryProps
    min_price_after_discount: number
    variable_price: boolean
}

export interface OptionTypeProps {
    id: number
    name: string
    slug: string
}

export interface OptionValueProps {
    id: number
    name: string
    slug: string
}

export interface VariantOptionProps {
    id: number
    value: OptionValueProps
    type: OptionTypeProps
}

export interface AbstractVariantProps {
    id: number
    price: number
    discount: number
    discount_due_date: Date
    weight: number
    quantity: number
    code: number
    price_after_discount: number
    variable_price: boolean
}

export interface VariantProps extends AbstractVariantProps {
    options: VariantOptionProps[]
}

export interface SingleProductProps extends ProductProps {
    brand: {
        id: 1
        name: string
        slug: string
        image: string
    }

    created_at: Date
    gallery: [{ image: string }]
    tags: [
        {
            name: string
            slug: string
            id: number
        }
    ]
    country: CountryProps
    description: string
    details: string
    variants: VariantProps[]
}

export interface BannerProps {
    url: string
    title: string
    description: string
}

export type CommentItemProps = {
    user: UserProps
    text: string
    created_at: Date
    product: number
}

export interface PaginationProps {
    page: number
    per_page: number
    count: number
}

export interface BrandProps {
    id: number
    name: string
    slug: string
    image: string
}

export interface CountryProps {
    id: number
    name: string
    slug: string
}

export interface CartItemProps {
    id: number
    product: ProductProps
    product_variant: AbstractVariantProps
    quantity: number
    total_price: number
    total_discount: number
    total_price_after_discount: number
}

export interface CartProps {
    created_at: Date
    payment_succeed: boolean
    id: number
    address: AddressProps | null
    order_items: CartItemProps[]
    total_price: number
    total_discount: number
    total_price_after_discount: number
    shipping_price: number
    total_price_after_shipping: number
    warehouse_confirmation: boolean
    delivered: boolean
    returned: boolean
    canceled: boolean
    amount: number
}

export interface AddressProps {
    id: number
    city: string
    user: UserProps
    city_code: number | string
    state_code: number | string
    state: string
    location: string
    address: string
    is_mine: boolean
    phone_number: string
    first_name: string
    last_name: string
    house_number: number | null
    unit: number | null
    zip_code: number
}

export interface CityProps {
    title: string
    code: number
}

export interface LikeProps {
    product: ProductProps
}

export interface StateProps extends CityProps {
    cities: CityProps[]
}

const getCategories = async (): Promise<CategoriesProps> => {
    const categories = await axios.get(`${baseURL}/api/categories`)
    return categories.data.data
}

const getHomeCategories = async (): Promise<CategoriesProps> => {
    const categories = await axios.get(`${baseURL}/api/home-categories`)
    return categories.data.data
}

const getBrands = async (): Promise<BrandProps[]> => {
    const banners = await axios.get(`${baseURL}/api/brands`)
    return banners.data.data
}
export const getCountries = async (): Promise<CountryProps[]> => {
    const countries = await axios.get(`${baseURL}/api/countries/`)
    return countries.data.data
}
export const registerUser = async (data: RegisterUserProps): Promise<void> => {
    return axios.post(`${baseURL}/user/suspended-registration/`, data)
}
export const getRegisterCodeTime = async (
    phone_number: string
): Promise<{ data: { expired_at: Date; started_at: Date } }> => {
    return await axios.get(
        `${baseURL}/user/get-register-code-time/${phone_number}/`
    )
}
export const verifyCode = async (
    code: string,
    phone_number: string
): Promise<void> => {
    await axios.post(`${baseURL}/user/verify-code-and-register/`, {
        code,
        phone_number,
    })
}

const refreshTokenToBlacklist = async ({
    refreshToken,
}: {
    refreshToken: string
}): Promise<void> => {
    await axios.post(`${baseURL}/user/logout/blacklist/`, {
        refresh_token: refreshToken,
    })
}

const getProductsWithCategoryId = async (
    categoryId: number
): Promise<Array<ProductProps>> => {
    const categories = await axios.post(
        `${baseURL}/api/products/?page=1&per_page=7`,
        { category_id: categoryId }
    )

    return categories.data.data
}

const getProductsWithDiscount = async (): Promise<unknown> => {
    const products = await axios.post(
        `${baseURL}/api/products/?page=1&per_page=7`,
        { has_discount: true }
    )

    return products.data.data
}

const getSliders = async (): Promise<unknown> => {
    const slides = await axios.get(`${baseURL}/api/sliders/`)
    return slides.data.data
}
const getBanners = async (): Promise<unknown> => {
    const banners = await axios.get(`${baseURL}/api/banners/`)
    return banners.data.data
}

const getAllProducts = async (): Promise<ProductProps[]> => {
    const products = await axios.get(`${baseURL}/api/all-products/`)
    return products.data.data
}

const getProductById = async (
    id: number | string | undefined
): Promise<SingleProductProps> => {
    const products = await axios.get(`${baseURL}/api/product/${id}`)
    return products.data.data
}
const getOrders = async (): Promise<CartProps[]> => {
    const orders = await axiosInstance.get(`${baseURL}/api/orders/`)
    return orders.data.data
}

const getUserInfo = async (): Promise<UserInfoProps> => {
    const products = await axiosInstance.get(`${baseURL}/api/account_info`)
    return products.data.data
}

export const changePassword = async (password: string): Promise<void> => {
    await axiosInstance.post(`${baseURL}/api/change-password/`, {
        password,
    })
}

export const changeUserProfileImage = async (data: FormData): Promise<void> => {
    const products = await axiosInstance.post(
        `${baseURL}/api/upload-profile-image/`,
        data,
        { timeout: 30000 }
    )
    return products.data.data
}

export const editProfile = async (data: UserProps): Promise<void> => {
    const products = await axiosInstance.post(
        `${baseURL}/api/edit-profile/`,
        data
    )
    return products.data.data
}

const getLikes = async (): Promise<LikeProps[]> => {
    const products = await axiosInstance.get(`${baseURL}/api/likes/`)
    return products.data.data
}

export const likePost = async (id: number): Promise<void> => {
    await axiosInstance.post(`${baseURL}/api/like-product/${id}/`)
}
export const dislikePost = async (id: number): Promise<void> => {
    await axiosInstance.post(`${baseURL}/api/unlike-product/${id}/`)
}

export const addComment = async (text: string, pid: number): Promise<void> => {
    await axiosInstance.post(`${baseURL}/api/product/${pid}/add-comment/`, {
        text,
    })
}

export const setLikeProduct = async (pid: number): Promise<void> => {
    const products = await axiosInstance.get(
        `${baseURL}/api/like-product/${pid}/`
    )
    return products.data.data
}
export const setUnlikeProduct = async (pid: number): Promise<void> => {
    const products = await axiosInstance.get(
        `${baseURL}/api/unlike-product/${pid}/`
    )
    return products.data.data
}

const getCart = async (has_shipping_price = false): Promise<CartProps> => {
    const url = `${baseURL}/api/cart/?${
        has_shipping_price
            ? 'has_shipping_payment=true'
            : 'has_shipping_payment=false'
    }`
    const cart = await axiosInstance.get(url)
    return cart.data.data
}
const checkout = async (): Promise<{ pay_url: string }> => {
    const callbackUrl = `${location.protocol}//${location.hostname}:${location.port}/success-payment`
    const cart = await axiosInstance.post(`${baseURL}/api/checkout/`, {
        callback_url: callbackUrl,
    })
    return cart.data.data
}
const verifyPayment = async ({
    authority,
    status,
}: {
    authority: string
    status: string
}): Promise<void> => {
    const payment = await axiosInstance.get(
        `${baseURL}/api/verify-payment?Authority=${authority}&Status=${status}`
    )
    return payment.data
}

const getAddresses = async (): Promise<AddressProps[]> => {
    const addresses = await axiosInstance.get(`${baseURL}/api/addresses/`)
    return addresses.data.data
}

export const changeOrderAddress = async (id: number): Promise<void> => {
    await axiosInstance.post(`${baseURL}/api/change-order-address/${id}`)
}
const createAddress = async (data: AddressProps): Promise<void> => {
    await axiosInstance.post(`${baseURL}/api/address/`, data)
}
const editAddress = async (data: AddressProps, id: number): Promise<void> => {
    await axiosInstance.put(`${baseURL}/api/address/${id}/`, data)
}
const deleteAddress = async (id: number): Promise<void> => {
    await axiosInstance.delete(`${baseURL}/api/address/${id}/`)
}

const getCitiesAndStates = async (): Promise<StateProps[]> => {
    const citiesAndStates = await axiosInstance.get(
        `${baseURL}/api/states-and-cities/`
    )
    return citiesAndStates.data.data.entries
}

const incrementQuantityOfOrderItem = async (orderId: number): Promise<void> => {
    const cart = await axiosInstance.post(
        `${baseURL}/api/increment-quantity/${orderId}`
    )
    return cart.data.data
}
const decrementQuantityOfOrderItem = async (orderId: number): Promise<void> => {
    const cart = await axiosInstance.post(
        `${baseURL}/api/decrement-quantity/${orderId}`
    )
    return cart.data.data
}

const removeCartItem = async (orderId: number): Promise<void> => {
    await axiosInstance.post(`${baseURL}/api/remove-from-cart/${orderId}/`)
    return undefined
}

const addToCart = async (
    productId: number,
    quantity: number,
    variantId: number
): Promise<UserInfoProps> => {
    const products = await axiosInstance.post(`${baseURL}/api/add-to-cart/`, {
        quantity,
        product_id: productId,
        variant_id: variantId,
    })
    return products.data.data
}

const filterProducts = async (
    filters: Record<string, unknown>,
    page: number,
    perPage: number
): Promise<{ data: ProductProps[]; pagination: PaginationProps }> => {
    const products = await axios.post(
        `${baseURL}/api/products/?page=${page}&per_page=${perPage}`,
        filters
    )
    return products.data
}

export interface CommentProps {
    text: string
}

const getCommentsByProductId = async (
    id: number | string | undefined
): Promise<CommentItemProps[]> => {
    let products: { data: { data: CommentItemProps[] } } = {
        data: { data: [] },
    }
    try {
        products = await axios.get(`${baseURL}/api/product/${id}/comments/`)
    } catch (err) {
        console.log(err)
        alert(err)
    }

    return products.data.data
}

const getToken = ({
    phone,
    password,
}: {
    phone: string
    password: string
}): AxiosPromise => {
    return new Promise((resolve, reject) => {
        axios
            .post(`${baseURL}/api/token/`, {
                phone_number: phone,
                password: password,
            })
            .then((res) => {
                window.localStorage.setItem('access_token', res.data.access)
                window.localStorage.setItem('refresh_token', res.data.refresh)
                axiosInstance.defaults.headers['Authorization'] =
                    'JWT ' + localStorage.getItem('access_token')
                resolve(res.data.access)
            })
            .catch(() => reject())
    })
}

export {
    getToken,
    checkout,
    verifyPayment,
    editAddress,
    deleteAddress,
    addToCart,
    getCommentsByProductId,
    getCategories,
    getProductsWithCategoryId,
    getProductsWithDiscount,
    getSliders,
    getBanners,
    getAllProducts,
    getProductById,
    getUserInfo,
    getLikes,
    getOrders,
    filterProducts,
    getBrands,
    refreshTokenToBlacklist,
    getCart,
    incrementQuantityOfOrderItem,
    decrementQuantityOfOrderItem,
    removeCartItem,
    getHomeCategories,
    getAddresses,
    createAddress,
    getCitiesAndStates,
}
