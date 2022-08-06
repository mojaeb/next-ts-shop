import axios, { HeadersDefaults, AxiosDefaults, AxiosInstance } from 'axios'

import { baseURL } from './urls'

interface DefaultProps extends AxiosDefaults {
    headers: HeadersDefaults & {
        Authorization?: string
    }
}

interface AxiosProps extends AxiosInstance {
    defaults: DefaultProps
}

const getLocalStorage = (key: string): string | null => {
    if (typeof window !== 'undefined') {
        return window.localStorage.getItem(key)
    } else {
        return ''
    }
}

const axiosInstance: AxiosProps = axios.create({
    baseURL: baseURL,
    timeout: 10000,
    headers: {
        Authorization: getLocalStorage('access_token')
            ? 'Bearer ' + getLocalStorage('access_token')
            : '',
        'Content-Type': 'application/json',
        accept: 'application/json',
    },
})

const loginAddress = '/login'

axiosInstance.interceptors.response.use(
    (response) => {
        return response
    },
    async function (error) {
        const originalRequest = error.config
        if (
            (!getLocalStorage('access_token') ||
                !getLocalStorage('access_token')) &&
            location.pathname !== loginAddress
        ) {
            if (location.pathname !== loginAddress) {
                window.location.href = loginAddress
            }
        }
        if (typeof error.response === 'undefined') {
            console.log(
                'A server/network error occurred. ' +
                    'Looks like CORS might be the problem. ' +
                    'Sorry about this - we will get it fixed shortly.'
            )
            return Promise.reject(error)
        }

        if (
            error.response.status === 401 &&
            originalRequest.url === baseURL + '/api/token/refresh/'
        ) {
            if (location.pathname !== loginAddress) {
                window.location.href = loginAddress
                window.localStorage.removeItem('access_token')
                window.localStorage.removeItem('refresh_token')
            }
            return Promise.reject(error)
        }

        if (
            error.response.data.code === 'token_not_valid' &&
            error.response.status === 401 &&
            error.response.statusText === 'Unauthorized'
        ) {
            const refreshToken = getLocalStorage('refresh_token')

            if (refreshToken) {
                const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]))

                // exp date in token is expressed in seconds, while now() returns milliseconds:
                const now = Math.ceil(Date.now() / 1000)

                if (tokenParts.exp > now) {
                    return axiosInstance
                        .post('/api/token/refresh/', {
                            refresh: refreshToken,
                        })
                        .then((response) => {
                            localStorage.setItem(
                                'access_token',
                                response.data.access
                            )
                            localStorage.setItem(
                                'refresh_token',
                                response.data.refresh
                            )

                            axiosInstance.defaults.headers['Authorization'] =
                                'Bearer ' + response.data.access
                            originalRequest.headers['Authorization'] =
                                'Bearer ' + response.data.access

                            return axiosInstance(originalRequest)
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                } else {
                    console.log('Refresh token is expired', tokenParts.exp, now)
                    if (location.pathname !== loginAddress) {
                        window.location.href = loginAddress
                        window.localStorage.removeItem('access_token')
                        window.localStorage.removeItem('refresh_token')
                    }
                }
            } else {
                console.log('Refresh token not available.')
                if (location.pathname !== loginAddress) {
                    window.location.href = loginAddress
                    window.localStorage.removeItem('access_token')
                    window.localStorage.removeItem('refresh_token')
                }
            }
        }

        // specific error handling done elsewhere
        return Promise.reject(error)
    }
)

export default axiosInstance
