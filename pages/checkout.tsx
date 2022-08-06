import { NextPage } from 'next'
import React from 'react'
import AddressField from '../components/Account/AddressField'
import CartItemsSheet from '../components/Cart/CartItemSheet'
import PriceItem from '../components/Cart/PriceItem'
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import Container from '../components/Container'
import Layout from '../components/Layout'
import Checkbox from '../components/common/Checkbox'
import { NewAddressModal, useAddress } from './account/addresses'
import { CartType, useCart } from './cart'
import toast, { Toaster } from 'react-hot-toast'
import {
    AddressProps,
    CategoryProps,
    changeOrderAddress,
    checkout,
    getCategories,
} from '../services/api/requests'

export const getStaticProps = async (): Promise<unknown> => {
    let categories: CategoryProps[] = await getCategories()
    return { props: { categories }, revalidate: 20000 }
}

const CartPage: NextPage<{ categories: CategoryProps[] }> = ({
    categories,
}) => {
    const {
        handleDecrementQuantity,
        handleIncrementQuantity,
        cart,
        handleRemoveCartItem,
        loading,
        handleGetCart,
        setLoading,
    } = useCart(CartType.checkout)
    const handleCheckout = async () => {
        setLoading(true)
        try {
            const data = await checkout()
            window.location.href = data['pay_url']
        } catch (err) {
            toast.error('اتصال به درگاه موفقیت آمیز نبود')
            setLoading(false)
        }
    }
    return (
        <Layout title={'cart page'} categories={categories}>
            <Container
                className={
                    'flex flex-col sm:flex-row pt-3 sm:pt-10 pb-10 gap-3 sm:gap-5'
                }
            >
                <div className={'flex-1'}>
                    <AddressesSection
                        selectedAddressId={cart?.address?.id}
                        onReload={handleGetCart}
                    />
                    <br />
                    <CartItemsSheet
                        removeItem={handleRemoveCartItem}
                        items={cart?.order_items}
                        loading={loading}
                        incrementQuantity={handleIncrementQuantity}
                        decrementQuantity={handleDecrementQuantity}
                    />
                </div>
                <div>
                    <Card width={'auto sm:w-80'}>
                        <div className={'flex flex-col pb-5 divide-y'}>
                            <PriceItem
                                price={cart?.total_price.toToman()}
                                label={'قیمت کل'}
                            />
                            <PriceItem
                                price={cart?.total_discount.toToman()}
                                label={'قیمت تخفیف'}
                            />
                            <PriceItem
                                size={'sm'}
                                price={cart?.total_price_after_discount.toToman()}
                                label={'قیمت کل با تخفیف'}
                            />
                            {cart?.shipping_price ? (
                                <PriceItem
                                    price={cart?.shipping_price.toToman()}
                                    label={'هزینه پست'}
                                />
                            ) : (
                                <PriceItem
                                    price={0}
                                    error
                                    label={'آدرس وارد نشده'}
                                />
                            )}
                            <div className={'py-3 px-3 flex items-center'}>
                                <Checkbox selected={true} />
                                <div>
                                    <p>خرید توسط زرین پال</p>
                                    <p className={'text-xs text-gray-400'}>
                                        پرداخت شما از طریق درگاه زرین پال انجام
                                        میشود
                                    </p>
                                </div>
                            </div>
                            <PriceItem
                                price={
                                    !cart?.total_price_after_shipping
                                        ? cart?.total_price_after_discount.toToman()
                                        : cart?.total_price_after_shipping.toToman()
                                }
                                size={'lg'}
                                ignoreColor
                                label={'قیمت نهایی'}
                            />
                        </div>
                        <Button
                            disabled={!cart?.address || loading}
                            title={'تکمیل خرید'}
                            onClick={handleCheckout}
                            loading={loading}
                        />
                    </Card>
                </div>
                <Toaster position={'bottom-center'} />
            </Container>
        </Layout>
    )
}

type reloadWrapperCallback = (
    ...args: (AddressProps | number)[]
) => Promise<void> | void

export const AddressesSection = ({
    onReload,
    selectedAddressId,
}: {
    selectedAddressId: number | null | undefined
    onReload: () => void
}): JSX.Element => {
    const {
        handleOpenModal,
        loading,
        handleEditAddress,
        openModal,
        addresses,
        handleCloseModal,
        editDraft,
        handleEdit, //open edit modal! TODO change this shit name
        handleCreateAddress,
        handleDelete,
        citiesAndStates,
    } = useAddress()

    const reloadWrapper =
        (func: reloadWrapperCallback) =>
        async (...args: (AddressProps | number)[]) => {
            await func(...args)
            onReload()
        }
    const handleChangeOrderAddress = async (addressId: number) => {
        if (addressId !== selectedAddressId) {
            try {
                await changeOrderAddress(addressId)
                toast.success('آدرس با موفقیت تغییر کرد')
                onReload()
            } catch (err) {
                toast.error('مشکلی رخ داده لطفا دوباره امتحان کنید')
            }
        }
    }

    return (
        <div>
            <Card className={'divide-y pr-0 rounded-b-none pl-0 pb-0'}>
                {!addresses.length && (
                    <div
                        className={
                            'py-10 px-10 flex justify-center items-center'
                        }
                    >
                        <div
                            className={
                                'px-6 py-2 bg-green-50 rounded-lg text-green-600'
                            }
                        >
                            هیچ آدرسی ثبت نشده
                        </div>
                    </div>
                )}
                {addresses.map((a, index) => (
                    <AddressField
                        city={a.city}
                        state={a.state}
                        address={a.address}
                        onEdit={() => handleEdit(a)}
                        receiverName={
                            a.is_mine
                                ? `${a.user.first_name} ${a.user.last_name}`
                                : `${a.first_name} ${a.last_name} `
                        }
                        phoneNumber={a.user.phone_number}
                        key={index}
                        selected={a.id === selectedAddressId}
                        hasCheckbox
                        onChangeCheckbox={() => handleChangeOrderAddress(a.id)}
                    />
                ))}
            </Card>
            <div
                onClick={handleOpenModal}
                className={
                    'py-2 px-6 rounded-b-xl hover:bg-primary-100 transition cursor-pointer bg-primary-50 text-primary-600'
                }
            >
                ایجاد آدرس جدید
            </div>
            {!!openModal && (
                <NewAddressModal
                    onDelete={reloadWrapper(
                        handleDelete as reloadWrapperCallback
                    )}
                    loading={loading}
                    citiesAndStates={citiesAndStates}
                    onCreate={reloadWrapper(
                        handleCreateAddress as reloadWrapperCallback
                    )}
                    open={openModal}
                    modalProps={editDraft}
                    onClose={handleCloseModal}
                    onEdit={reloadWrapper(
                        handleEditAddress as reloadWrapperCallback
                    )}
                />
            )}
        </div>
    )
}

export default CartPage
