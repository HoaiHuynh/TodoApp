import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Alert, Keyboard, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEditTodoActions, useTodoActions } from '@/hooks/useTodoStore';
import Checkbox from '../Checkbox';
import BaseForm from '../form/BaseForm';
import { BaseFormRef, IFormModel } from '../form/BaseForm.type';
import FieldView from '../form/FieldView';
import { FieldViewChildProps } from '../form/FieldView.type';
import PriorityPicker from '../priority-picker/PriorityPicker';
import SchedulePicker from '../schedule-picker/SchedulePicker';
import LabelPicker from '../label-picker/LabelPicker';
import DateTimePicker, { DateTimePickerRef } from '../DateTimePicker';
import { TodoDto } from '@/types/type';
import StickButton from '../StickButton';
import useCalendar from '@/hooks/useCalendar';

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

    const { toggleComplete, saveTodo } = useEditTodoActions();
    const { createEvent } = useCalendar();

    const { getTodo } = useTodoActions();
    const [todo, setTodo] = useState<TodoDto>();
    const [visible, setVisible] = useState(false);

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const refForm = useRef<BaseFormRef>(null);
    const refDateTimePicker = useRef<DateTimePickerRef>(null);

    const snapPoints = useRef(['25%', '50%', '90%']).current;

    const formModel: IFormModel<TodoDto> = {
        fields: {}
    };

    const openModal = (id?: string) => {
        if (id) {
            const selectTodo = getTodo(id);
            selectTodo && setTodo(selectTodo);
        }

        setVisible(true);

        setTimeout(() => {
            bottomSheetModalRef.current?.present();
        }, 150);
    };

    const closeModal = () => {
        Keyboard.dismiss();

        setTimeout(() => {
            setVisible(false);
            bottomSheetModalRef.current?.dismiss();
            onClose?.();
        }, 250);
    };

    useImperativeHandle(ref, () => ({
        show: openModal,
        hide: closeModal
    }));

    const onSubmit = (values: TodoDto) => {
        saveTodo(todo?.id, values);

        onDone?.();
        closeModal();

        Toast.show({
            type: 'success',
            text1: 'Success',
            text2: todo?.id ? 'Todo updated successfully' : 'Todo created successfully'
        });
    };

    const confirmTodo = () => {
        refForm.current?.submit();
    };

    const handleConfirmRemind = async (date: Date) => {
        if (!todo?.id) {
            return;
        }

        const eventId = await createEvent(todo, date);
        if (eventId) {
            Alert.alert('Success', 'Event has been created');
        }
        else {
            Alert.alert('Error', 'Failed to create event');
        }
    };

    const openRemind = () => {
        refDateTimePicker?.current?.show();
    };

    const openFocus = () => {
        Keyboard.dismiss();

        setTimeout(() => {
            setVisible(false);
            bottomSheetModalRef.current?.dismiss();
            router.push('/focus');
        }, 250);
    };

    const handleToggleComplete = (value: boolean) => {
        if (todo?.id) {
            toggleComplete(todo?.id, value);
        }

        refForm.current?.setValue('complete', value);
    };

    const renderBackdrop = (backdropProps: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop {...backdropProps} pressBehavior={'close'} />
    );

    const renderBody = () => {
        if (!visible) {
            return <></>;
        }

        return (
            <BaseForm
                ref={refForm}
                model={formModel}
                defaultValues={todo}
                onSubmit={onSubmit}>
                <View className='flex flex-1 gap-y-2'>
                    <View className='flex flex-row items-center min-h-14'>
                        <FieldView name='complete'>
                            {({ value }: FieldViewChildProps) => (
                                <Checkbox value={value} onChange={handleToggleComplete} />
                            )}
                        </FieldView>
                        <FieldView name='title'>
                            {({ value, onChange }: FieldViewChildProps) => (
                                <TextInput
                                    value={value}
                                    onChangeText={onChange}
                                    placeholder='e.g. Buy a new Macbook'
                                    placeholderTextColor='#9ca3af'
                                    className="flex-1 text-3xl font-semibold h-14" />
                            )}
                        </FieldView>
                    </View>

                    <View className='flex flex-row items-center gap-x-4'>
                        <Ionicons name='document-outline' size={22} color='#687076' />
                        <FieldView name='description'>
                            {({ value, onChange }: FieldViewChildProps) => (
                                <TextInput
                                    value={value}
                                    multiline={true}
                                    onChangeText={onChange}
                                    placeholder='Description'
                                    placeholderTextColor={'gray'}
                                    className="h-full max-h-20" />
                            )}
                        </FieldView>
                    </View>

                    <FieldView name='priority'>
                        {({ value, onChange }: FieldViewChildProps) => (
                            <PriorityPicker
                                value={value}
                                //@ts-ignore
                                onChangePriority={onChange} />
                        )}
                    </FieldView>

                    <FieldView name='label'>
                        {({ value, onChange }: FieldViewChildProps) => (
                            <LabelPicker
                                value={value}
                                onChangeLabel={onChange} />
                        )}
                    </FieldView>

                    <FieldView name='schedule'>
                        {({ value, onChange }: FieldViewChildProps) => (
                            <SchedulePicker
                                value={value}
                                // @ts-ignore
                                onChangeDate={onChange} />
                        )}
                    </FieldView>

                    {todo?.id && (
                        <View className='border-t border-t-gray-300 pt-2'>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ columnGap: 8 }}>
                                <StickButton label='Remind me' icon='alert-circle-outline' onPress={openRemind} />
                                <StickButton label='Focus' icon='play-circle-outline' onPress={openFocus} />
                            </ScrollView>
                        </View>
                    )}
                </View>
            </BaseForm>
        );
    };

    return (
        <View className='flex flex-1'>
            <BottomSheetModal
                index={1}
                ref={bottomSheetModalRef}
                snapPoints={snapPoints}
                backdropComponent={renderBackdrop}>
                <BottomSheetView className='flex flex-1 px-4'>
                    <View className="flex flex-row justify-between">
                        <TouchableOpacity
                            className="h-10 items-center justify-center rounded-full"
                            onPress={closeModal}>
                            <Text className="text-red-400">Close</Text>
                        </TouchableOpacity>

                        <Text className="text-lg font-semibold">{todo?.id ? 'Detail Todo' : 'Create Todo'}</Text>

                        <TouchableOpacity
                            className="h-10 items-center justify-center rounded-full"
                            onPress={confirmTodo}>
                            <Text className="text-blue-400">Done</Text>
                        </TouchableOpacity>
                    </View>

                    {renderBody()}

                    <DateTimePicker
                        ref={refDateTimePicker}
                        mode={'datetime'}
                        onChangeDate={handleConfirmRemind} />
                </BottomSheetView>
            </BottomSheetModal>
        </View>
    );
});

CreateUpdateTodoModal.displayName = 'CreateUpdateTodoModal';

export default CreateUpdateTodoModal;