import React from 'react'
import { makeClasses } from '../../utils/style'
import Container from '../Container'
import Link from 'next/link'
import Image from 'next/image'

interface FooterProps {
    ignoreMarginTop?: boolean
}

export const data = {
    address: `تهران خیابان آزادی،روبروی دانشکده دامپزشکی،خیابان
        زارع پاساژ مجتمع تجاری و اداری دندانبان،طبقه3 واحد 31`,
    aboutUs: `
    شرکت آرمان اطلس پارسا به طور رسمی از سال ۱۳۹۸ فعالیت خود را با برند مدیکپ در زمینه دندانپزشکی و پزشکی آغاز کرد.
    فروشگاه اینترنتی مدیکپ با استفاده از عرصه دیجیتال یک وبسایت نوآورانه با آخرین روندهای جهانی توسعه محصولات جدید،مارک های معروف این اصناف را در اختیار شما قرار می دهد.
    اهداف مهم این مجموعه ارتقا و بهبود کیفیت در اقلام و محصولات و دسترسی و خرید کردن آسان برای کاربران میباشد .
    شرکت آرمان اطلس پارسا،ثبت در اداره کل تجهیزات پزشکی و سامانه تدارکات الکترونیکی دولت و زیرنظر اتحادیه و اصناف دندانپزشکی میباشد.
    `,
    phones: [
        { title: 'شماره تلفن', number: '021-66431845' },
        { title: 'شماره تلفن', number: '021-66431867' },
        { title: 'فکس', number: '021-66431490' },
        { title: 'شماره همراه', number: '09128465479' },
    ],
}

const ENAMAD_BANNER = `
<a
 referrerpolicy="origin" 
 target="_blank" 
 href="https://trustseal.enamad.ir/?id=184606&amp;Code=Kd1qsaUdp4cfvZV1yuAr"
 >
 <img referrerpolicy="origin"
  src="https://Trustseal.eNamad.ir/logo.aspx?id=184606&amp;Code=Kd1qsaUdp4cfvZV1yuAr" 
  alt="" 
  style="cursor:pointer" 
  id="Kd1qsaUdp4cfvZV1yuAr">
  </a>
`

const Footer: React.FC<FooterProps> = ({ ignoreMarginTop }): JSX.Element => {
    const classes = makeClasses({
        container: [
            'py-10',
            ignoreMarginTop ? '' : 'mt-10',
            'bg-gray-200',
            ' flex flex-col sm:grid sm:grid-cols-12',
        ],
    })
    return (
        <Container className={classes.container}>
            <div className={'md:col-span-2 hidden md:flex flex-col gap-3'}>
                <div>نقشه سایت</div>
                <GeneralLinks className={'flex flex-col text-gray-600'} />
            </div>

            <div
                className={
                    'col-span-6 flex flex-col sm:flex-row gap-5 lg:gap-10'
                }
            >
                <div className={'flex flex-col gap-3'}>
                    <div>درباره ما</div>
                    <div>{data.aboutUs}</div>
                </div>

                <div
                    className={
                        'lg:col-span-2 flex sm:flex-col flex-row gap-3 px-10 py-5'
                    }
                >
                    <div className={'h-24 w-24 relative'}>
                        <Image
                            src={'/medicaap-imed.png'}
                            layout={'fill'}
                            objectFit={'contain'}
                            alt={'imed'}
                        />
                    </div>
                    <div className={'h-24 w-24 relative'}>
                        <div
                            dangerouslySetInnerHTML={{ __html: ENAMAD_BANNER }}
                        />
                    </div>
                </div>
            </div>

            <div className={'col-span-5 md:col-span-4 flex flex-col gap-3'}>
                <div>ارتباط با ما</div>
                <div className={'flex flex-col gap-3 pb-20 sm:pb-0'}>
                    <div className={'text-sm bg-gray-300 px-4 py-3 rounded-xl'}>
                        آدرس: {data.address}
                    </div>
                    <div
                        className={
                            'text-sm bg-gray-300 px-4 py-3 grid grid-cols-1 sm:grid-cols-2 rounded-xl gap-2'
                        }
                    >
                        {data.phones.map((phone, index) => (
                            <a
                                key={index}
                                className={'flex gap-2 col-span-1'}
                                href={`tel:${phone.number}`}
                            >
                                <span>{phone.title}: </span>
                                <span className={'flex text-left'}>
                                    {phone.number}
                                </span>
                            </a>
                        ))}
                    </div>
                    <a
                        target={'_blank'}
                        rel={'noreferrer'}
                        href={'https://www.instagram.com/medicaap/'}
                        className={
                            'text-sm text-white block from-yellow-600 via-red-500 to-purple-500 bg-gradient-to-r px-4 py-3 rounded-xl'
                        }
                    >
                        ما را در اینستاگرام دنبال کنید{' '}
                        <span dir={'ltr'}>@medicaap</span>
                    </a>
                </div>
            </div>
        </Container>
    )
}

export const GeneralLinks = ({
    className = '',
}: {
    className: string
}): JSX.Element => {
    return (
        <div className={className}>
            <Link href={'/cart'}>
                <a>سبد خرید</a>
            </Link>
            <Link href={'/filter'}>
                <a>فیلتر</a>
            </Link>
            <Link href={'/login'}>
                <a>ورود</a>
            </Link>
            <Link href={'/register'}>
                <a>عضویت</a>
            </Link>
            <Link href={'/account'}>
                <a>حساب کاربری</a>
            </Link>
        </div>
    )
}

export default Footer
