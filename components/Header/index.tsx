import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useContext, useState } from 'react'
import { AiOutlineArrowRight, AiOutlineTeam } from 'react-icons/ai'
import { MdPhone } from 'react-icons/md'
import {
    RiFileList2Line,
    RiFilter2Line,
    RiHeart3Line,
    RiMenu3Fill,
    RiSearchLine,
    RiShoppingCartLine,
    RiUserLine,
} from 'react-icons/ri'
import { CategoryProps } from '../../services/api/requests'
import styles from '../../styles/header.module.css'
import { protectedHref } from '../../utils/authentication'
import { relativeToAbsoluteURL } from '../../utils/convertors'
import { useSetFilter } from '../../utils/hooks'
import Button from '../common/Button'
import DoctorIcon from '../icons/DoctorIcon'
import ToothIcon from '../icons/ToothIcon'
import { StoreContext } from '../StoreState'

const headerItems = [
    {
        text: 'محصولات',
        url: '/filter',
        icon: <RiFileList2Line />,
        children: [],
    },
    {
        text: 'درباره ما',
        url: '/about-us',
        children: [],
        icon: <AiOutlineTeam />,
    },
]

const chooseIcon = (slug: string) => {
    switch (slug) {
        case 'dental':
            return <ToothIcon size={18} />
        case 'medical':
            return <DoctorIcon />
        default:
            return null
    }
}

const generateRootCategories = (categories: CategoryProps[]) => {
    return categories
        .filter((c) => !c.parent_id)
        .map((c) => ({
            text: c.name,
            url: '',
            icon: chooseIcon(c.slug),
            children: categories.filter((ch) => ch.parent_id === c.id),
        }))
}

const Header = ({
    categories = [],
}: {
    categories: CategoryProps[]
}): JSX.Element => {
    const { cartCount } = useContext(StoreContext)
    const router = useRouter()
    const [showMenu, setShowMenu] = useState(false)
    const rootCategories = generateRootCategories(categories)
    const navItems = [...rootCategories, ...headerItems]

    const handleRoute = (url = '') => {
        if (url.length) {
            router.push(url)
            handleHideMenu()
        }
    }

    const handleToggleShowMenu = () => {
        setShowMenu(!showMenu)
    }
    const handleHideMenu = () => {
        setShowMenu(false)
    }
    return (
        <header
            className={'sticky flex flex-col top-0 shadow-sm'}
            style={{ zIndex: 100000 }}
        >
            <div
                className={
                    'bg-white py-1 sm:py-4 flex sm:grid grid-cols-12 h-16 sm:h-20 border-b-2 border-gray-100'
                }
                style={{ borderWidth: 1 }}
            >
                <div
                    className={
                        'flex-1 sm:col-span-6 xl:col-span-3 h-full flex items-center'
                    }
                >
                    <div
                        onClick={handleToggleShowMenu}
                        className={'sm:hidden block pr-3 pl-1 text-gray-600'}
                    >
                        <RiMenu3Fill size={28} />
                    </div>
                    <Link href={'/'} passHref>
                        <div
                            className={
                                'px-3 sm:px-10 flex items-center h-full cursor-pointer'
                            }
                        >
                            <div className={'h-full w-10 sm:w-24 relative'}>
                                <Image
                                    src={'/logo.png'}
                                    layout={'fill'}
                                    objectFit={'contain'}
                                    alt={'logo'}
                                />
                            </div>
                            <div className={'flex flex-col pr-2'}>
                                <p
                                    className={
                                        'text-md sm:text-lg font-bold py-1'
                                    }
                                >
                                    فروشگاه دنتب
                                </p>
                                <p
                                    className={'hidden sm:block text-gray-400'}
                                    style={{ fontSize: 9 }}
                                >
                                    denteb medical shop
                                </p>
                            </div>
                        </div>
                    </Link>
                </div>
                <SearchBox />
                <div
                    className={
                        'flex flex-row-reverse col-span-6 xl:col-span-3 items-center divide-x divide-rose-400'
                    }
                >
                    <div
                        className={
                            'hidden sm:flex flex-row-reverse items-center px-5 pl-10 gap-2'
                        }
                    >
                        <Link href={protectedHref('/cart')} passHref>
                            <div
                                className={
                                    'p-2 text-black relative rounded hover:bg-gray-100'
                                }
                            >
                                <RiShoppingCartLine size={24} />
                                <div
                                    className={
                                        'absolute top-1/2 cursor-pointer right-0 bg-red-500 text-white px-1 text-xs rounded border-2 border-white'
                                    }
                                >
                                    {cartCount}
                                </div>
                            </div>
                        </Link>
                        <Link href={protectedHref('/account/likes')} passHref>
                            <div
                                className={
                                    'p-2 text-black cursor-pointer rounded hover:bg-gray-100'
                                }
                            >
                                <RiHeart3Line size={24} />
                            </div>
                        </Link>
                    </div>
                    <div
                        className={
                            'pl-3 sm:px-5 w-full h-full flex items-center justify-end'
                        }
                    >
                        <ProfileOrLoginButton />
                    </div>
                    <div className={'hidden md:flex xl:hidden'}>
                        <FilterButton />
                    </div>
                </div>
            </div>
            {showMenu && (
                <div
                    className={'fixed top-0 bottom-0 w-full  flex'}
                    style={{ zIndex: 200000 }}
                >
                    <div
                        className={
                            'h-full w-8/12 relative bg-white flex flex-col px-2 py-5'
                        }
                    >
                        {navItems.map((item, index) => (
                            <div
                                key={index}
                                className={
                                    'py-1 px-4 rounded-md cursor-pointer'
                                }
                                onClick={() => handleRoute(item.url)}
                            >
                                {item.text}
                                {item.children.length ? (
                                    <div
                                        className={
                                            'border-r-2 border-dashed pr-3 border-green-400'
                                        }
                                    >
                                        {item.children.map((ch, i) => (
                                            <div
                                                className={'py-1'}
                                                onClick={() =>
                                                    handleRoute(
                                                        '/filter?category_id=' +
                                                            ch.id
                                                    )
                                                }
                                                key={i}
                                            >
                                                {ch.name}
                                            </div>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        ))}
                        <div
                            onClick={handleHideMenu}
                            className={
                                'absolute top-5 left-5 px-3 py-2 rounded-md bg-primary-200 text-primary-500'
                            }
                        >
                            <AiOutlineArrowRight />
                        </div>
                    </div>
                    <div
                        className={'flex-1 h-full bg-black bg-opacity-50'}
                        onClick={handleHideMenu}
                    />
                </div>
            )}
            <div
                className={
                    'bg-white px-10 sm:flex items-center hidden justify-between'
                }
            >
                <div className={'flex flex-row'}>
                    {navItems.map((item, index) => {
                        return (
                            <p
                                onClick={() => handleRoute(item.url)}
                                key={index}
                                className={`hover:bg-primary-100 py-2 flex flex-row gap-2 items-center  border-primary-500 text-gray-500 hover:text-primary-500 cursor-pointer transition rounded-sm px-5 text-md ${styles.navItem}`}
                            >
                                {/* <i>{item?.icon}</i> */}
                                {item.text}
                                {item.children.length ? (
                                    <div
                                        className={`${styles.navItemChildren} hidden top-full right-0 w-96 pt-2`}
                                    >
                                        <div
                                            className={` flex-col border-4 border-white divide-y bg-white  w-full shadow-xl  rounded-md overflow-hidden `}
                                        >
                                            {item.children.map((ch, index) => (
                                                <div
                                                    key={index}
                                                    onClick={() =>
                                                        handleRoute(
                                                            `/filter?category_id=${ch.id}`
                                                        )
                                                    }
                                                    className={
                                                        ' px-3 hover:bg-primary-100 hover:text-primary-500 py-2 text-gray-500 text-sm'
                                                    }
                                                >
                                                    {ch.name}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : null}
                            </p>
                        )
                    })}
                </div>
                <a
                    href={'tel:09128465479'}
                    className={'flex gap-2 items-center pl-5'}
                >
                    <i
                        className={
                            'p-1.5 text-green-500 rounded-full bg-green-200'
                        }
                    >
                        <MdPhone />
                    </i>
                    <span className={'text-gray-500 text-sm md:inline hidden'}>
                        شماره تماس
                    </span>
                    <span className={'text-sm text-gray-500'}>09128465479</span>
                </a>
            </div>
        </header>
    )
}

const ProfileOrLoginButton = (): JSX.Element => {
    const { profile } = useContext(StoreContext)

    return (
        <div className={'flex-1'}>
            {!profile ? (
                <div className={'flex items-center h-full justify-end'}>
                    <Link href={'/login/'} passHref>
                        <Button
                            className={'text-xs sm:text-base'}
                            title={'ورود/عضویت'}
                            icon={<RiUserLine />}
                        />
                    </Link>
                </div>
            ) : (
                <Link passHref href={'/account'}>
                    <div
                        className={
                            'bg-gray-100 gap-3 relative h-full cursor-pointer hover:bg-gray-200 rounded-lg flex items-center w-full py-1.5 px-1.5'
                        }
                    >
                        <div
                            className={
                                'flex-1 bg-green-400 h-full sm:block hidden'
                            }
                        >
                            <div
                                className={
                                    'absolute top-0 bottom-0 flex flex-col justify-center right-0 left-10'
                                }
                            >
                                <p
                                    className={
                                        'text-sm mx-2 overflow-hidden  overflow-ellipsis whitespace-nowrap'
                                    }
                                >
                                    {profile?.first_name} {profile?.last_name}
                                </p>
                                <p
                                    className={
                                        'text-xs text-gray-500 mx-2 overflow-hidden overflow-ellipsis whitespace-nowrap'
                                    }
                                >
                                    {profile?.email}
                                </p>
                            </div>
                        </div>
                        <div
                            className={
                                'h-10 w-10 overflow-hidden relative rounded-lg bg-gray-300'
                            }
                        >
                            <Image
                                layout={'fill'}
                                objectFit={'cover'}
                                src={
                                    profile.profile_image
                                        ? relativeToAbsoluteURL(
                                              profile.profile_image
                                          )
                                        : '/profile.jpg'
                                }
                                alt={'profile image'}
                            />
                        </div>
                    </div>
                </Link>
            )}
        </div>
    )
}

const FilterButton = (): JSX.Element => {
    return (
        <Link href={'/filter'} passHref>
            <div
                className={
                    'hover:bg-gray-300 bg-gray-200 cursor-pointer transition flex items-center gap-2 rounded-md px-3 py-1.5 mx-2 text-gray-600'
                }
            >
                <span>فیلتر</span>
                <RiFilter2Line className={'text-gray-500'} size={20} />
            </div>
        </Link>
    )
}

const SearchBox = (): JSX.Element => {
    const [searchText, setSearchText] = useState('')
    const { setFilter, activeFilter } = useSetFilter('title')
    const handleChangeSearch = (e: React.FormEvent<HTMLInputElement>) => {
        setSearchText(e.currentTarget.value)
    }
    const handleFilter = () => {
        if (activeFilter !== searchText && searchText != '') {
            setFilter(searchText)
        }
    }
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleFilter()
        }
    }

    return (
        <div
            className={
                'w-full h-full relative hidden bg-gray-100 rounded-lg text-gray-400 col-span-5 xl:col-span-6 xl:flex justify-between items-center'
            }
        >
            <div className={'flex flex-1'}>
                <span
                    onClick={handleFilter}
                    className={
                        'px-3 ml-3 hover:text-primary-500 cursor-pointer text-gray-500 border-l-2 border-gray-200'
                    }
                >
                    <RiSearchLine size={23} />
                </span>

                <input
                    value={searchText}
                    onChange={handleChangeSearch}
                    onKeyDown={handleKeyDown}
                    type={'text'}
                    className={
                        'text-md bg-transparent flex-1 text-gray-800 focus:outline-none'
                    }
                    placeholder={'جستجو'}
                />
            </div>
            <FilterButton />
        </div>
    )
}

export default Header
