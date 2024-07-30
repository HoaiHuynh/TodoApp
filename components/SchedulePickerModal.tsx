import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import DateTimePicker, { DateTimePickerRef } from './DateTimePicker';
import { Ionicons } from '@expo/vector-icons';
import { addDays, endOfWeek, format } from 'date-fns';
import { dateOptions } from '@/constants/AppConstants';

interface SchedulePickerModalProps {
    value?: Date;
    mode?: "date" | "time" | "datetime";
    onChangeDate?: (date: Date | null) => void;
    onClose?: () => void;
}

export interface SchedulePickerModalRef {
    show: () => void;
    hide: () => void;
}

const SchedulePickerModal = forwardRef<SchedulePickerModalRef, SchedulePickerModalProps>((props, ref) => {
    const { mode, value, onChangeDate, onClose } = props;

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const refDateTimePicker = useRef<DateTimePickerRef>(null);
    const snapPoints = useRef(['25%', '50%', '100%']).current;

    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(value);

    useImperativeHandle(ref, () => ({
        show: () => openModal(),
        hide: () => closeModal()
    }));

    const openModal = () => {
        bottomSheetModalRef.current?.present();
    }

    const closeModal = () => {
        bottomSheetModalRef.current?.dismiss();
        onClose?.();
    };

    const renderBody = () => {
        return (
            <View>
                {dateOptions.map((option, index) => (
                    <TouchableOpacity key={index} onPress={() => onChangeDate?.(option.value)}>
                        <View className='flex flex-row h-12 items-center mx-2'>
                            <View className='flex flex-1 flex-row gap-x-2 items-center'>
                                <Ionicons name={option.icon as any} size={24} color={option.color} />
                                <Text className='text-base font-semibold'>{option.label}</Text>
                            </View>

                            {option?.value && <Text className='text-gray-400'>{format(option?.value, 'EEE')}</Text>}
                        </View>
                    </TouchableOpacity>
                ))}

                <TouchableOpacity onPress={() => refDateTimePicker?.current?.show()}>
                    <View className='flex flex-row h-12 items-center mx-2'>
                        <View className='flex flex-1 flex-row gap-x-2 items-center'>
                            <Ionicons name={'calendar-number-outline'} size={24} color='#3b82f6' />
                            <Text className='text-base font-semibold'>Choose date</Text>
                        </View>

                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View className='flex flex-1'>
            <BottomSheetModal
                index={1}
                ref={bottomSheetModalRef}
                snapPoints={snapPoints}>
                <BottomSheetView className='flex flex-1 px-4'>
                    <View className='flex flex-row justify-between'>
                        <TouchableOpacity className='h-10 items-center justify-center rounded-full' onPress={closeModal}>
                            <Text className='text-red-400'>Close</Text>
                        </TouchableOpacity>

                        <Text className='text-lg font-semibold'>Select Date</Text>

                        <TouchableOpacity className='h-10 items-center justify-center rounded-full' onPress={closeModal}>
                            <Text className='text-blue-400'>Done</Text>
                        </TouchableOpacity>
                    </View>

                    {renderBody()}

                </BottomSheetView>
            </BottomSheetModal>
            <DateTimePicker ref={refDateTimePicker} />
        </View>
    )
});

SchedulePickerModal.displayName = 'SchedulePickerModal'

export default SchedulePickerModal