import React from 'react'
import Button from '../common/Button'
import Chip from '../common/Chip'
import Checkbox from '../common/Checkbox'

interface AddressFieldProps {
    selected?: boolean
    onEdit: () => void
    onChangeCheckbox?: () => void
    hasCheckbox?: boolean
    receiverName: string
    address: string
    phoneNumber: string
    state: string
    city: string
    ignoreMeta?: boolean
}

const AddressField: React.FC<AddressFieldProps> = ({
    selected,
    onEdit,
    hasCheckbox,
    receiverName = '',
    address = '',
    phoneNumber = '',
    state = '',
    city = '',
    ignoreMeta = false,
    onChangeCheckbox,
}): JSX.Element => {
    const handleClickCheckbox = (e: React.MouseEvent<HTMLElement>): void => {
        e.preventDefault()
        e.stopPropagation()
        onChangeCheckbox && onChangeCheckbox()
    }

    return (
        <div
            onClick={onEdit}
            className={
                'px-1 sm:px-8 py-3 cursor-pointer hover:bg-gray-100 flex flex-row items-center gap-2 sm:gap-5'
            }
        >
            {hasCheckbox && (
                <Checkbox onClick={handleClickCheckbox} selected={selected} />
            )}
            <div>
                <p className={'text-sm sm:text-base'}>{address}</p>
                {!ignoreMeta ? (
                    <div className={'hidden sm:flex gap-3 mt-3'}>
                        <Chip>نام گیرنده : {receiverName}</Chip>
                        <Chip color={'green'}>شماره : {phoneNumber}</Chip>
                        <Chip color={'red'}>استان : {state}</Chip>
                        <Chip color={'red'}>شهر : {city}</Chip>
                    </div>
                ) : null}
            </div>
            <div className={'flex-1 gap-12 flex items-center justify-end'}>
                <Button variant={'soft'} title={'ویرایش'} />
            </div>
        </div>
    )
}
export default AddressField
