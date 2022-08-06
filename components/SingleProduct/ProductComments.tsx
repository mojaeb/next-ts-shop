import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import {
    addComment,
    CommentItemProps,
    getCommentsByProductId,
} from '../../services/api/requests'
import { isAuthenticated } from '../../utils/authentication'
import Button from '../common/Button'
import OverlayLoading from '../common/OverlayLoading'

interface ProductCommentsProps {
    productId: number
}

const ProductComments: React.FC<ProductCommentsProps> = ({
    productId,
}): JSX.Element => {
    const [isLoading, setLoading] = useState<boolean>(true)
    const [comments, setComments] = useState<CommentItemProps[]>([])
    const [text, setText] = useState('')
    const router = useRouter()

    const getComments = async (pid: number) => {
        const response: CommentItemProps[] = await getCommentsByProductId(pid)
        setLoading(false)
        setComments(response)
    }

    const handleAddComment = async () => {
        if (isAuthenticated()) {
            setLoading(true)
            if (text.length > 0) {
                try {
                    await addComment(text, productId)
                    getComments(productId)
                    setText('')
                    toast.success('نظر شما اضافه شد')
                    setLoading(false)
                } catch (err) {
                    toast.error('مشکلی رخ داده دوباره امتحان کنید')
                    setLoading(false)
                }
            } else {
                toast.error('مقدار خالی معتبر نیست')
            }
        } else {
            router.push('/login')
        }
    }

    const handleChangeText = (
        e: React.FormEvent<HTMLTextAreaElement>
    ): void => {
        setText(e.currentTarget.value)
    }

    React.useEffect(() => {
        getComments(productId)
    }, [productId])

    return (
        <div
            className={'flex flex-col sm:grid sm:grid-cols-12 sm:h-full gap-5'}
        >
            <div
                className={
                    'col-span-9 h-96 bg-gray-50 rounded-xl p-3 relative overflow-hidden'
                }
            >
                <List list={comments} isLoading={isLoading} />
            </div>

            <div className={'col-span-3 flex flex-col h-full gap-5 divide-x'}>
                <div className={'flex-1'}>
                    <textarea
                        value={text}
                        onChange={handleChangeText}
                        className={
                            'h-full w-full border-gray-100 border-2 rounded-lg p-3 resize-none'
                        }
                    />
                </div>
                <Button
                    loading={isLoading}
                    disabled={isLoading}
                    onClick={handleAddComment}
                    title={'ارسال نظر'}
                />
            </div>
        </div>
    )
}

const List = ({
    list,
    isLoading,
}: {
    list: Array<CommentItemProps>
    isLoading: boolean
}) => {
    if (list.length == 0) {
        return (
            <div className={'w-full h-full flex justify-center items-center'}>
                <div
                    className={
                        'px-4 py-2 rounded-lg bg-primary-100 text-primary-500'
                    }
                >
                    هیچ کامنتی ثبت نشده
                </div>
            </div>
        )
    }
    return (
        <div
            className={
                'absolute inset-0 px-3 overflow-auto flex flex-col divide-y scrollbar-thin'
            }
        >
            {isLoading && <OverlayLoading />}
            {list.map(
                (comment: CommentItemProps, index: number): JSX.Element => (
                    <div
                        key={index}
                        className={'flex flex-row gap-5 py-5 items-center'}
                    >
                        <div
                            className={
                                'relative w-16 h-16 rounded-full overflow-hidden'
                            }
                        >
                            <Image
                                src={'/profile.jpg'}
                                layout={'fill'}
                                objectFit={'cover'}
                                alt={'profile pic'}
                            />
                        </div>
                        <div>
                            <div className={'text-sm text-gray-400'}>
                                {comment.created_at &&
                                    new Date(comment.created_at).toISOString()}
                            </div>
                            <div className={'text-sm text-primary-500'}>
                                {comment.user.first_name}{' '}
                                {comment.user.last_name}
                            </div>
                            <div>{comment.text}</div>
                        </div>
                    </div>
                )
            )}
        </div>
    )
}
export default ProductComments
