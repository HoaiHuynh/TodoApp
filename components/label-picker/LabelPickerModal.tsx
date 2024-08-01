import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { labelOptions } from '@/constants/AppConstants';
import Checkbox from '../Checkbox';
import { ComboOptions } from '@/types/type';

interface LabelPickerModalProps {
    value: string[];
    onChangeLabel?: (value: ComboOptions[]) => void;
    onClose?: () => void;
}

export interface LabelPickerModalRef {
    show: () => void;
    hide: () => void;
}

const LabelPickerModal = forwardRef<LabelPickerModalRef, LabelPickerModalProps>((props, ref) => {
    const { value, onChangeLabel, onClose } = props;

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useRef(['65%', '90%']).current;

    const [selectedLabels, setSelectedLabels] = useState<Map<string, ComboOptions>>(new Map());

    useEffect(() => {
        if (!value) {
            setSelectedLabels(new Map());
            return;
        }

        const selected = new Map<string, ComboOptions>();

        value.forEach(item => {
            const option = labelOptions.find(option => option.value === item);
            if (option) {
                selected.set(option.value, option);
            }
        });

        setSelectedLabels(selected);
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
        onChangeLabel?.([...selectedLabels.values()]);
        closeModal();
    };

    const handleSelect = (value: ComboOptions) => {
        const selected = new Map(selectedLabels);
        if (selected.has(value.value)) {
            selected.delete(value.value);
        }
        else {
            selected.set(value.value, value);
        }

        setSelectedLabels(selected);
    };

    const renderBackdrop = (backdropProps: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop {...backdropProps} pressBehavior={'close'} />
    );

    const renderBody = () => {
        return (
            <View>
                {labelOptions.map((option, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => handleSelect(option)}>
                        <View className="flex flex-row h-12 items-center mx-2">
                            <View className="flex flex-1 flex-row gap-x-2 items-center">
                                <Ionicons
                                    name={option.icon as any}
                                    size={22}
                                    color={option.color} />
                                <Text className="text-base font-semibold">{option.label}</Text>
                            </View>

                            <Checkbox disabled type='checkbox' value={selectedLabels?.has(option?.value)} />
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

                        <Text className="text-lg font-semibold">Label</Text>

                        <TouchableOpacity
                            className="h-10 items-center justify-center rounded-full"
                            onPress={confirmSelect}>
                            <Text className="text-blue-500">Done</Text>
                        </TouchableOpacity>
                    </View>

                    {renderBody()}
                </BottomSheetView>
            </BottomSheetModal>
        </View>
    );
});

LabelPickerModal.displayName = 'LabelPickerModal';

export default LabelPickerModal;
