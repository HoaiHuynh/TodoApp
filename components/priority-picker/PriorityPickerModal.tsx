import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { priorityOptions } from '@/constants/AppConstants';
import Checkbox from '../Checkbox';

interface PriorityPickerModalProps {
    readonly?: boolean;
    value?: number | null;
    onChangePriority?: (value: number | null | undefined) => void;
    onClose?: () => void;
}

export interface PriorityPickerModalRef {
    show: () => void;
    hide: () => void;
}

const PriorityPickerModal = forwardRef<PriorityPickerModalRef, PriorityPickerModalProps>((props, ref) => {
    const { value, readonly, onChangePriority, onClose } = props;

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useRef(['35%', '90%']).current;

    const [selectedPriority, setSelectedPriority] = React.useState<number | null | undefined>(value);

    useEffect(() => {
        setSelectedPriority(value);
    }, [value]);

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

    const renderBackdrop = (backdropProps: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop {...backdropProps} pressBehavior={'close'} />
    );

    const renderBody = () => {
        return (
            <View>
                {priorityOptions.map((option, index) => (
                    <TouchableOpacity
                        key={index}
                        disabled={readonly}
                        onPress={() => handleSelect(option.value)}>
                        <View className="flex flex-row h-12 items-center mx-2">
                            <View className="flex flex-1 flex-row gap-x-2 items-center">
                                <Ionicons
                                    name={option.icon as any}
                                    size={22}
                                    color={option.color} />
                                <Text className="text-base font-semibold">{option.label}</Text>
                            </View>

                            {!readonly && <Checkbox disabled value={`${selectedPriority}` === `${option?.value}`} />}
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
                snapPoints={snapPoints}
                backdropComponent={renderBackdrop}>
                <BottomSheetView className="flex flex-1 px-4">
                    <View className="flex flex-row justify-between">
                        <TouchableOpacity
                            className="h-10 items-center justify-center rounded-full"
                            onPress={closeModal}>
                            <Text className="text-red-400">Close</Text>
                        </TouchableOpacity>

                        <Text className="text-lg font-semibold">Priority</Text>

                        {!readonly
                            ? <TouchableOpacity
                                className="h-10 items-center justify-center rounded-full"
                                onPress={confirmSelect}>
                                <Text className="text-blue-500">Done</Text>
                            </TouchableOpacity>
                            : <View className='w-10' />
                        }
                    </View>

                    {renderBody()}
                </BottomSheetView>
            </BottomSheetModal>
        </View>
    );
});

PriorityPickerModal.displayName = 'PriorityPickerModal';

export default PriorityPickerModal;
