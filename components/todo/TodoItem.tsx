import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SelectTodo } from '@/db/schema';

interface TodoItemProps {
    item: SelectTodo;
    index: number;
    onPress: (item: SelectTodo) => void;
};

const TodoItem = (props: TodoItemProps) => {
    const { index, item } = props;

    const onPress = () => {
        props.onPress(item);
    };

    return (
        <View className='flex flex-row h-20 w-full items-center'>
            <TouchableOpacity>
                <View style={styles.checkbox}>
                </View>
            </TouchableOpacity>

            <TouchableOpacity className='flex-1' onPress={onPress}>
                <Text className='text-lg'>{item?.title}</Text>
            </TouchableOpacity>
        </View>
    );
};

export default TodoItem;

const styles = StyleSheet.create({
    checkbox: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'black',
        marginRight: 10
    },
});