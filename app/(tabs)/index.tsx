import React, { useRef } from 'react';
import { ListRenderItemInfo, RefreshControl, View } from 'react-native';
import { Stack } from 'expo-router';
import { format } from 'date-fns';
import Toast from 'react-native-toast-message';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { useEditTodoActions, useTodoActions, useTodos } from '@/hooks/useTodoStore';
import CreateUpdateTodoModal, { CreateUpdateTodoModalRef } from '@/components/todo/CreateUpdateTodoModal';
import { TodoDto } from '@/types/type';
import SwipeableTodoItem from '@/components/todo/SwipeableTodoItem';

export default function HomeScreen() {
    const createUpdateTodoModalRef = useRef<CreateUpdateTodoModalRef>(null);

    const todos = useTodos();
    const { refetchTodos } = useTodoActions();
    const { toggleComplete, deleteTodo } = useEditTodoActions();
    const today = format(new Date(), 'dd MMM');

    const onEditTodo = (todo: TodoDto) => {
        createUpdateTodoModalRef.current?.show(`${todo.id}`);
    };

    const handleToggleComplete = (id: string, complete: boolean) => {
        toggleComplete(id, complete);
    };

    const handleDeleteTodo = (id: string) => {
        deleteTodo(id);

        Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Todo has been deleted'
        });
    };

    const renderItem = ({ item, index }: ListRenderItemInfo<TodoDto>) => {
        return (
            <Animated.View
                entering={FadeInDown.delay(index * 100)}
                exiting={FadeOutDown.delay(index * 100)}>
                <SwipeableTodoItem
                    item={item}
                    index={index}
                    onPress={onEditTodo}
                    onDelete={handleDeleteTodo}
                    onToggleComplete={handleToggleComplete} />
            </Animated.View>
        );
    };

    return (
        <View className='flex flex-1'>
            <Stack.Screen options={{ headerLargeTitle: true, title: `Today, ${today}` }} />

            <Animated.FlatList
                data={todos}
                renderItem={renderItem}
                refreshControl={<RefreshControl
                    refreshing={false}
                    onRefresh={refetchTodos} />}
                keyExtractor={(item, index) => `${item?.id}-${index}`} />

            <CreateUpdateTodoModal ref={createUpdateTodoModalRef} />
        </View>
    );
};