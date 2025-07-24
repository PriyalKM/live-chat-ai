import React from 'react'
import { useForm } from 'react-hook-form'
import { USER_ICON } from '@/lib/images'
import { yupResolver } from '@hookform/resolvers/yup'

import SelectFieldWIthCheckBox from '@/components/form/SelectFieldWIthCheckBox'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import FormProvider from '@/components/form/FormProvider'
import Button from '@/components/custom/Button';

const AddToConversation = ({ data, setData }) => {
    const defaultValues = {
        users: []
    }
    const usersData = [
        {
            value:'CMO',
            label:'CMO'
        },
        {
            value:'COO',
            label:'COO'
        },
        {
            value:'CPO',
            label:'CPO'
        }
    ]
    const methods = useForm({
        defaultValues,
        //resolver: yupResolver(notificationSchema)
    })
    const { handleSubmit, reset } = methods;
    const handleClose = () => {
        setData({
            open: false,
            data: null
        })
        reset(defaultValues)
    }
    const onSubmit = (values) => {
        handleClose();
    }

    return (
        <Dialog open={data.open} onOpenChange={(e) => !e && handleClose()}>
            <DialogContent className="w-[90%] max-h-[90vh] flex flex-col space-y-0 sm:w-full sm:max-w-xl border-none rounded-[12px] sm:rounded-[20px] p-0 px-4 sm:px-6 pb-6" onOpenAutoFocus={(e) => e.preventDefault()} onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader className="border-b border-[#EEEFEF] pt-4 sm:pt-5 pb-3">
                    <DialogTitle className="text-primary text-center font-semibold text-[22px] sm:text-[26px]">Add to Conversation</DialogTitle>
                </DialogHeader>
                <FormProvider className="space-y-8" onSubmit={handleSubmit(onSubmit)} methods={methods}>
                    <div className='p-1 space-y-6'>
                        <SelectFieldWIthCheckBox placeholder='Select people' prefix={<img src={USER_ICON} />} options={usersData} name="users" />
                    </div>
                    <div className='grid grid-cols-2 gap-4 sm:gap-5'>
                        <Button onClick={handleClose} className='font-medium max-sm:text-sm bg-[#E9E9E9] text-secondary'>
                            Cancel
                        </Button>
                        <Button type='submit' className='font-medium max-sm:text-sm text-white'>
                            Add
                        </Button>
                    </div>
                </FormProvider>
            </DialogContent>
        </Dialog>

    )
}

export default AddToConversation;