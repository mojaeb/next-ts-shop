import React from 'react'
import { makeClasses } from '../../utils/style'
import CircularProgress from './CircularProgress'

interface ButtonProps {
    title: string
    icon?: React.ReactNode
    color?: 'primary' | 'blue' | 'red' | 'white' | 'green'
    variant?: BtnVariant | 'outlined' | 'contained' | 'soft'
    onClick?: (
        e: React.MouseEvent<HTMLDivElement>
    ) => void | null | Promise<void>
    titleClassName?: string
    iconClassName?: string
    className?: string
    disabled?: boolean
    loading?: boolean
}

enum BtnVariant {
    outlined = 'outlined',
    contained = 'contained',
    soft = 'soft',
}

const Button: React.FC<ButtonProps> = ({
    title,
    icon,
    color,
    onClick,
    titleClassName = '',
    iconClassName = '',
    variant = BtnVariant.contained,
    className = '',
    disabled = false,
    loading = false,
}) => {
    const classes = makeClasses({
        button: [
            'flex',
            'items-center',
            'transition',
            'hover:shadow-md',
            'cursor-pointer',
            'overflow-hidden',
            'gap-2',
            'select-none',
            disabled ? 'opacity-40' : '',
            !icon ? 'justify-center' : '',
            variant === BtnVariant.outlined ? 'border border-gray-400' : '',
            variant === BtnVariant.outlined && !disabled
                ? `active:bg-gray-100`
                : '',
            variant === BtnVariant.soft ? `bg-${color}-100` : '',
            variant === BtnVariant.soft && !disabled
                ? `active:bg-${color}-300`
                : '',
            variant === BtnVariant.soft ? `text-${color}-500` : '',
            variant === BtnVariant.contained ? `bg-${color}-500` : '',
            variant === BtnVariant.contained && !disabled
                ? `active:bg-${color}-600`
                : '',
            variant === BtnVariant.contained ? 'text-white' : '',
            'rounded-lg',
            className,
        ],

        iconSection: [
            'py-2.5 sm:py-3',
            'pl-0 sm:pl-1',
            'pr-2 sm:pr-3',
            iconClassName,
        ],
        title: [
            icon ? 'pl-2 sm:pl-3' : 'px-4 py-2',
            'select-none',
            'flex',
            'gap-2',
            'items-center',
            'whitespace-nowrap',
            titleClassName,
        ],
    })

    return (
        <div
            className={classes.button}
            onClick={!disabled || loading ? onClick : () => null}
        >
            {icon && <span className={classes.iconSection}>{icon}</span>}
            <span className={classes.title}>
                <span>{title}</span>
                {loading && <CircularProgress size={'4'} color={'#fff'} />}
            </span>
        </div>
    )
}

Button.defaultProps = {
    title: '',
    color: 'primary',
}

export default Button
