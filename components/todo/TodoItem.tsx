import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Checkbox from '../Checkbox';
import { TodoDto } from '@/types/type';
import { format } from 'date-fns';

export interface TodoItemProps {
    item: TodoDto;
    index: number;
    onPress: (item: TodoDto) => void;
    onToggleComplete: (id: string, complete: boolean) => void;
};

const TodoItem = (props: TodoItemProps) => {
    const { item } = props;

    const onPress = () => {
        props.onPress(item);
    };

    const onToggle = (complete: boolean) => {
        props.onToggleComplete(item.id, complete);
    };

    const renderLabels = () => {
        if (!item?.labelItem || item?.labelItem?.length === 0) {
            return null;
        }

        if (item?.labelItem?.length > 3) {
            return (
                <View className='flex flex-row gap-x-2 my-1'>
                    {item?.labelItem?.slice(0, 3).map((label, index) => (
                        <View key={index} className='flex items-center justify-center px-2 py-1 rounded-md' style={{ backgroundColor: label?.backgroundColor }}>
                            <Text className='text-sm text-gray-800'>{label?.label}</Text>
                        </View>
                    ))}

                    <View className='flex items-center justify-center px-2 py-1 rounded-md' style={{ backgroundColor: '#f1f5f9' }}>
                        <Text className='text-sm text-gray-800'>+{item?.labelItem?.length - 3}</Text>
                    </View>
                </View>
            );
        }

        return (
            <View className='flex flex-row gap-x-2 my-1'>
                {item?.labelItem?.map((label, index) => (
                    <View key={index} className='flex items-center justify-center px-2 py-1 rounded-md' style={{ backgroundColor: label?.backgroundColor }}>
                        <Text className='text-sm text-gray-800'>{label?.label}</Text>
                    </View>
                ))}
            </View>
        );
    };

    return (
        <View className='flex min-h-16 max-h-24 w-full bg-white'>
            <View className='flex w-full h-full px-3'>
                <Pressable onPress={onPress} style={styles.container}>
                    <View className='flex flex-row w-full items-center'>
                        <Checkbox value={Boolean(item?.complete)} onChange={onToggle} color={item?.priorityItem?.color} />

                        <View className='flex-1'>
                            <Text numberOfLines={2} className='text-lg'>{item?.title}</Text>
                            {item?.description && (
                                <Text numberOfLines={2} className='text-sm text-gray-500'>{item?.description}</Text>
                            )}
                        </View>
                    </View>

                    {(item?.label || item?.schedule)
                        ? <View className='flex flex-row w-full items-center'>
                            <View className='h-8 w-8' />
                            <View className='flex flex-1'>
                                {renderLabels()}
                            </View>

                            {item?.schedule && (
                                <View className='flex flex-row gap-x-2 my-1'>
                                    <Text className='text-sm text-slate-500 font-semibold italic'>{format(new Date(item?.schedule), 'EEE, dd MM')}</Text>
                                </View>
                            )}
                        </View>
                        : <></>
                    }
                </Pressable>
            </View>
        </View>
    );
};

export default TodoItem;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        borderBottomWidth: 0.5,
        borderBottomColor: '#BBBBBB',
        justifyContent: 'center',
    }
});