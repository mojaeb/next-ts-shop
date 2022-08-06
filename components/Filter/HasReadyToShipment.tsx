import React from 'react'
import { useSetFilter } from '../../utils/hooks'
import { makeClasses } from '../../utils/style'
import Switch from '../common/Switch'

const HasReadyToShipment = (): JSX.Element => {
    const { setToggle, activeFilter } = useSetFilter('available_in_warehouse')
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
                <Switch active={Boolean(activeFilter)} onClick={setToggle} />
                <div>موجود در انبار</div>
            </div>
        </div>
    )
}

export default HasReadyToShipment
