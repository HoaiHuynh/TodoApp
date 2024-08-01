import React, { useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { labelOptions } from '@/constants/AppConstants';
import LabelPickerModal, { LabelPickerModalRef } from './LabelPickerModal';
import { ComboOptions } from '@/types/type';

interface LabelPickerProps {
    value: string | null | undefined;
    onChangeLabel: (value: string) => void;
}

const LabelPicker = (props: LabelPickerProps) => {
    const { value, onChangeLabel } = props;

    const refLabel = useRef<LabelPickerModalRef>(null);
    const [selectedLabel, setSelectedLabel] = useState<ComboOptions[]>([]);

    useEffect(() => {
        if (!value) {
            setSelectedLabel([]);
            return;
        }
        const arrayLabel = value?.split(',');
        const selected = labelOptions?.filter(item => arrayLabel?.includes(item.value));

        setSelectedLabel(selected);
    }, [value]);

    const handleShow = () => {
        refLabel.current?.show();
    };

    const handleChange = (value: ComboOptions[]) => {
        const selected = value?.map(item => item?.value);

        setSelectedLabel(value);
        onChangeLabel(selected.join(','));
    };

    const renderValue = () => {
        if (!selectedLabel?.length) {
            return (
                <Text className={'text-base text-gray-400'}>Select label</Text>
            );
        }

        return (
            <View style={{ width: '100%', flexWrap: 'wrap', gap: 4, flex: 1, flexDirection: 'row' }}>
                {selectedLabel?.map((item, index) => (
                    <View key={index} className='flex items-center justify-center px-2 py-1 rounded-md' style={{ backgroundColor: item?.backgroundColor }}>
                        <Text className='text-base text-gray-800'>{item.label}</Text>
                    </View>
                ))}
            </View>
        );
    };

    return (
        <>
            <View className='flex flex-row items-center gap-x-4 min-h-10 w-full'>
                <Ionicons name='bookmarks-outline' size={22} color='#687076' />
                <TouchableOpacity onPress={handleShow}>
                    {renderValue()}
                </TouchableOpacity>
            </View>

            <LabelPickerModal
                ref={refLabel}
                value={selectedLabel?.map(item => item?.value)}
                onChangeLabel={handleChange} />
        </>
    );
};

export default LabelPicker;