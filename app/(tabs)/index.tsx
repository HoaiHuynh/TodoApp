import { FlatList, ListRenderItemInfo, StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import { format } from 'date-fns';
import { useTodos } from '@/hooks/useTodoStore';
import { SelectTodo } from '@/db/schema';
import TodoItem from '@/components/todo/TodoItem';
import CreateUpdateTodoModal, { CreateUpdateTodoModalRef } from '@/components/todo/CreateUpdateTodoModal';
import { useRef } from 'react';
import FloatButton from '@/components/FloatButton';

export default function HomeScreen() {

    const createUpdateTodoModalRef = useRef<CreateUpdateTodoModalRef>(null);

    const todos = useTodos();
    const today = format(new Date(), 'dd MMM');

    const onEditTodo = (todo: SelectTodo) => {
        createUpdateTodoModalRef.current?.show(`${todo.id}`);
    };

    const onAddTodo = () => {
        createUpdateTodoModalRef.current?.show();
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

            <View style={styles.button}>
                <FloatButton onPress={onAddTodo} />
            </View>

            <CreateUpdateTodoModal ref={createUpdateTodoModalRef} />
        </View>
    );
};


const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        zIndex: 9999,
        height: 44,
        width: 44,
        borderRadius: 10,
        bottom: 20,
        right: 20
    }
});