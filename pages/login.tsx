import { NextPage } from 'next'
import Link from 'next/link'
import React, { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import DescriptionText from '../components/UserManager/DescriptionText'
import UserManagerContainer from '../components/UserManager/UserManagerContainer'
import { getToken } from '../services/api/requests'

const Login: NextPage = () => {
    const [phone, setPhone] = useState('')
    const [loading, setLoading] = useState<boolean>(false)
    const [password, setPassword] = useState('')
    const handleChangePhoneNumber = (e: React.FormEvent<HTMLInputElement>) => {
        setPhone(String(parseInt(e.currentTarget.value) || ''))
    }
    const handleChangePassword = (e: React.FormEvent<HTMLInputElement>) => {
        setPassword(e.currentTarget.value)
    }
    const handleLogin = () => {
        setLoading(true)
        window.localStorage.removeItem('profile')
        const phoneNumberWithPrefix = `98${phone}`
        getToken({ phone: phoneNumberWithPrefix, password })
            .then(() => {
                window.location.href = '/'
            })
            .catch(() => {
                toast.error('لطفا اطلاعات خود را بررسی و دوباره امتحان کنید')
                setLoading(false)
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
                    <Link href={'/register'} passHref>
                        <div
                            className={
                                'active:bg-green-200 select-none justify-center flex px-5 flex-1 py-3 rounded-2xl sm:rounded-xl'
                            }
                        >
                            عضویت
                        </div>
                    </Link>
                    <div
                        className={
                            'bg-green-500 sm:rounded-lg select-none justify-center flex text-white flex-1 px-5 py-3 rounded-2xl'
                        }
                    >
                        ورود
                    </div>
                </div>
            </div>
            <DescriptionText>
                لطفا شماره تلفن و رمز عبور خود را وارد نمایید در صورت نداشتن
                نداشتن حساب بر روی عضویت کلیک نمایید
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

            <br />
            <br />
            <Input
                name={'number'}
                value={phone}
                className={'text-lg sm:text-base text-left rounded-l-none'}
                containerClassName={'flex flex-row-reverse'}
                placeholder={'شماره '}
                style={{ direction: 'ltr' }}
                onChange={handleChangePhoneNumber}
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
                name={'password'}
                value={password}
                className={'text-lg sm:text-base'}
                placeholder={'رمز '}
                type={'password'}
                onChange={handleChangePassword}
            />

            <Button
                loading={loading}
                className={'text-lg sm:text-base'}
                title={'ورود'}
                disabled={loading}
                onClick={handleLogin}
            />
            <Toaster />
        </UserManagerContainer>
    )
}

export default Login
