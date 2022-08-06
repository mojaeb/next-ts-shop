import Image from 'next/image'
import Link from 'next/link'
import React, { useContext } from 'react'
import { relativeToAbsoluteURL } from '../../utils/convertors'
import Button from '../common/Button'
import { StoreContext } from '../StoreState'

const ProfileOfMenu = (): JSX.Element => {
    const { profile } = useContext(StoreContext)

    const handleLogout = async () => {
        localStorage.clear()
        localStorage.removeItem('profile')
        location.href = '/login'
    }
    return (
        <div
            className={
                'flex flex-col items-center p-5 border-t border-gray-200'
            }
        >
            <div className={'h-20 w-20 relative'}>
                <div
                    className={
                        'relative h-full border border-gray-200 w-full rounded-full overflow-hidden'
                    }
                >
                    <Image
                        layout={'fill'}
                        objectFit={'contain'}
                        src={
                            profile?.profile_image
                                ? relativeToAbsoluteURL(profile.profile_image)
                                : '/profile.jpg'
                        }
                        alt={'profile image'}
                    />
                </div>
                <div
                    className={
                        'w-4 h-4 bg-green-400 border-2 border-white absolute bottom-0 right-2 shadow-lg rounded-full'
                    }
                />
            </div>
            <p className={'mt-2'}>
                {profile?.first_name} {profile?.last_name}
            </p>
            <p className={'text-sm text-gray-400'}>آنلاین</p>
            <div className={'grid grid-cols-2 gap-3 mt-4'}>
                <Button
                    onClick={handleLogout}
                    title={'خروج'}
                    variant={'outlined'}
                />
                <Link href={'/account/profile'} passHref>
                    <Button variant={'outlined'} title={'ویرایش'} />
                </Link>
            </div>
        </div>
    )
}

export default ProfileOfMenu
