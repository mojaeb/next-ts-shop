import moment from 'moment'

const formatPatterns = {
    dateTime: 'YYYY/MM/DD HH:mm:ss',
    dateTimeWithPrefix: 'تاریخ YYYY/MM/DD ساعت HH:mm:ss',
    date: 'YYYY/MM/DD',
}

export const format = (date: Date): string => {
    return moment(date).format(
        formatPatterns.dateTimeWithPrefix
    )
}
