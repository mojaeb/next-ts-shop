import React from 'react'
import { CountryProps } from '../../services/api/requests'
import { useSetFilter } from '../../utils/hooks'
import { makeClasses } from '../../utils/style'
import Checkbox from '../common/Checkbox'

const Country = ({ items = [] }: { items: CountryProps[] }): JSX.Element => {
    const { setFilter, activeFilter } = useSetFilter('country_id')
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
            <div className={classes.header}>کشور سازنده</div>
            <div className={classes.list}>
                {items.map((c, i) => (
                    <Checkbox
                        key={i}
                        selected={
                            activeFilter && !Array.isArray(activeFilter)
                                ? c.id === parseInt(activeFilter)
                                : false
                        }
                        onClick={() => setFilter(c.id)}
                        text={c.name}
                    />
                ))}
            </div>
        </div>
    )
}

export default Country
