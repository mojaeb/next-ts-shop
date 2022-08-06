import React from 'react'
import { PaginationProps } from '../../services/api/requests'
import { makeClasses } from '../../utils/style'

type PaginationPropTypes = {
    pagination?: PaginationProps | null
    onChangePage: (page: number) => void
}

const Pagination: React.FC<PaginationPropTypes> = ({
    onChangePage,
    pagination = { count: 0, per_page: 0, page: 0 },
}): JSX.Element => {
    const pages =
        pagination && Math.ceil(pagination.count / pagination.per_page)

    const handleChangPage = (page: number) => {
        document.body.scrollTop = 0
        document.documentElement.scrollTop = 0
        onChangePage(page)
    }
    const classes = makeClasses({
        container: [
            'flex',
            'gap-7 sm:gap-3',
            'justify-center',
            'my-5 sm:mt-20',
            'sm:mb-10',
        ],
        button: [
            'cursor-pointer',
            'bg-primary-500',
            'hover:bg-primary-600',
            'rounded-md',
            'text-white',
            'px-7 sm:px-4',
            'py-1',
        ],
        numberButton: [
            'bg-gray-100',
            'hover:bg-gray-300',
            'cursor-pointer',
            'rounded-md',
            'text-gray-500',
            'px-4',
            'py-1',
            'hidden sm:block',
        ],
        dots: ['text-gray-500', 'px-4', 'py-1', 'hidden sm:block'],
    })

    const disable_next =
        (pagination && pagination?.page === pages) || pages === pagination?.page
    const disable_prev = pagination && pagination?.page <= 1
    return (
        <div className={classes.container}>
            <div
                onClick={
                    !disable_prev
                        ? () =>
                              handleChangPage(
                                  pagination ? pagination.page - 1 : 1
                              )
                        : () => null
                }
                className={`${classes.button} ${
                    disable_prev ? 'opacity-40' : ''
                }`}
            >
                قبلی
            </div>
            <div className={classes.numberButton}>{pagination?.page}</div>
            <div className={classes.numberButton}>{pages || 0} صفحه</div>
            <div
                onClick={
                    !disable_next
                        ? () =>
                              handleChangPage(
                                  pagination ? pagination.page + 1 : 1
                              )
                        : () => null
                }
                className={`${classes.button} ${
                    disable_next ? 'opacity-40' : ''
                }`}
            >
                بعدی
            </div>
        </div>
    )
}

export default Pagination
