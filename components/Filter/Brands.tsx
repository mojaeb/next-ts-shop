import React from 'react'
import { makeClasses } from '../../utils/style'
import Checkbox from '../common/Checkbox'
import Image from 'next/image'
import { useSetFilter } from '../../utils/hooks'
import { BrandProps } from '../../services/api/requests'
import { relativeToAbsoluteURL } from '../../utils/convertors'

const Brands = ({ items = [] }: { items: BrandProps[] }): JSX.Element => {
    const { setFilter, activeFilter } = useSetFilter('brand_id')
    const classes = makeClasses({
        container: [
            'border',
            'border-gray-200',
            'rounded-xl',
            'mt-5',
            'divide-y',
        ],
        list: ['p-5', 'overflow-y-auto', 'max-h-64', 'scrollbar-thin'],
        header: ['divide-y', 'py-2', 'px-4'],
    })
    return (
        <div className={classes.container}>
            <div className={classes.header}>برند ها</div>
            <div className={classes.list}>
                {items.map((b, i) => (
                    <Checkbox
                        key={i}
                        selected={
                            activeFilter && !Array.isArray(activeFilter)
                                ? b.id === parseInt(activeFilter)
                                : false
                        }
                        onClick={() => setFilter(b.id)}
                        text={b.name}
                        textAdornment={<BrandImage url={b.image} />}
                    />
                ))}
            </div>
        </div>
    )
}
const BrandImage = ({ url }: { url: string }): JSX.Element => {
    return (
        <div className={'relative w-12 h-10'}>
            <Image
                src={relativeToAbsoluteURL(url)}
                layout={'fill'}
                objectFit={'contain'}
                alt={'brand title'}
            />
        </div>
    )
}

export default Brands
