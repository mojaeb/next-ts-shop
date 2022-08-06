interface NumberFieldProps {
    number: number
    onIncrement?: () => void
    onDecrement?: () => void
}

const NumberField: React.FC<NumberFieldProps> = ({
    number = 0,
    onIncrement,
    onDecrement,
}) => {
    const handleIncrement = () =>
        onIncrement && onIncrement()
    const handleDecrement = () =>
        onDecrement && onDecrement()

    return (
        <div
            className={
                'flex rounded-xl overflow-hidden select-none'
            }
        >
            <div
                onClick={handleIncrement}
                className={
                    'px-4 py-1 text-base sm:text-lg text-gray-600 flex justify-center items-center bg-gray-200 hover:bg-gray-300 cursor-pointer'
                }
            >
                +
            </div>
            <div
                className={
                    'px-2 sm:px-4 py-1 text-gray-600 bg-gray-100'
                }
            >
                {number}
            </div>
            <div
                onClick={handleDecrement}
                className={
                    'px-4 py-1 text-base sm:text-lg text-gray-600 flex justify-center items-center bg-gray-200 hover:bg-gray-300 cursor-pointer'
                }
            >
                -
            </div>
        </div>
    )
}

export default NumberField
