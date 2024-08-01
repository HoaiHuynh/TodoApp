import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { format, isSameDay } from 'date-fns';
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerRef } from '../DateTimePicker';
import { dateOptions } from '@/constants/AppConstants';
import Checkbox from '../Checkbox';

interface SchedulePickerModalProps {
    value?: Date;
    mode?: 'date' | 'time' | 'datetime';
    onChangeDate?: (date: Date | null | undefined) => void;
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
    const snapPoints = useRef(['25%', '50%', '90%']).current;

    const [selectedDate, setSelectedDate] = React.useState<Date | null | undefined>(value);

    useImperativeHandle(ref, () => ({
        show: () => openModal(),
        hide: () => closeModal(),
    }));

    const openModal = () => {
        bottomSheetModalRef.current?.present();
    };

    const closeModal = () => {
        bottomSheetModalRef.current?.dismiss();
        onClose?.();
    };

    const confirmSelect = () => {
        onChangeDate?.(selectedDate);
        closeModal();
    };

    const handleSelectDate = (date: Date | null | undefined) => {
        setSelectedDate(date);
    };

    const renderBackdrop = (backdropProps: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop {...backdropProps} pressBehavior={'close'} />
    );

    const renderBody = () => {
        return (
            <View>
                {dateOptions.map((option, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => handleSelectDate(option.value)}>
                        <View className="flex flex-row h-12 items-center ml-2 gap-x-3">
                            <View className="flex flex-1 flex-row gap-x-2 items-center">
                                <Ionicons
                                    name={option.icon as any}
                                    size={22}
                                    color={option.color} />
                                <Text className="text-base font-semibold">{option.label}</Text>
                            </View>

                            {option?.value && (
                                <Text className="text-gray-400">
                                    {format(option?.value, 'EEE')}
                                </Text>
                            )}

                            <Checkbox disabled value={(selectedDate && option?.value) ? isSameDay(selectedDate, option?.value) : false} />
                        </View>
                    </TouchableOpacity>
                ))}

                <TouchableOpacity onPress={() => refDateTimePicker?.current?.show()}>
                    <View className="flex flex-row h-12 items-center mx-2">
                        <View className="flex flex-1 flex-row gap-x-2 items-center">
                            <Ionicons
                                name={'calendar-number-outline'}
                                size={22}
                                color="#3b82f6" />
                            <Text className="text-base font-semibold">Choose date</Text>
                        </View>

                        {selectedDate && (
                            <Text className="text-gray-400">
                                {format(selectedDate, 'dd/MM/yyyy')}
                            </Text>
                        )}
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View className="flex flex-1">
            <BottomSheetModal
                index={1}
                ref={bottomSheetModalRef}
                snapPoints={snapPoints}
                backdropComponent={renderBackdrop}>
                <BottomSheetView className="flex flex-1 px-4">
                    <View className="flex flex-row justify-between">
                        <TouchableOpacity
                            className="h-10 items-center justify-center rounded-full"
                            onPress={closeModal}>
                            <Text className="text-red-400">Close</Text>
                        </TouchableOpacity>

                        <Text className="text-lg font-semibold">Select Date</Text>

                        <TouchableOpacity
                            className="h-10 items-center justify-center rounded-full"
                            onPress={confirmSelect}>
                            <Text className="text-blue-500">Done</Text>
                        </TouchableOpacity>
                    </View>

                    {renderBody()}
                </BottomSheetView>
            </BottomSheetModal>
            <DateTimePicker
                ref={refDateTimePicker}
                mode={mode}
                value={selectedDate!}
                onChangeDate={handleSelectDate} />
        </View>
    );
});

SchedulePickerModal.displayName = 'SchedulePickerModal';

export default SchedulePickerModal;
