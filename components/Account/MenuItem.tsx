import React from 'react'
import { makeClasses } from '../../utils/style'
import Link from 'next/link'

interface MenuItemProps {
    icon: React.ReactNode
    title: string
    active?: boolean
    address: string
    hiddenInSmallScreen: boolean
}

const MenuItem: React.FC<MenuItemProps> = ({
    icon,
    title,
    active = false,
    address = '',
    hiddenInSmallScreen = false,
}): JSX.Element => {
    const classes = makeClasses({
        container: [
            'px-5',
            'py-3',
            'my-4',
            'mx-3',
            hiddenInSmallScreen ? 'hidden sm:flex' : 'flex',
            'hover:shadow-sm',
            'gap-3',
            'rounded-xl',
            'transition',
            'cursor-pointer',
            active ? 'bg-primary-100' : '',
            'hover:bg-primary-100',
            'bg-gray-50',
        ],
    })
    return (
        <Link href={address}>
            <a className={classes.container}>
                {icon}
                <span>{title}</span>
            </a>
        </Link>
    )
}

export default MenuItem
