import Image from 'next/image'
import React from 'react'
import { makeClasses } from '../../utils/style'

type userManagerPropTypes = { children: React.ReactNode }

const UserManagerContainer = ({
    children,
}: userManagerPropTypes): JSX.Element => {
    const classes = makeClasses({
        backdrop: [
            'absolute',
            'top-0',
            'w-full',
            'h-full',
            'py-5 sm:py-20',
            'px-5 sm:px-40',
            'flex',
            'items-center',
        ],
        sheet: [
            'bg-white',
            'w-full sm:w-96',
            'rounded-2xl sm:rounded-lg',
            'px-5',
            'py-6',
            'flex',
            'flex-col',
            'gap-4',
        ],
        header: ['flex', 'flex-col', 'items-center', 'mb-10'],
        headerImage: ['h-20', 'w-20', 'relative'],
        headerText: ['w-3/4', 'text-center'],
    })
    return (
        <div
            title={'login page'}
            className={'relative w-full h-screen bg-gray-100'}
        >
            <Image
                src="/doctor-wide-image.jpg"
                alt="Picture of the author"
                layout={'fill'}
                objectFit={'cover'}
            />
            <div className={classes.backdrop}>
                <div className={classes.sheet}>{children}</div>
            </div>
        </div>
    )
}

export default UserManagerContainer
