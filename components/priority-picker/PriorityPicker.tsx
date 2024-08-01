import React, { useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { priorityOptions } from '@/constants/AppConstants';
import PriorityPickerModal, { PriorityPickerModalRef } from './PriorityPickerModal';
import { ComboOptions } from '@/types/type';

interface PriorityPickerProps {
    value: number | null | undefined;
    onChangePriority: (value: number | null | undefined) => void;
}

const PriorityPicker = (props: PriorityPickerProps) => {
    const { value, onChangePriority } = props;

    const refPriority = useRef<PriorityPickerModalRef>(null);
    const [selectedPriority, setSelectedPriority] = useState<ComboOptions<number> | null | undefined>(null);

    useEffect(() => {
        const selected = priorityOptions?.find(item => item.value === value);
        setSelectedPriority(selected);
    }, [value]);

    const handleShow = () => {
        refPriority.current?.show();
    };

    const handleChange = (value: number | null | undefined) => {
        const selected = priorityOptions?.find(item => item.value === value);

        setSelectedPriority(selected);
        onChangePriority(value);
    };

    return (
        <>
            <View className='flex flex-row items-center gap-x-4 h-10'>
                <Ionicons name='flag-outline' size={22} color={selectedPriority?.color || '#687076'} />
                <TouchableOpacity onPress={handleShow}>
                    <Text className={`text-base ${selectedPriority?.value ? 'text-gray-800' : 'text-gray-400'}`}>{selectedPriority?.label || 'Select priority'}</Text>
                </TouchableOpacity>
            </View>

            <PriorityPickerModal
                ref={refPriority}
                value={selectedPriority?.value}
                onChangePriority={handleChange} />
        </>
    );
};

export default PriorityPicker;