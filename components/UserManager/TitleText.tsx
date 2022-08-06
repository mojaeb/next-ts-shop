import React from 'react'

const TitleText = ({
    children,
}: {
    children: React.ReactNode
}): JSX.Element => {
    return <p className={'text-2xl mb-2'}>{children}</p>
}

export default TitleText
