import React from 'react'
import { GrMapLocation } from 'react-icons/gr'
import {
    // RiChat1Line,
    RiDashboard2Line,
    RiFileList3Line,
    RiHeartLine,
    // RiNotification3Line,
} from 'react-icons/ri'
import { makeClasses } from '../../utils/style'
import MenuItem from './MenuItem'
import ProfileOfMenu from './ProfileOfMenu'
import styles from '../../styles/menu.module.css'

export enum menuItems {
    dashboard,
    likes,
    orders,
    comments,
    addresses,
    notifications,
}

const list = [
    {
        id: menuItems.dashboard,
        label: 'داشبورد',
        icon: <RiDashboard2Line size={22} />,
        address: '/account',
        hiddenInSmallScreen: true,
    },
    {
        id: menuItems.likes,
        label: 'علاقه مندی ها',
        icon: <RiHeartLine size={22} />,
        address: '/account/likes',
    },
    {
        id: menuItems.orders,
        label: 'سفارش ها',
        icon: <RiFileList3Line size={22} />,
        address: '/account/orders',
    },
    // {
    //     id: menuItems.comments,
    //     label: 'نظرات',
    //     icon: <RiChat1Line size={22} />,
    //     address: '/account/comments',
    // },
    {
        id: menuItems.addresses,
        label: 'نشانی ها',
        icon: <GrMapLocation size={22} />,
        address: '/account/addresses',
    },
    // {
    //     id: menuItems.notifications,
    //     label: 'اعلانات',
    //     icon: <RiNotification3Line size={22} />,
    //     address: '/account/notifications',
    // },
]

type MenuTypes = {
    activeItem: menuItems
    hiddenInMobile?: boolean
}

const Menu = ({
    activeItem,
    hiddenInMobile = false,
}: MenuTypes): JSX.Element => {
    const classes = makeClasses({
        container: [
            'bg-white',
            'col-span-10 sm:col-span-2',
            hiddenInMobile ? 'hidden sm:flex' : 'flex',
            'flex-col',
            'sm:sticky',
            'sm:top-20',
            styles.container,
        ],
        itemsContainer: ['flex-1', 'relative'],
        itemsSheet: [
            'sm:absolute',
            'sm:inset-0',
            'overflow-y-auto',
            'scrollbar-thin',
        ],
    })

    return (
        <div className={classes.container}>
            <div className={classes.itemsContainer}>
                <div className={classes.itemsSheet}>
                    {list.map((l, i) => (
                        <MenuItem
                            key={i}
                            hiddenInSmallScreen={!!l.hiddenInSmallScreen}
                            title={l.label}
                            active={l.id === activeItem}
                            icon={l.icon}
                            address={l.address}
                        />
                    ))}
                </div>
            </div>
            <ProfileOfMenu />
        </div>
    )
}

export default Menu
