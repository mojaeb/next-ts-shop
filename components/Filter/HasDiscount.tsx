import React from 'react'
import { useSetFilter } from '../../utils/hooks'
import { makeClasses } from '../../utils/style'
import Switch from '../common/Switch'

const HasDiscount = (): JSX.Element => {
    const { setToggle, activeFilter } = useSetFilter('has_discount')

    const classes = makeClasses({
        container: [
            'border',
            'border-gray-200',
            'rounded-xl',
            'mt-5',
            'divide-y',
            'p-5',
        ],
    })

    return (
        <div className={classes.container}>
            <div className={'flex items-center gap-3'}>
                <Switch onClick={setToggle} active={Boolean(activeFilter)} />
                <div>دارای تخفیف</div>
            </div>
        </div>
    )
}

export default HasDiscount
