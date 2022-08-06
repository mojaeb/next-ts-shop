import { NextPage } from 'next/'
import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { MdClose } from 'react-icons/md'
import { RiDeleteBinLine } from 'react-icons/ri'
import AddressField from '../../components/Account/AddressField'
import Menu, { menuItems } from '../../components/Account/Menu'
import Button from '../../components/common/Button'
import Checkbox from '../../components/common/Checkbox'
import Input from '../../components/common/Input'
import OverlayLoading from '../../components/common/OverlayLoading'
import Container from '../../components/Container'
import Layout from '../../components/Layout'
import states from '../../public/states.json'
import {
    AddressProps,
    CategoryProps,
    CityProps,
    createAddress,
    deleteAddress,
    editAddress,
    getAddresses,
    getCategories,
    StateProps,
} from '../../services/api/requests'

export const useAddress = (): {
    openModal: boolean
    handleOpenModal: () => void
    loading: boolean
    handleEditAddress: (data: AddressProps, id: number) => void
    addresses: AddressProps[]
    handleCloseModal: () => void
    editDraft: AddressProps | null
    handleEdit: (address: AddressProps) => void
    handleCreateAddress: (data: AddressProps) => void
    handleDelete: (id: number) => void
    citiesAndStates: StateProps[] | null
} => {
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [editDraft, setEditDraft] = useState<AddressProps | null>(null)
    const [loading, setLoading] = useState(false)
    const [addresses, setAddresses] = useState<AddressProps[] | []>([])
    const [citiesAndStates, setCitiesAndStates] = useState<StateProps[] | null>(
        null
    )

    const handleOpenModal = () => {
        if (!citiesAndStates) {
            handleGetCitiesAndStates()
        }
        setOpenModal(true)
    }
    const handleCloseModal = () => {
        setOpenModal(false)
        setEditDraft(null)
    }

    const handleEdit = (selectedAddress: AddressProps) => {
        setEditDraft(selectedAddress)
        handleOpenModal()
    }

    const handleCreateAddress = async (data: AddressProps) => {
        setLoading(true)
        try {
            await createAddress(data)
            handleGetAddresses()
            setLoading(false)
            handleCloseModal()
        } catch (err) {
            toast.error('مشکلی رخ داده لطفا دوباره تلاش کنید')
        }
    }
    const handleEditAddress = async (data: AddressProps, id: number) => {
        try {
            await editAddress(data, id)
            handleGetAddresses()
            setLoading(false)
            handleCloseModal()
        } catch (err) {
            toast.error('مشکلی رخ داده لطفا دوباره تلاش کنید')
        }
    }

    const handleGetCitiesAndStates = async () => {
        setCitiesAndStates(states.entries)
    }

    const handleDelete = async (id: number) => {
        handleCloseModal()
        setLoading(true)
        await deleteAddress(id)
        handleGetAddresses()
    }
    const handleGetAddresses = async () => {
        setLoading(true)
        try {
            const data: AddressProps[] = await getAddresses()
            setAddresses(data)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        handleGetAddresses()
    }, [])
    return {
        handleOpenModal,
        loading,
        handleEditAddress,
        openModal,
        addresses,
        handleCloseModal,
        editDraft,
        handleEdit,
        handleCreateAddress,
        handleDelete,
        citiesAndStates,
    }
}

export const getStaticProps = async (): Promise<unknown> => {
    let categories: CategoryProps[] = await getCategories()
    return { props: { categories }, revalidate: 2000 }
}

const Addresses: NextPage<{ categories: CategoryProps[] }> = ({
    categories,
}) => {
    const {
        handleOpenModal,
        loading,
        handleEditAddress,
        openModal,
        addresses,
        handleCloseModal,
        editDraft,
        handleEdit,
        handleCreateAddress,
        handleDelete,
        citiesAndStates,
    } = useAddress()

    return (
        <Layout categories={categories} ignoreFooterMarginTop title={'آدرس ها'}>
            <div
                className={'grid grid-cols-10 relative'}
                style={{ minHeight: 'calc(100vh - 80px)' }}
            >
                <Menu hiddenInMobile activeItem={menuItems.addresses} />
                <Container
                    className={
                        'col-span-10 sm:col-span-8 p-2 sm:p-5 sm:pl-6 sm:pr-6'
                    }
                >
                    <div
                        className={
                            'h-full bg-white rounded-xl flex divide-y flex-col overflow-hidden'
                        }
                    >
                        <div
                            className={
                                'px-2 sm:px-12  py-3 flex flex-row-reverse'
                            }
                        >
                            <Button
                                onClick={() => handleOpenModal()}
                                title={'آدرس جدید'}
                            />
                        </div>

                        <div className={'relative flex-1'}>
                            {loading && <OverlayLoading />}
                            <div
                                className={
                                    'inset-0 flex flex-col divide-y sm:absolute overflow-auto scrollbar-thin'
                                }
                            >
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
                                    />
                                ))}
                            </div>
                        </div>
                        {!!openModal && (
                            <NewAddressModal
                                onDelete={handleDelete}
                                loading={loading}
                                citiesAndStates={citiesAndStates}
                                onCreate={handleCreateAddress}
                                open={openModal}
                                modalProps={editDraft}
                                onClose={handleCloseModal}
                                onEdit={handleEditAddress}
                            />
                        )}
                    </div>
                </Container>
            </div>

            <Toaster />
        </Layout>
    )
}

interface NewAddressModalProps {
    onClose: () => void
    onCreate: (state: AddressProps) => void
    onEdit: (state: AddressProps, id: number) => void
    onDelete: (id: number) => void
    open: boolean
    modalProps: AddressProps | null
    citiesAndStates: StateProps[] | null
    loading: boolean
}

const DEFAULT_MODAL_STATE = {
    id: null,
    city: '',
    city_code: '',
    state_code: '',
    state: '',
    location: '',
    address: '',
    is_mine: true,
    phone_number: '',
    first_name: '',
    last_name: '',
    house_number: null,
    unit: null,
}

export const NewAddressModal: React.FC<NewAddressModalProps> = ({
    onClose,
    onCreate,
    modalProps,
    citiesAndStates,
    onDelete,
    onEdit,
}): JSX.Element | null => {
    const initialProps = modalProps ? modalProps : DEFAULT_MODAL_STATE
    const [state, setState] = useState<AddressProps>(
        initialProps as AddressProps
    )
    const [zone, setZone] = useState<{
        state: StateProps | null
        city: CityProps | null
    }>({
        state: null,
        city: null,
    })
    const handleEnableInputsForAnotherReceiver = () => {
        setState({
            ...state,
            is_mine: !state.is_mine,
            first_name: '',
            last_name: '',
            phone_number: '',
        })
    }

    const activeAnotherReceiver = !state.is_mine

    const handleChangeText = (e: React.FormEvent<HTMLInputElement>): void => {
        const {
            currentTarget: { name, value },
        } = e
        setState({
            ...state,
            [name]: value,
        })
    }
    const handleChangeNumber = (e: React.FormEvent<HTMLInputElement>): void => {
        const {
            currentTarget: { name, value },
        } = e
        setState({
            ...state,
            [name]: parseInt(value) || 0,
        })
    }
    const handleSetState = (
        e:
            | React.BaseSyntheticEvent<HTMLSelectElement>
            | React.ChangeEvent<HTMLSelectElement>
    ) => {
        if (citiesAndStates) {
            const state =
                citiesAndStates.find(
                    (s) => s.code === parseInt(e.currentTarget.value)
                ) || null
            setZone({ ...zone, state: state, city: null })
        }
    }
    const handleSetCity = (
        e:
            | React.BaseSyntheticEvent<HTMLSelectElement>
            | React.ChangeEvent<HTMLSelectElement>
    ) => {
        if (citiesAndStates && zone.state) {
            const city =
                zone.state.cities.find(
                    (c) => c.code === parseInt(e.currentTarget.value)
                ) || null
            setZone({ ...zone, city: city })
        }
    }

    const handleSubmit = () => {
        if (zone.city && zone.state) {
            let obj: AddressProps = {
                ...state,
                city: zone.city.title,
                city_code: zone.city.code,
                state: zone.state.title,
                state_code: zone.state.code,
            }
            // omit empty and ignore user object
            obj = Object.keys(obj).reduce((acc: AddressProps, curr) => {
                if (curr !== 'user')
                    if (
                        Object(obj)[curr] !== null &&
                        typeof Object(obj)[curr] !== 'undefined'
                    )
                        Object(acc)[curr] = Object(obj)[curr]
                return acc
            }, {} as AddressProps)

            if (!modalProps) {
                onCreate(obj)
            } else {
                onEdit(obj, modalProps.id)
            }
        }
    }

    useEffect(() => {
        const handleSetZone = (cityCode: string, stateCode: string) => {
            const state = citiesAndStates?.find(
                (s) => s.code === parseInt(stateCode)
            )
            const city = state?.cities.find(
                (c) => c.code === parseInt(cityCode)
            )
            setZone({
                state: state || null,
                city: city || null,
            })
        }
        if (modalProps) {
            handleSetZone(
                String(modalProps?.city_code),
                String(modalProps?.state_code)
            )
        }
    }, [modalProps, citiesAndStates])

    return (
        <div
            className={
                'fixed inset-0 bg-gray-500 flex justify-center items-center bg-opacity-60 overflow-hidden'
            }
            style={{ zIndex: 500000 }}
        >
            <div
                className={
                    'p-5 w-96 sm:h-auto flex flex-col h-full bg-white rounded-lg divide-y'
                }
            >
                <div className={'flex justify-between pb-3'}>
                    <p className={'text-gray-600'}>ویرایش آدرس</p>
                    <div className={'flex gap-2'}>
                        {state.id && (
                            <div
                                onClick={() => onDelete(state.id)}
                                className={
                                    ' p-1 hover:bg-red-500 hover:text-white rounded-md transition cursor-pointer'
                                }
                            >
                                <RiDeleteBinLine />
                            </div>
                        )}
                        <div
                            className={
                                'bg-primary-100 hover:bg-primary-500 transition cursor-pointer hover:text-white h-6 w-6 flex justify-center items-center text-primary-500 rounded-md'
                            }
                            onClick={onClose}
                        >
                            <MdClose size={20} />
                        </div>
                    </div>
                </div>

                <div className={'py-3 px-1 flex flex-col gap-3'}>
                    <Input
                        placeholder={'آدرس'}
                        value={state?.address}
                        name={'address'}
                        onChange={handleChangeText}
                    />
                    <div className={'flex gap-3'}>
                        <Select
                            name={'states'}
                            value={zone?.state?.code}
                            onChange={handleSetState}
                        >
                            <option value="">استان</option>
                            {citiesAndStates?.map((s, i) => (
                                <option value={s.code} key={i}>
                                    {s.title}
                                </option>
                            ))}
                        </Select>
                        <Select
                            value={zone.city?.code}
                            name={'cities'}
                            disabled={!zone.state}
                            onChange={handleSetCity}
                        >
                            <option value="">شهر</option>
                            {zone.state &&
                                zone.state.cities?.map((c, i) => (
                                    <option value={c.code} key={i}>
                                        {c.title}
                                    </option>
                                ))}
                        </Select>
                    </div>
                    <div className={'grid grid-cols-12 gap-3'}>
                        <div className={'col-span-3'}>
                            <Input
                                placeholder={'پلاک'}
                                value={state?.house_number || ''}
                                name={'house_number'}
                                onChange={handleChangeNumber}
                            />
                        </div>

                        <div className={'col-span-3'}>
                            <Input
                                placeholder={'واحد'}
                                value={state?.unit || ''}
                                name={'unit'}
                                onChange={handleChangeNumber}
                            />
                        </div>
                        <div className={'col-span-6'}>
                            <Input
                                placeholder={'کد پستی'}
                                value={state?.zip_code}
                                name={'zip_code'}
                                onChange={handleChangeNumber}
                            />
                        </div>
                    </div>
                </div>
                <div className={'py-3 px-1'}>
                    <Checkbox
                        onClick={handleEnableInputsForAnotherReceiver}
                        selected={activeAnotherReceiver}
                        containerClassName={'text-sm px-1'}
                        text={'دریافت توسط شخص دیگر'}
                    />
                    <div className={'flex flex-col gap-3 pt-3'}>
                        <div className={'flex gap-3'}>
                            <Input
                                disabled={!activeAnotherReceiver}
                                placeholder={'نام'}
                                value={state?.first_name}
                                name={'first_name'}
                                onChange={handleChangeText}
                            />
                            <Input
                                disabled={!activeAnotherReceiver}
                                placeholder={'نام خانوادگی'}
                                value={state?.last_name}
                                name={'last_name'}
                                onChange={handleChangeText}
                            />
                        </div>
                        <Input
                            type={'number'}
                            disabled={!activeAnotherReceiver}
                            placeholder={'شماره تماس'}
                            value={state?.phone_number}
                            name={'phone_number'}
                            onChange={handleChangeText}
                        />
                    </div>
                </div>
                <div
                    className={
                        'flex-1 flex text-xl sm:text-base flex-col-reverse'
                    }
                >
                    <Button
                        disabled={
                            !(
                                zone.state &&
                                zone.city &&
                                state.address &&
                                state.zip_code &&
                                (activeAnotherReceiver
                                    ? state.first_name &&
                                      state.last_name &&
                                      state.phone_number
                                    : true)
                            )
                        }
                        title={modalProps ? 'ویرایش' : 'ثبت'}
                        onClick={handleSubmit}
                    />
                </div>
            </div>
        </div>
    )
}

const Select = ({
    name,
    id,
    children,
    onChange,
    disabled,
    value,
}: {
    name?: string
    id?: string
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
    children: React.ReactNode
    disabled?: boolean
    value?: string | number
}) => {
    return (
        <select
            disabled={disabled}
            name={name}
            id={id}
            onChange={onChange}
            className={`bg-gray-100 rounded-md px-2 py-2 flex-1 ${
                disabled ? 'opacity-30 bg-gray-300' : ''
            } whitespace-nowrap overflow-hidden overflow-ellipsis`}
            value={value}
        >
            {children}
        </select>
    )
}

export default Addresses
