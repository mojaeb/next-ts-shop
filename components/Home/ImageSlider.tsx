import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { RiArrowLeftLine, RiArrowRightLine } from 'react-icons/ri'
import SwiperCore, { Autoplay, Navigation } from 'swiper'
import 'swiper/css'
import 'swiper/css/free-mode'
import { Swiper, SwiperSlide } from 'swiper/react'
import styles from '../../styles/imageSlider.module.css'
import { relativeToAbsoluteURL } from '../../utils/convertors'

SwiperCore.use([Autoplay, Navigation])

export type slideType = {
    image: string
    title: string
    description: string
    url: string
}

interface slideProps {
    realIndex: number
}
const DEFAULT_SLIDE: slideType = {
    url: '',
    image: '',
    title: '',
    description: '',
}

interface ImageSliderProps {
    slides: slideType[]
}

const ImageSlider: React.FC<ImageSliderProps> = ({
    slides = [],
}): JSX.Element => {
    const [context, setContext] = useState<slideType>(DEFAULT_SLIDE)
    const handleActive = (e: slideProps): void => {
        let slide: slideType = slides[e.realIndex]
        setContext(slide)
    }
    return (
        <div
            id={styles.container}
            className={'lg:col-span-3 relative rounded-lg overflow-hidden'}
        >
            <Swiper
                onActiveIndexChange={handleActive}
                spaceBetween={0}
                effect={'fade'}
                navigation={{
                    prevEl: '.prev',
                    nextEl: '.next',
                }}
                loop
                autoplay={{
                    delay: 7000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                className="w-full h-full"
            >
                {slides &&
                    slides.map((slide, index) => (
                        <SwiperSlide key={index}>
                            <div className={'relative w-full h-full '}>
                                <Image
                                    src={relativeToAbsoluteURL(slide.image)}
                                    objectFit={'cover'}
                                    layout={'fill'}
                                    alt={'slider image'}
                                />
                            </div>
                        </SwiperSlide>
                    ))}
            </Swiper>
            <Link passHref href={context?.url || '#'}>
                <div
                    className={
                        'absolute flex items-center px-5 sm:px-5 flex-row  bottom-0 bg-black bg-opacity-40 py-1 sm:py-1 z-10 left-0 right-0 text-white'
                    }
                >
                    <div
                        className={
                            'flex-1 hover:underline  cursor-pointer transition flex flex-col gap-1'
                        }
                    >
                        <p className={'text-lg sm:text-xl'}>
                            {context && context.title}
                        </p>
                        <p
                            className={
                                'text-xs sm:text-sm text-gray-200 text-opacity-70'
                            }
                        >
                            {context && context.description}
                        </p>
                    </div>
                    <div className={'hidden lg:flex gap-3 self-end py-5'}>
                        <div
                            className={
                                'bg-primary-500 prev px-3 active:bg-primary-700 rounded-lg py-1'
                            }
                        >
                            <RiArrowRightLine />
                        </div>
                        <div
                            className={
                                'bg-primary-500 next active:bg-primary-700 px-3 rounded-lg py-1'
                            }
                        >
                            <RiArrowLeftLine />
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default ImageSlider
