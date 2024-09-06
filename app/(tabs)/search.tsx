import React, { useRef, useState } from 'react';
import { ListRenderItemInfo, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { Stack } from 'expo-router';
import Toast from 'react-native-toast-message';
import CreateUpdateTodoModal, { CreateUpdateTodoModalRef } from '@/components/todo/CreateUpdateTodoModal';
import { useEditTodoActions, useRecentTodos, useSearchActions, useSearchTodos } from '@/hooks/useTodoStore';
import { TodoDto } from '@/types/type';
import SwipeableTodoItem from '@/components/todo/SwipeableTodoItem';
import SearchInput from '@/components/SearchInput';
import EmptyTodos from '@/components/EmptyTodos';


const Search = () => {
    const recentTodos = useRecentTodos();
    const { toggleComplete, deleteTodo } = useEditTodoActions();

    const searchTodos = useSearchTodos();
    const { onChangeSearchText } = useSearchActions();

    const createUpdateTodoModalRef = useRef<CreateUpdateTodoModalRef>(null);

    const [isSearch, setIsSearch] = useState(false);

    const handleSearch = (text: string) => {
        if (text.length > 0) {
            setIsSearch(true);

            onChangeSearchText(text);
        }
        else {
            setIsSearch(false);
        }
    };

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
        <View className='flex flex-1 bg-background'>
            <Stack.Screen options={{
                headerLargeTitle: true,
                title: 'Search',
            }} />

            <View className='p-2 bg-background'>
                <SearchInput
                    debounceTime={350}
                    onChangeText={handleSearch} />
            </View>

            {!isSearch && (
                <View className='p-4'>
                    <Text className='text-lg text-gray-500'>Recent Todos</Text>
                </View>
            )}
            <View className='flex flex-1'>
                <Animated.FlatList
                    data={isSearch ? searchTodos : recentTodos}
                    renderItem={renderItem}
                    style={{ flex: 1 }}
                    contentContainerStyle={{ flexGrow: 1 }}
                    ListEmptyComponent={<EmptyTodos />}
                    keyExtractor={(item, index) => `${item?.id}-${index}`} />
            </View>

            <CreateUpdateTodoModal ref={createUpdateTodoModalRef} />
        </View>
    );
};

export default Search;