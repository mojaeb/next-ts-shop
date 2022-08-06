import React from 'react'
import Image from 'next/image'
import { makeClasses } from '../../utils/style'

const HeaderContainer = ({
    children,
}: {
    children: React.ReactNode
}): JSX.Element => {
    const classes = makeClasses({
        header: [
            'flex',
            'flex-col',
            'items-center',
            'mb-10',
        ],
        headerImage: [
            'h-20',
            'w-20',
            'relative',
            'border-4',
            'border-gray-100',
            'overflow-hidden',
            'rounded-full',
            'mb-1',
        ],
        headerText: ['w-3/4', 'text-center'],
    })
    return (
        <div className={classes.header}>
            <div className={classes.headerImage}>
                <Image
                    src={'/logo.png'}
                    objectFit={'contain'}
                    layout={'fill'}
                    alt={'logo'}
                />
            </div>
            <div className={classes.headerText}>
                {children}
            </div>
        </div>
    )
}

export default HeaderContainer
