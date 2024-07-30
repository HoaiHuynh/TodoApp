import { FlatList, ListRenderItemInfo, View } from 'react-native';
import { Stack } from 'expo-router';
import { format } from 'date-fns';
import { useEditTodoActions, useTodos } from '@/hooks/useTodoStore';
import { SelectTodo } from '@/db/schema';
import TodoItem from '@/components/todo/TodoItem';
import CreateUpdateTodoModal, { CreateUpdateTodoModalRef } from '@/components/todo/CreateUpdateTodoModal';
import { useRef } from 'react';

export default function HomeScreen() {

    const createUpdateTodoModalRef = useRef<CreateUpdateTodoModalRef>(null);

    const todos = useTodos();
    const today = format(new Date(), 'dd MMM');
    const { saveTodo } = useEditTodoActions();

    const onEditTodo = (todo: SelectTodo) => {
        createUpdateTodoModalRef.current?.show(`${todo.id}`);
    };

    const renderItem = ({ item, index }: ListRenderItemInfo<SelectTodo>) => {
        return (
            <TodoItem item={item} index={index} onPress={onEditTodo} />
        );
    };

    return (
        <View className='flex flex-1'>
            <Stack.Screen options={{ headerLargeTitle: true, title: `Today, ${today}` }} />

            <FlatList
                data={todos}
                renderItem={renderItem}
                keyExtractor={(item, index) => `${item?.id}-${index}`} />

            <CreateUpdateTodoModal ref={createUpdateTodoModalRef} />
        </View>
    );
};
