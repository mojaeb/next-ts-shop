export const isAuthenticated = (): boolean => {
    if (typeof window !== 'undefined') {
        const access = localStorage.getItem('access_token')
        const refresh = localStorage.getItem('refresh_token')
        if (access && refresh) return true
        else return false
    } else return false
}

export const protectedHref = (link: string): string => {
    if (isAuthenticated()) return link
    else return '/login'
}
