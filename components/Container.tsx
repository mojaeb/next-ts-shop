import React from 'react'

interface ContainerProps {
    children: React.ReactNode
    className?: React.ReactNode
    hasDefaultStyle?: boolean
}

const Container: React.FC<ContainerProps> = ({
    children,
    className,
    hasDefaultStyle = true,
}) => {
    return (
        <div
            className={`${
                hasDefaultStyle ? 'px-3 sm:px-6 md:px-12' : ''
            } ${className}`}
        >
            {children}
        </div>
    )
}
Container.defaultProps = {
    className: '',
}

export default Container
