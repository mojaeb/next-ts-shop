import React from 'react'
import CircularProgress from './CircularProgress'

const OverlayLoading = (): JSX.Element => {
    return (
        <div
            className={
                'py-20 absolute inset-0 z-20 bg-white bg-opacity-10 justify-center flex'
            }
        >
            <CircularProgress />
        </div>
    )
}

export default OverlayLoading
