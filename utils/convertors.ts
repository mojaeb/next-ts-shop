import { baseURL } from '../services/urls'

const relativeToAbsoluteURL = (url: string): string => {
    return `${baseURL}${url}`
}

const addIranPrefixToNumber = (number: number | string): string => '98' + number
const removeIranPrefixToNumber = (number: number | string): string => {
    const string_number = number.toString() || ''
    return string_number.slice(2, string_number.length)
}

export {
    relativeToAbsoluteURL,
    addIranPrefixToNumber,
    removeIranPrefixToNumber,
}
