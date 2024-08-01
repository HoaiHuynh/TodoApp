import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SelectTodo } from '@/db/schema';
import Checkbox from '../Checkbox';

interface TodoItemProps {
    item: SelectTodo;
    index: number;
    onPress: (item: SelectTodo) => void;
    onToggleComplete: (id: number, complete: boolean) => void;
};

const TodoItem = (props: TodoItemProps) => {
    const { item } = props;

    const onPress = () => {
        props.onPress(item);
    };

    const onToggle = (complete: boolean) => {
        props.onToggleComplete(item.id, complete);
    };

    return (
        <View className='flex flex-row h-20 w-full items-center mx-2 border-b border-neutral-300'>
            <Checkbox onChange={onToggle} />

            <TouchableOpacity className='flex-1' onPress={onPress}>
                <Text className='text-lg'>{item?.title}</Text>
                {item?.description && (
                    <Text className='text-sm text-gray-500'>{item?.description}</Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

export default TodoItem;