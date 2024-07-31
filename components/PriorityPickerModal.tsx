import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { priorityOptions } from '@/constants/AppConstants';

interface PriorityPickerModalProps {
    value?: string;
    onChangePriority?: (value: string | null | undefined) => void;
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

    const [selectedPriority, setSelectedPriority] = React.useState<string | null | undefined>(value);

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

    const handleSelect = (value: string | null | undefined) => {
        setSelectedPriority(value);
        onChangePriority?.(value);
    };

    const renderBody = () => {
        return (
            <View>
                {priorityOptions.map((option, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => handleSelect(option.value)}>
                        <View className="flex flex-row h-12 items-center mx-2">
                            {selectedPriority === option?.value && (
                                <Ionicons
                                    name={'checkmark-circle'}
                                    size={24}
                                    color="#3b82f6" />
                            )}

                            <View className="flex flex-1 flex-row gap-x-2 items-center">
                                <Ionicons
                                    name={option.icon as any}
                                    size={24}
                                    color={option.color} />
                                <Text className="text-base font-semibold">{option.label}</Text>
                            </View>

                            {option?.value && (
                                <Text className="text-gray-400">
                                    {option?.value}
                                </Text>
                            )}
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
                            onPress={closeModal}>
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
