import React from 'react'
import { joinClasses, makeClasses } from '../../utils/style'

interface CheckboxProps {
    text?: string
    onClick?: (event: React.MouseEvent<HTMLElement>) => void

    containerClassName?: string
    selected?: boolean
    textAdornment?: React.ReactNode
}

const Checkbox: React.FC<CheckboxProps> = ({
    text,
    onClick,
    containerClassName = ' ',
    selected = false,
    textAdornment = null,
}): JSX.Element => {
    const classes = makeClasses({
        container: [
            'flex',
            'flex-row',
            'gap-4',
            'items-center',
            'py-1',
            'cursor-pointer',
        ],
        box: [
            'w-4',
            'h-4',
            selected ? 'bg-green-500' : 'bg-transparent',
            'border-2',
            'ring-2',
            'ring-gray-500',
            'rounded-sm',
            'border-white',
        ],
    })
    return (
        <div
            className={joinClasses([classes.container, containerClassName])}
            onClick={onClick}
        >
            <div className={classes.box} />
            {textAdornment}
            <div className={'select-none'}>{text}</div>
        </div>
    )
}

export default Checkbox
