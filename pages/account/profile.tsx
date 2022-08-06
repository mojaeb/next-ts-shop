import { NextPage } from 'next/'
import Image from 'next/image'
import React, { ChangeEvent, useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { MdPhotoCamera } from 'react-icons/md'
import Menu, { menuItems } from '../../components/Account/Menu'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import OverlayLoading from '../../components/common/OverlayLoading'
import Container from '../../components/Container'
import Layout from '../../components/Layout'
import {
    CategoryProps,
    changePassword,
    changeUserProfileImage,
    editProfile,
    getCategories,
    getUserInfo,
    UserProps,
} from '../../services/api/requests'
import {
    addIranPrefixToNumber,
    relativeToAbsoluteURL,
    removeIranPrefixToNumber,
} from '../../utils/convertors'

export const getStaticProps = async (): Promise<unknown> => {
    let categories: CategoryProps[] = await getCategories()
    return { props: { categories }, revalidate: 2000 }
}

const Profile: NextPage<{ categories: CategoryProps[] }> = ({ categories }) => {
    const [loading, setLoading] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [profile, setProfile] = React.useState<UserProps>({
        email: '',
        user_name: '',
        phone_number: '',
        last_name: '',
        first_name: '',
        profile_image: '',
        id: 0,
        is_superuser: false,
    })
    const [password, setPassword] = useState({
        new_password: '',
        repeat_password: '',
    })

    const handleChangeProfileImage = async (
        e: ChangeEvent<HTMLInputElement>
    ) => {
        const image: FileList | null = (e.target as HTMLInputElement).files
        const selectedImage = image && image[0]
        const data = new FormData()
        setLoading(true)
        data.append('image', selectedImage as FormDataEntryValue)
        await changeUserProfileImage(data)
        await handleGetProfile()
    }

    const handleGetProfile = async () => {
        setLoading(true)
        const data = await getUserInfo()
        setLoading(false)
        setProfile({
            ...data,
            phone_number: removeIranPrefixToNumber(data.phone_number),
        })
    }
    const handleSubmit = async () => {
        if (profile) {
            await editProfile({
                ...profile,
                phone_number: addIranPrefixToNumber(profile.phone_number),
            })
            toast.success('ذخیره انجام شد')
            await handleGetProfile()
        }
    }
    const handleChangeText = (e: React.FormEvent<HTMLInputElement>): void => {
        const {
            currentTarget: { name, value },
        } = e
        setProfile({
            ...profile,
            [name]: value,
        })
    }

    const handleChangePasswordText = (
        e: React.FormEvent<HTMLInputElement>
    ): void => {
        const {
            currentTarget: { name, value },
        } = e
        setPassword({
            ...password,
            [name]: value,
        })
    }

    const handleChangePassword = async () => {
        if (password.new_password !== password.repeat_password) {
            toast.error('تکرار رمز با رمز جدید برابر نیست')
        } else if (password.new_password.length < 8) {
            toast.error('رمز باید حداقل حاوی 8 کاراکتر باشد')
        } else {
            try {
                setLoading(true)
                await changePassword(password.new_password)
                toast.success('تغییر رمز با موفقیت انجام شد')
                setLoading(false)
                handleCloseModal()
            } catch (err) {
                setLoading(false)
                toast.error('تغییر رمز با مشکل مواجه شده')
            }
        }
    }

    const handleOpenModal = () => setOpenModal(true)
    const handleCloseModal = () => setOpenModal(false)

    useEffect(() => {
        handleGetProfile().then(() => console.log('get profile'))
    }, [])

    return (
        <Layout categories={categories} ignoreFooterMarginTop title={'داشبورد'}>
            <div
                className={'grid grid-cols-10 relative'}
                style={{ minHeight: 'calc(100vh - 80px)' }}
            >
                <Menu hiddenInMobile={true} activeItem={menuItems.dashboard} />
                <Container
                    className={
                        'relative py-12 px-10 col-span-12 sm:col-span-8 sm:p-12 sm:px-16'
                    }
                    hasDefaultStyle={false}
                >
                    {loading && <OverlayLoading />}
                    <div
                        className={
                            'flex sm:justify-start sm:flex-row flex-col gap-10 sm:gap-14'
                        }
                    >
                        <div
                            className={
                                'sm:block flex justify-center items-center'
                            }
                        >
                            <div
                                className={
                                    'h-60 w-60 relative rounded-xl overflow-hidden'
                                }
                            >
                                <Image
                                    layout={'fill'}
                                    objectFit={'cover'}
                                    src={
                                        profile?.profile_image
                                            ? relativeToAbsoluteURL(
                                                  profile.profile_image
                                              )
                                            : '/profile.jpg'
                                    }
                                    alt={'profile image'}
                                />
                                <div
                                    className={`absolute flex  inset-0 items-center justify-center opacity-0 hover:opacity-100 bg-primary-400 transition-all bg-opacity-0 hover:bg-opacity-25`}
                                >
                                    <div
                                        className={`bg-primary-900 bg-opacity-10 px-5 py-2 rounded-xl text-primary-500`}
                                    >
                                        <MdPhotoCamera size={30} />
                                    </div>
                                </div>
                                <input
                                    className={'absolute inset-0 opacity-0'}
                                    type={'file'}
                                    onChange={handleChangeProfileImage}
                                />
                            </div>
                        </div>
                        <div
                            className={
                                'w-full sm:w-3/5 divide-y flex flex-col gap-5'
                            }
                        >
                            <div className={'flex justify-between'}>
                                <p>ویرایش پروفایل</p>
                                <Button
                                    title={'ذخیره'}
                                    onClick={handleSubmit}
                                />
                            </div>
                            <div className={'pt-5  flex flex-col gap-5'}>
                                <div className={'w-full flex gap-10'}>
                                    <Input
                                        onChange={handleChangeText}
                                        name={'first_name'}
                                        value={profile?.first_name}
                                        placeholder={'نام'}
                                        containerClassName={'flex-1'}
                                    />
                                    <Input
                                        onChange={handleChangeText}
                                        name={'last_name'}
                                        value={profile?.last_name}
                                        placeholder={'نام خانوادگی'}
                                        containerClassName={'flex-1'}
                                    />
                                </div>
                                <Input
                                    onChange={handleChangeText}
                                    name={'email'}
                                    value={profile?.email}
                                    placeholder={'ایمیل'}
                                />
                                <div className={'w-full flex gap-10'}>
                                    <Input
                                        onChange={handleChangeText}
                                        name={'user_name'}
                                        value={profile?.user_name}
                                        placeholder={'نام کاربری'}
                                        containerClassName={'flex-1'}
                                    />
                                    <Input
                                        onChange={handleChangeText}
                                        name={'phone_number'}
                                        value={profile?.phone_number}
                                        placeholder={'شماره'}
                                        containerClassName={'flex-1'}
                                    />
                                </div>
                            </div>
                            <div className={'pt-5 flex'}>
                                <Button
                                    onClick={handleOpenModal}
                                    title={'ویرایش رمز'}
                                    variant={'soft'}
                                    loading={loading}
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    </div>
                    {openModal && (
                        <div
                            style={{ zIndex: 200000 }}
                            className={
                                'fixed flex justify-center items-center inset-0 bg-black bg-opacity-10'
                            }
                        >
                            <div
                                className={
                                    'w-80 rounded-lg p-5 bg-white flex flex-col divide-y'
                                }
                            >
                                <div className={'flex flex-col gap-4 mb-3'}>
                                    <Input
                                        placeholder={'رمز جدید'}
                                        value={password.new_password}
                                        type={'password'}
                                        name={'new_password'}
                                        onChange={handleChangePasswordText}
                                    />
                                    <Input
                                        placeholder={'تکرار رمز'}
                                        value={password.repeat_password}
                                        type={'password'}
                                        name={'repeat_password'}
                                        onChange={handleChangePasswordText}
                                    />
                                </div>
                                <div className={'flex gap-3 pt-3'}>
                                    <Button
                                        title={'ثبت'}
                                        onClick={handleChangePassword}
                                        loading={loading}
                                        disabled={loading}
                                    />
                                    <Button
                                        title={'لغو'}
                                        onClick={handleCloseModal}
                                        variant={'soft'}
                                        loading={loading}
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    <Toaster position={'bottom-center'} />
                </Container>
            </div>
        </Layout>
    )
}

export default Profile
