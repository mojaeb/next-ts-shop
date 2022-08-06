import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import DescriptionText from '../components/UserManager/DescriptionText'
import TitleText from '../components/UserManager/TitleText'
import UserManagerContainer from '../components/UserManager/UserManagerContainer'
import { getRegisterCodeTime, verifyCode } from '../services/api/requests'

const getTimeout = (phone: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await getRegisterCodeTime(phone.toString())
            console.log(data)
            const now = new Date()
            const expiredAt = new Date(data.data.expired_at)
            const diff = expiredAt.getTime() - now.getTime()
            const diffSeconds = Math.round(diff / 1000)
            if (diffSeconds <= 0) {
                reject()
            }
            resolve(diffSeconds)
        } catch (err) {
            reject(err)
        }
    })
}

const Login: NextPage = () => {
    const router = useRouter()
    const phone = router && router.query && router.query.phone_number
    const [timer, setTimer] = useState(0)
    const [error, setError] = useState(false)
    const [code, setCode] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!Array.isArray(phone) && typeof phone === 'string') {
            getTimeout(phone)
                .then((time) => setTimer(time as number))
                .catch(() => setError(true))
        }
    }, [phone])

    const handleVerifyCode = async () => {
        setLoading(true)
        try {
            await verifyCode(code, phone as string)
            router.push(`/login?phone_number=${phone}`)
        } catch (err) {
            toast.error('کد وارد شده صحیح نمی باشد')
            setLoading(false)
        }
    }
    const handleChangeCode = (e: React.FormEvent<HTMLInputElement>) => {
        setCode(e.currentTarget.value)
    }

    useEffect(() => {
        if (timer > 0) {
            setTimeout(() => {
                setTimer(timer - 1)
            }, 1000)
        }
    }, [timer])

    return (
        <UserManagerContainer>
            <div className={'px-5 flex flex-col items-center'}>
                <TitleText>تایید شماره</TitleText>
                <DescriptionText>
                    به شماره {phone} کد تایید ارسال شده لطفا آن را در زیر وارد
                    نمایید
                </DescriptionText>
            </div>
            <br />
            <br />
            <Input
                placeholder={'کد'}
                value={code}
                onChange={handleChangeCode}
            />
            {!error ? (
                <p className={'text-blue-500 text-xs px-2'}>
                    زمان باقی مانده {timer} ثانیه
                </p>
            ) : (
                <p className={'text-red-500 text-xs px-2'}>
                    زمان به پایان رسیده
                </p>
            )}

            <Button
                title={'تایید'}
                loading={loading}
                disabled={loading}
                onClick={handleVerifyCode}
            />

            <Toaster position={'bottom-center'} />
        </UserManagerContainer>
    )
}

export default Login
