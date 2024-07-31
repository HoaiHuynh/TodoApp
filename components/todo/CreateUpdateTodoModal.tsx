import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEditTodo, useEditTodoActions, useTodoActions } from '@/hooks/useTodoStore';
import { SelectTodo } from '@/db/schema';
import Checkbox from '../Checkbox';
import SchedulePickerModal, { SchedulePickerModalRef } from '../SchedulePickerModal';
import { getId } from '@/utils/AppUtil';
import BaseForm from '../form/BaseForm';
import { BaseFormRef, IFormModel } from '../form/BaseForm.type';
import FieldView from '../form/FieldView';
import { FieldViewChildProps } from '../form/FieldView.type';
import { BaseActionSheetRef, BaseActionSheet } from '../action-sheet';
import { PriorityType } from '@/types/type';
import PriorityPickerModal, { PriorityPickerModalRef } from '../PriorityPickerModal';

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
        onChangeLabel,
        onChangeSchedule,
        onChangePriority,
        toggleComplete,

        saveTodo
    } = useEditTodoActions();

    const { getTodo } = useTodoActions();
    const [todo, setTodo] = useState<SelectTodo>();
    const [visible, setVisible] = useState(false);

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const refSchedule = useRef<SchedulePickerModalRef>(null);
    const refPriority = useRef<PriorityPickerModalRef>(null);
    const refForm = useRef<BaseFormRef>(null);
    const refActionSheet = useRef<BaseActionSheetRef>(null);

    const snapPoints = useRef(['25%', '50%', '85%']).current;

    console.log('re-render CreateUpdateTodoModal');

    const formModel: IFormModel<SelectTodo> = {
        fields: {}
    };

    const openModal = (id?: string) => {
        if (id) {
            const selectTodo = getTodo(id);
            selectTodo && setTodo(selectTodo);
        }

        setVisible(true);
        bottomSheetModalRef.current?.present();
    };

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

    const onSelectPriority = (value: PriorityType) => {

    };

    const handleShowPriority = () => {
        refPriority.current?.show();
    };

    useImperativeHandle(ref, () => ({
        show: openModal,
        hide: closeModal
    }));

    const onSubmit = (values: SelectTodo) => {
        console.log('values: ', values);
    };

    const handleToggleComplete = (value: boolean) => {
        toggleComplete(getId(todo?.id), value);
        refForm.current?.setValue('complete', value);
    };

    const renderBody = () => {
        if (!visible) {
            return <></>;
        }

        return (
            <BaseForm ref={refForm} model={formModel} onSubmit={onSubmit}>
                <View className='flex flex-1 gap-y-2'>
                    <View className='flex flex-row items-center'>
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
                                    className="flex-1 text-3xl font-semibold h-14" />
                            )}
                        </FieldView>
                    </View>

                    {todo?.description || !todo?.id && (
                        <View className='flex flex-row items-center gap-x-4'>
                            <Ionicons name='menu-outline' size={22} color='#687076' />
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
                    )}

                    <View className='flex flex-row items-center gap-x-4 h-10'>
                        <Ionicons name='flag-outline' size={22} color='#687076' />
                        <TouchableOpacity onPress={handleShowPriority}>
                            <Text>{priority || 'hoai'}</Text>
                        </TouchableOpacity>
                    </View>

                    <View className='flex flex-row items-center gap-x-4 h-10'>
                        <Ionicons name='bookmark-outline' size={22} color='#687076' />
                        <Text>{label || 'hoai'}</Text>
                    </View>

                    <TouchableOpacity onPress={() => refSchedule.current?.show()}>
                        <View className='flex flex-row items-center gap-x-4 h-10'>
                            <Ionicons name='calendar-outline' size={22} color='#687076' />
                            <Text>{schedule || 'hoai'}</Text>
                        </View>
                    </TouchableOpacity>
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
                onChange={handleSheetChanges}>
                <BottomSheetView className='flex flex-1 px-4'>
                    <View className='flex flex-row justify-end'>
                        <TouchableOpacity className='h-10 w-10 items-center justify-center rounded-full' onPress={closeModal}>
                            <View className='h-8 w-8 rounded-full items-center justify-center bg-gray-200'>
                                <Ionicons name='close' size={22} color='gray' />
                            </View>
                        </TouchableOpacity>
                    </View>

                    {renderBody()}

                    <SchedulePickerModal ref={refSchedule} />
                    <PriorityPickerModal ref={refPriority} />
                    <BaseActionSheet ref={refActionSheet} />
                </BottomSheetView>
            </BottomSheetModal>
        </View>
    );
});

CreateUpdateTodoModal.displayName = 'CreateUpdateTodoModal';

export default CreateUpdateTodoModal;