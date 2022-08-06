type listType = Array<string>

const joinClasses = (list: listType = []): string => {
    return list.join(' ')
}


const makeClasses = <K extends string>(
    objects: Record<K, listType>
): Record<K, string> => {
    return Object.keys(objects).reduce(
        (acc: Record<K, string>, curr: string) => {
            acc = {
                ...acc,
                [curr]: joinClasses(objects[curr as K]),
            }
            return acc
        },
        {} as Record<K, string>
    )
}

export { joinClasses, makeClasses }
