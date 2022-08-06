import React from 'react'
import { makeClasses } from '../../utils/style'

export type tabItemTypes = {
    text: string
    id: string | number
}

interface TabProps {
    items: Array<tabItemTypes>
    onChange?: (item: tabItemTypes, index: number) => void
    activeId?: number | string | undefined | null
    activeIndex?: number | null | undefined
}

const Tab: React.FC<TabProps> = ({
    items,
    onChange,
    activeIndex,
    activeId,
}): JSX.Element => {
    // const [active, setActive] = useState(0)
    const classes = makeClasses({
        container: ['px-5', 'flex', 'gap-4', 'overflow-auto', 'hide-scrollbar'],
        item: [
            'py-2',
            'cursor-pointer',
            'px-4',
            'my-3',
            'rounded-xl',
            'select-none',
        ],
        activeItem: [
            'py-2',
            'px-4',
            'my-3',
            'bg-primary-50',
            'cursor-pointer',
            'rounded-xl',
            'text-primary-500',
            'select-none',
        ],
    })
    const handleSetActiveTab = (
        index: number,
        selectedItem: tabItemTypes
    ): void => {
        onChange && onChange(selectedItem, index)
    }
    return (
        <div className={classes.container}>
            {items &&
                items.map((item: tabItemTypes, index: number) => {
                    return (
                        <div
                            key={index}
                            onClick={() => handleSetActiveTab(index, item)}
                            className={` whitespace-nowrap ${
                                item.id === activeId || index === activeIndex
                                    ? classes.activeItem
                                    : classes.item
                            }`}
                        >
                            {item.text}
                        </div>
                    )
                })}
        </div>
    )
}

export default Tab
