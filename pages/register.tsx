import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import DescriptionText from '../components/UserManager/DescriptionText'
import UserManagerContainer from '../components/UserManager/UserManagerContainer'
import { registerUser, RegisterUserProps } from '../services/api/requests'
import { addIranPrefixToNumber } from '../utils/convertors'
import { validateEmail } from '../utils/validators'

enum Errors {
    PhoneNumberExist = 3333,
    SmsService = 3242,
}

const RegisterPage: NextPage = () => {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const [state, setState] = useState<RegisterUserProps>({
        first_name: '',
        last_name: '',
        password: '',
        email: '',
        phone_number: '',
        user_name: '',
    })
    const handleRegisterUser = async () => {
        if (state.phone_number.length < 10) {
            toast.error('شماره تلفن معتبر نیست')
        } else if (!validateEmail(state.email)) {
            toast.error('ایمیل معتبر نیست')
        } else if (!(state.first_name.length && state.last_name.length)) {
            toast.error('نام و نام خانوادگی را وارد نمایید')
        } else if (state.password.length == 0) {
            toast.error('رمز وارد نشده')
        } else if (state.password.length < 8) {
            toast.error('رمز کوچک تر از 8 کاراکتر است')
        } else {
            setLoading(true)
            const userName = state.email.split('@')[0]
            if (userName) {
                await registerUser({
                    ...state,
                    user_name: userName,
                    phone_number: addIranPrefixToNumber(state.phone_number),
                })
                    .then(() => {
                        setLoading(false)
                        router.push(
                            `/phone-verification?phone_number=${addIranPrefixToNumber(
                                state.phone_number
                            )}`
                        )
                    })
                    .catch((err) => {
                        switch (err.response?.data?.code) {
                            case Errors.PhoneNumberExist:
                                toast.error('قبلا با این شماره وارد شده اید')
                                break
                            case Errors.SmsService:
                                toast.error(
                                    'مشکلی در سرویس ارسال پیامک رخ داده'
                                )
                                break
                            default:
                                toast.error(
                                    'مشکلی در ارسال اطلاعات رخ داده، پس از بررسی، مجدد امتحان کنید'
                                )
                        }
                        setLoading(false)
                    })
            }
        }
    }

    const handleChangeText = (e: React.FormEvent<HTMLInputElement>): void => {
        const {
            currentTarget: { name, value },
        } = e
        setState({
            ...state,
            [name]: value,
        })
    }
    const handleChangePhoneNumber = (e: React.FormEvent<HTMLInputElement>) => {
        setState({
            ...state,
            phone_number: String(parseInt(e.currentTarget.value) || ''),
        })
    }
    return (
        <UserManagerContainer>
            <div className={'flex justify-center'}>
                <div
                    className={
                        'flex bg-green-100 p-2 w-full rounded-2xl sm:rounded-xl'
                    }
                >
                    <div
                        className={
                            ' bg-green-500 text-white select-none justify-center flex px-5 flex-1 py-3 rounded-2xl sm:rounded-xl'
                        }
                    >
                        عضویت
                    </div>

                    <Link href={'/login'} passHref>
                        <div
                            className={
                                'active:bg-green-200 sm:rounded-lg select-none justify-center flex  flex-1 px-5 py-3 rounded-2xl'
                            }
                        >
                            ورود
                        </div>
                    </Link>
                </div>
            </div>
            <DescriptionText>
                برای عضویت به دقت اطلاعات زیر را وارد نمایید
                <Link href={'/'} passHref>
                    <p
                        className={
                            'text-xs cursor-pointer pt-3 text-center text-primary-500'
                        }
                    >
                        رفتن به خانه
                    </p>
                </Link>
            </DescriptionText>
            <div className={'py-2 sm:block hidden'} />
            <Input
                onChange={handleChangePhoneNumber}
                value={state.phone_number}
                name={'phone_number'}
                className={'text-lg sm:text-base text-left rounded-l-none'}
                containerClassName={'flex flex-row-reverse'}
                placeholder={'شماره '}
                style={{ direction: 'ltr' }}
                adornment={
                    <span
                        style={{ direction: 'ltr' }}
                        className={
                            'bg-gray-100 text-left rounded-l-md text-primary-500 border-r border-gray-200 items-center py-2 px-3'
                        }
                    >
                        +98
                    </span>
                }
            />
            <Input
                onChange={handleChangeText}
                value={state.email}
                name={'email'}
                className={'text-lg sm:text-base'}
                placeholder={'ایمیل'}
            />
            <div className={'flex gap-5'}>
                <Input
                    onChange={handleChangeText}
                    value={state.first_name}
                    name={'first_name'}
                    className={'text-lg sm:text-base'}
                    placeholder={'نام '}
                />
                <Input
                    onChange={handleChangeText}
                    value={state.last_name}
                    name={'last_name'}
                    className={'text-lg sm:text-base'}
                    placeholder={'نام خانوادگی'}
                />
            </div>
            <Input
                onChange={handleChangeText}
                value={state.password}
                name={'password'}
                type={'password'}
                className={'text-lg sm:text-base'}
                placeholder={'رمز   (بیشتر از 8 کاراکتر)'}
            />

            <Button
                onClick={handleRegisterUser}
                className={'text-lg sm:text-base'}
                title={'عضویت'}
                disabled={loading}
                loading={loading}
            />
            <Toaster />
        </UserManagerContainer>
    )
}

export default RegisterPage
