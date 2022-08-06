import React from 'react'
import { CategoriesProps } from '../../../services/api/requests'
import { useSetFilter } from '../../../utils/hooks'
import { makeClasses } from '../../../utils/style'
import Checkbox from '../../common/Checkbox'

const Categories = ({ items }: { items: CategoriesProps }): JSX.Element => {
    const { setFilter, activeFilter } = useSetFilter('category_id')
    const classes = makeClasses({
        container: ['border', 'border-gray-200', 'rounded-xl', 'divide-y'],
        list: ['p-5', 'overflow-y-auto', 'max-h-80', 'scrollbar-thin'],
        header: ['divide-y', 'py-2', 'px-4'],
        treeLine: [
            'absolute',
            'top-0',
            'bottom-2',
            'border-gary-400',
            'border-dotted',
            'right-1',
            'border-l-4',
            'z-10',
        ],
    })

    const handleFilter = (id: number) => {
        setFilter(id)
    }
    return (
        <div className={classes.container}>
            <div className={classes.header}>دسته بندی</div>
            <div className={classes.list}>
                {/* <Checkbox text={'دندانپزشکی'} />
                <div className={'relative px-5'}>
                    <div className={classes.treeLine} />
                    <Checkbox text={'زیرمجموعه 2'} />
                 
                </div>
                */}

                {items &&
                    items.map((c, i) => {
                        if (!c.parent_id) {
                            return null
                        }
                        return (
                            <Checkbox
                                selected={
                                    activeFilter && !Array.isArray(activeFilter)
                                        ? c.id === parseInt(activeFilter)
                                        : false
                                }
                                onClick={() => handleFilter(c.id)}
                                key={i}
                                text={c.name}
                            />
                        )
                    })}
            </div>
        </div>
    )
}

export default Categories
