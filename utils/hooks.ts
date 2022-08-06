import { useRouter } from 'next/router'

type userFilterTypes = {
    setFilter: (parameter: number | string | boolean) => void
    removeFilter: (filterKey: string) => void
    activeFilter: string | string[] | undefined
    setToggle: () => void
}

export const useSetFilter = (key: string): userFilterTypes => {
    const router = useRouter()

    const removeFilter = (filterKey: string) => {
        delete router.query[filterKey]
        router.push({
            pathname: '/filter',
            query: router.query,
        })
    }

    const setFilter = (parameter: number | string | boolean) => {
        if (router.query[key] !== String(parameter)) {
            router.push({
                pathname: '/filter',
                query: { ...router.query, [key]: parameter },
            })
        } else {
            removeFilter(key)
        }
    }
    const setToggle = () => {
        if (!router.query[key]) {
            router.push({
                pathname: '/filter',
                query: { ...router.query, [key]: true },
            })
        } else {
            removeFilter(key)
        }
    }
    const activeFilter: string | string[] | undefined = router?.query[key]
    return { setFilter, activeFilter, removeFilter, setToggle }
}
