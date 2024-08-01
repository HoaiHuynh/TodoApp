import React, { useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { format, isSameDay } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { dateOptions } from '@/constants/AppConstants';
import SchedulePickerModal, { SchedulePickerModalRef } from './SchedulePickerModal';
import { DateOption } from '@/types/type';

interface SchedulePickerProps {
    value: Date | null | undefined;
    onChangeDate: (value: Date | null | undefined) => void;
}

const SchedulePicker = (props: SchedulePickerProps) => {
    const { value, onChangeDate } = props;

    const refPriority = useRef<SchedulePickerModalRef>(null);
    const [selectedDate, setSelectedDate] = useState<DateOption | null | undefined>(null);

    useEffect(() => {
        if (!value) {
            setSelectedDate(null);
            return;
        }

        const selected = dateOptions?.filter(x => x?.value)?.find(item => item?.value && isSameDay(item?.value, new Date(value)));

        if (!selected) {
            setSelectedDate({
                label: 'Custom',
                value: new Date(value),
                color: '#687076',
                icon: 'calendar-outline'
            });
        }
        else {
            setSelectedDate(selected);
        }
    }, [value]);

    const handleShow = () => {
        refPriority.current?.show();
    };

    const handleChange = (value: Date | null | undefined) => {
        if (!value) {
            setSelectedDate(null);
            onChangeDate(null);

            return;
        }

        const selected = dateOptions?.filter(x => x?.value)?.find(item => item?.value && isSameDay(item?.value, value));

        setSelectedDate(selected);
        onChangeDate(value);
    };

    return (
        <>
            <View className='flex flex-row items-center gap-x-4 h-10'>
                <Ionicons name='calendar-outline' size={22} color={selectedDate?.color || '#687076'} />
                <TouchableOpacity onPress={handleShow}>
                    <Text className={`text-base ${selectedDate?.value ? 'text-gray-800' : 'text-gray-400'}`}>{selectedDate?.value ? format(selectedDate?.value, 'MMM dd, yyyy') : 'Select schedule date'}</Text>
                </TouchableOpacity>
            </View>

            <SchedulePickerModal ref={refPriority} onChangeDate={handleChange} />
        </>
    );
};

export default SchedulePicker;