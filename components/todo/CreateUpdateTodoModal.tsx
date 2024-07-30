import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEditTodo, useEditTodoActions, useTodo, useTodoActions } from '@/hooks/useTodoStore';
import { SelectTodo } from '@/db/schema';
import Checkbox from '../Checkbox';
import DateTimePicker, { DateTimePickerRef } from '../DateTimePicker';
import SchedulePickerModal, { SchedulePickerModalRef } from '../SchedulePickerModal';

interface CreateUpdateTodoModalProps {
    onClose?: () => void;
    onDone?: () => void;
};

export interface CreateUpdateTodoModalRef {
    show: (id?: string) => void;
    hide: () => void;
}

const CreateUpdateTodoModal = forwardRef<CreateUpdateTodoModalRef, CreateUpdateTodoModalProps>((props, ref) => {
    const { onClose, onDone } = props;

    const {
        title,
        description,
        complete,
        label,
        priority,
        schedule
    } = useEditTodo();

    const {
        onChangeTitle,
        onChangeLabel,
        onChangeSchedule,
        onChangeDescription,
        onChangePriority,
        toggleComplete,

        saveTodo
    } = useEditTodoActions();

    const { getTodo } = useTodoActions();
    const [todo, setTodo] = useState<SelectTodo>();
    const [visible, setVisible] = useState(false);

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const refSchedule = useRef<SchedulePickerModalRef>(null);

    const snapPoints = useRef(['25%', '50%', '100%']).current;

    const openModal = (id?: string) => {
        if (id) {
            const selectTodo = getTodo(id);
            selectTodo && setTodo(selectTodo);
        }

        setVisible(true);
        bottomSheetModalRef.current?.present();
    }

    const closeModal = () => {
        bottomSheetModalRef.current?.dismiss();
        setVisible(false);
        onClose?.();
    };

    const handleSheetChanges = (index: number) => {
        if (index === 0) {
            closeModal();
        };
    };

    useImperativeHandle(ref, () => ({
        show: openModal,
        hide: closeModal
    }));

    const renderBody = () => {
        if (!visible) {
            return <></>;
        }

        return (
            <View>
                <View className='flex flex-row items-center'>
                    <Checkbox value={Boolean(todo?.complete)} onChange={toggleComplete} />
                    <TextInput
                        defaultValue={todo?.title || ''}
                        value={title}
                        multiline
                        numberOfLines={3}
                        onChangeText={onChangeTitle}
                        placeholder='Title'
                        className="flex-1 text-3xl font-semibold max-h-20" />
                </View>
                {todo?.description && (
                    <View className='flex flex-row items-center gap-x-2'>
                        <Ionicons name='menu-outline' size={24} color='#687076' />
                        <TextInput
                            defaultValue={todo?.description || ''}
                            value={description}
                            onChangeText={onChangeDescription}
                            placeholder='Description'
                            placeholderTextColor={'gray'}
                            className="h-full max-h-20" />
                    </View>
                )}

                <View className='flex flex-row items-center gap-x-2'>
                    <Ionicons name='flag-outline' size={24} color='#687076' />
                    <Text>{priority || 'hoai'}</Text>
                </View>

                <View className='flex flex-row items-center gap-x-2'>
                    <Ionicons name='bookmark-outline' size={24} color='#687076' />
                    <Text>{label || 'hoai'}</Text>
                </View>

                <TouchableOpacity onPress={() => refSchedule.current?.show()}>
                    <View className='flex flex-row items-center gap-x-2'>
                        <Ionicons name='calendar-outline' size={24} color='#687076' />
                        <Text>{schedule || 'hoai'}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className='flex flex-1'>
            <BottomSheetModal
                index={1}
                ref={bottomSheetModalRef}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}>
                <BottomSheetView className='flex flex-1 px-4'>
                    <View className='flex flex-row justify-end'>
                        <TouchableOpacity className='h-10 w-10 items-center justify-center rounded-full' onPress={closeModal}>
                            <View className='h-8 w-8 rounded-full items-center justify-center bg-gray-200'>
                                <Ionicons name='close' size={24} color='gray' />
                            </View>
                        </TouchableOpacity>
                    </View>

                    {renderBody()}

                    <SchedulePickerModal ref={refSchedule} />
                </BottomSheetView>
            </BottomSheetModal>
        </View>
    )
});

export default CreateUpdateTodoModal;