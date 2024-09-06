import React, { useRef } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { labelOptions, priorityOptions } from '@/constants/AppConstants';
import { useTodos } from '@/hooks/useTodoStore';
import LabelPickerModal, { LabelPickerModalRef } from '@/components/label-picker/LabelPickerModal';
import PriorityPickerModal, { PriorityPickerModalRef } from '@/components/priority-picker/PriorityPickerModal';
import { useTheme } from '@/themes/context';
import { Colors } from '@/constants/Colors';

interface SettingItemProps {
    title: string;
    icon: string;
    value: string;
    disableLine?: boolean;
    onPress?: () => void;
}

const SettingItem = (props: SettingItemProps) => {
    const { theme } = useTheme();
    return (
        <Pressable onPress={props?.onPress} className='flex flex-row h-12 w-full items-center'>
            <View className='bg-muted items-center justify-center h-10 w-10 rounded-lg mr-4'>
                <Ionicons name={props?.icon as any} color={Colors[theme].tint} size={18} />
            </View>
            <View className={`${!props?.disableLine && 'border-b-[0.05rem] border-accent'} flex h-full flex-1 flex-row items-center pr-4`}>
                <Text className='flex-1 text-xl text-foreground'>{props.title}</Text>
                <Text className='text-xl text-primary'>{props.value}</Text>
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
        <View className='flex flex-1 px-4 bg-background'>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}>

                <View className='bg-item pl-4 py-1 rounded-2xl mt-4'>
                    <SettingItem
                        title='Todos'
                        icon='albums'
                        value={todos?.length.toString()} />
                    <SettingItem
                        title='Priority'
                        icon='flag'
                        value={priorityOptions?.length.toString()}
                        onPress={onOpenPriority} />
                    <SettingItem
                        title='Labels'
                        icon='bookmarks'
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