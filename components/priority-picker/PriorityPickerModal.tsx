import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { priorityOptions } from '@/constants/AppConstants';
import Checkbox from '../Checkbox';

interface PriorityPickerModalProps {
    value?: number | null;
    onChangePriority?: (value: number | null | undefined) => void;
    onClose?: () => void;
}

export interface PriorityPickerModalRef {
    show: () => void;
    hide: () => void;
}

const PriorityPickerModal = forwardRef<PriorityPickerModalRef, PriorityPickerModalProps>((props, ref) => {
    const { value, onChangePriority, onClose } = props;

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useRef(['35%', '85%']).current;

    const [selectedPriority, setSelectedPriority] = React.useState<number | null | undefined>(value);

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
        onChangePriority?.(selectedPriority);
        closeModal();
    };

    const handleSelect = (value: number | null | undefined) => {
        setSelectedPriority(value);
    };

    const renderBody = () => {
        return (
            <View>
                {priorityOptions.map((option, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => handleSelect(option.value)}>
                        <View className="flex flex-row h-12 items-center mx-2">
                            <View className="flex flex-1 flex-row gap-x-2 items-center">
                                <Ionicons
                                    name={option.icon as any}
                                    size={22}
                                    color={option.color} />
                                <Text className="text-base font-semibold">{option.label}</Text>
                            </View>

                            <Checkbox value={selectedPriority === option?.value} />
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    return (
        <View className="flex flex-1">
            <BottomSheetModal
                index={0}
                ref={bottomSheetModalRef}
                snapPoints={snapPoints}>
                <BottomSheetView className="flex flex-1 px-4">
                    <View className="flex flex-row justify-between">
                        <TouchableOpacity
                            className="h-10 items-center justify-center rounded-full"
                            onPress={closeModal}>
                            <Text className="text-red-400">Close</Text>
                        </TouchableOpacity>

                        <Text className="text-lg font-semibold">Priority</Text>

                        <TouchableOpacity
                            className="h-10 items-center justify-center rounded-full"
                            onPress={confirmSelect}>
                            <Text className="text-blue-400">Done</Text>
                        </TouchableOpacity>
                    </View>

                    {renderBody()}
                </BottomSheetView>
            </BottomSheetModal>
        </View>
    );
});

PriorityPickerModal.displayName = 'PriorityPickerModal';

export default PriorityPickerModal;
