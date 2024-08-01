import React, { useRef } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { labelOptions, priorityOptions } from '@/constants/AppConstants';
import { useTodos } from '@/hooks/useTodoStore';
import LabelPickerModal, { LabelPickerModalRef } from '@/components/label-picker/LabelPickerModal';
import PriorityPickerModal, { PriorityPickerModalRef } from '@/components/priority-picker/PriorityPickerModal';

interface SettingItemProps {
    title: string;
    icon: string;
    value: string;
    disableLine?: boolean;
    onPress?: () => void;
}

const SettingItem = (props: SettingItemProps) => {
    return (
        <Pressable onPress={props?.onPress} className='flex flex-row h-12 w-full items-center gap-x-2'>
            <Ionicons name={props?.icon as any} color='#f87171' size={22} />
            <View className={`${!props?.disableLine && 'border-b border-b-neutral-300'} flex h-full flex-1 flex-row items-center`}>
                <Text className='flex-1 text-xl'>{props.title}</Text>
                <Text className='text-xl'>{props.value}</Text>
            </View>
        </Pressable>
    );
};

const Browse = () => {
    const todos = useTodos();

    const refLabel = useRef<LabelPickerModalRef>(null);
    const refPriority = useRef<PriorityPickerModalRef>(null);

    const onOpenLabel = () => {
        refLabel.current?.show();
    };

    const onOpenPriority = () => {
        refPriority.current?.show();
    };

    return (
        <View className='flex flex-1 px-4'>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}>

                <View className='bg-white p-4 rounded-2xl mt-4'>
                    <SettingItem
                        title='Todos'
                        icon='albums-outline'
                        value={todos?.length.toString()} />
                    <SettingItem
                        title='Priority'
                        icon='flag-outline'
                        value={priorityOptions?.length.toString()}
                        onPress={onOpenPriority} />
                    <SettingItem
                        title='Labels'
                        icon='bookmarks-outline'
                        disableLine
                        value={labelOptions?.length.toString()}
                        onPress={onOpenLabel} />
                </View>
            </ScrollView>

            <LabelPickerModal
                ref={refLabel}
                readonly
                value={[]} />

            <PriorityPickerModal
                ref={refPriority}
                readonly />
        </View>
    );
};

export default Browse;