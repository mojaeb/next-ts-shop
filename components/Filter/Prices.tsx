import React from 'react'
import { useSetFilter } from '../../utils/hooks'
import { makeClasses } from '../../utils/style'
import Checkbox from '../common/Checkbox'

const pricesList = [
    { title: 'از 0 تومان تا 500 هزار تومان', props: [0, 5000000] },
    {
        title: 'از 500 هزار تومان تا 1 میلیون تومان',
        props: [5000000, 10000000],
    },
    {
        title: 'از 1 میلیون تومان تا 5 میلیون تومان',
        props: [10000000, 50000000],
    },
    {
        title: 'از 5 میلیون تومان تا 10 میلیون تومان',
        props: [50000000, 100000000],
    },
    {
        title: 'از 10 میلیون تومان تا 20 میلیون تومان',
        props: [100000000, 200000000],
    },
]

const Prices = (): JSX.Element => {
    const { setFilter } = useSetFilter('price')
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
            <div className={classes.header}>قیمت ها</div>
            <div className={classes.list}>
                {pricesList.map((p, i) => (
                    <Checkbox
                        key={i}
                        onClick={() => setFilter(JSON.stringify(p.props))}
                        text={p.title}
                    />
                ))}
            </div>
        </div>
    )
}

export default Prices
