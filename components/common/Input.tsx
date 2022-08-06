import React from 'react'
import { makeClasses } from '../../utils/style'

interface InputProps {
    value?: string | number
    name?: string
    adornment?: React.ReactNode
    placeholder?: string
    onChange?: (e: React.FormEvent<HTMLInputElement>) => void
    className?: string
    adornmentClassName?: string
    style?: React.CSSProperties
    disabled?: boolean
    containerClassName?: string
    type?: string | 'text' | 'password' | 'email'
}

const Input: React.FC<InputProps> = ({
    name,
    placeholder,
    onChange,
    value,
    disabled,
    className = ' ',
    adornmentClassName = ' ',
    adornment,
    style,
    containerClassName = '',
    type = 'text',
}): JSX.Element => {
    const classes = makeClasses({
        container: ['relative', containerClassName],
        adornment: ['absolute', adornmentClassName],
        input: [
            'appearance-none',
            'block',
            'w-full',
            'bg-gray-100',
            'text-gray-700',
            'rounded',
            'py-2',
            'px-4',
            // 'mb-3',
            'leading-tight',
            'focus:outline-none',
            'text-base',
            className,
            'disabled:opacity-50',
        ],
    })

    return (
        <div className={classes.container}>
            {adornment}
            <input
                disabled={disabled}
                style={style}
                value={value}
                className={classes.input}
                onChange={onChange}
                placeholder={placeholder}
                type={type}
                name={name}
            />
        </div>
    )
}

Input.defaultProps = {
    adornmentClassName: ' ',
    className: ' ',
    adornment: null,
}
export default Input
