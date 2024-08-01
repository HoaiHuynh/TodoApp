import { desc, eq, like } from 'drizzle-orm';
import { create } from 'zustand';
import { db } from '@/db/client';
import { SelectTodo, todos } from '@/db/schema';
import { labelOptions, priorityOptions } from '@/constants/AppConstants';
import { TodoDto } from '@/types/type';
import { generateUUID } from '@/utils/AppUtil';

//#region SEARCH_TODOS
type searchStore = {
    searchTodos: TodoDto[];
    actions: {
        onChangeSearchText: (text: string) => void;
    }
}

const DEFAULT_TODO = {
    title: undefined,
    description: undefined,
    priority: undefined,
    label: undefined,
    schedule: undefined,
    complete: false
};

const searchTodos = (text: string): TodoDto[] => {
    const fetchTodos = db.select().from(todos).where(like(todos.title, `%${text}%`)).orderBy(desc(todos.priority));

    return fetchTodos.all().map((todo) => {
        const priorityItem = todo.priority ? priorityOptions.find((item) => item.value === todo.priority) : undefined;
        const labelKeys = todo.label ? todo.label.split(',') : [];
        const labelItem = labelKeys?.length > 0 ? labelOptions?.filter((item) => labelKeys?.includes(item.value)) : [];

        return {
            ...todo,
            priorityItem,
            labelItem
        };
    });
};

const useSearchStore = create<searchStore>((set) => {
    return {
        searchTodos: [],
        actions: {
            onChangeSearchText: (text) => {
                const filterTodos = searchTodos(text);
                set({ searchTodos: filterTodos });
            }
        }
    };
});

export const useSearchTodos = () => useSearchStore((state) => state.searchTodos);
export const useSearchActions = () => useSearchStore((state) => state.actions);
//#endregion

//#region TODOS
type TodoStore = {
    todos: TodoDto[];
    actions: {
        refetchTodos: () => void;
        getTodo: (id: string) => TodoDto | undefined;
    }
}

const getAllTodos = () => {
    const fetchTodos = db.select().from(todos).orderBy(desc(todos.priority));

    const allTodos = fetchTodos.all();

    return allTodos?.map((todo) => {
        const priorityItem = todo.priority ? priorityOptions.find((item) => item.value === todo.priority) : undefined;
        const labelKeys = todo.label ? todo.label.split(',') : [];
        const labelItem = labelKeys?.length > 0 ? labelOptions?.filter((item) => labelKeys?.includes(item.value)) : [];

        return {
            ...todo,
            priorityItem,
            labelItem
        };
    });
};

const useTodoStore = create<TodoStore>((set) => {
    const fetchTodos = db.select().from(todos).orderBy(desc(todos.priority));

    try {
        return {
            todos: getAllTodos(),
            actions: {
                refetchTodos: () => set({ todos: getAllTodos() }),
                getTodo: (id) => fetchTodos.where(eq(todos.id, id)).get()
            }
        };
    } catch (error) {
        return {
            todos: [],
            actions: {
                refetchTodos: () => set({ todos: getAllTodos() }),
                getTodo: (id) => fetchTodos.where(eq(todos.id, id)).get()
            }
        };
    }
});

export const useTodos = () => useTodoStore((state) => state.todos);
export const useTodoActions = () => useTodoStore((state) => state.actions);

export const useTodo = (id?: string) => {
    if (!id) return DEFAULT_TODO;

    const todo = db.select().from(todos).where(eq(todos.id, id)).get();

    return todo;
};
//#endregion

//#region RECENT_TODOS
type RecentTodoStore = {
    recentTodos: TodoDto[];
    actions: {
        refetchRecentTodos: () => void;
    }
}

const getRecentTodos = (): TodoDto[] => {
    const fetchTodos = db.select().from(todos).orderBy(desc(todos.createdAt)).limit(5);

    return fetchTodos.all().map((todo) => {
        const priorityItem = todo.priority ? priorityOptions.find((item) => item.value === todo.priority) : undefined;
        const labelKeys = todo.label ? todo.label.split(',') : [];
        const labelItem = labelKeys?.length > 0 ? labelOptions?.filter((item) => labelKeys?.includes(item.value)) : [];

        return {
            ...todo,
            priorityItem,
            labelItem
        };
    });
};

const useRecentTodoStore = create<RecentTodoStore>((set) => {
    try {
        return {
            recentTodos: getRecentTodos(),
            actions: {
                refetchRecentTodos: () => set({ recentTodos: getRecentTodos() })
            }
        };
    } catch (error) {
        return {
            recentTodos: [],
            actions: {
                refetchRecentTodos: () => set({ recentTodos: getRecentTodos() })
            }
        };
    }
});

export const useRecentTodos = () => useRecentTodoStore((state) => state.recentTodos);
export const useRecentTodoActions = () => useRecentTodoStore((state) => state.actions);
//#endregion

//#region EDIT_TODO
export type EditTodoModel = {
    title?: string;
    description?: string;
    priority?: string;
    label?: string;
    schedule?: string;
    complete?: boolean
};

type EditTodoStore = {
    todo: EditTodoModel;
    actions: {
        onChangePriority: (id: string, priority: string) => void;
        onChangeLabel: (id: string, label: string) => void;
        onChangeSchedule: (id: string, schedule: string) => void;
        toggleComplete: (id: string, complete: boolean) => void;
        saveTodo: (id: string | null | undefined, todo: SelectTodo) => void;
        deleteTodo: (id: string) => void;
    }
}

const useEditTodoStore = create<EditTodoStore>((set, get) => ({
    todo: DEFAULT_TODO,
    actions: {
        // onChangeTitle: (id, title) => {
        //     if (id) {
        //         db.update(todos)
        //             .set({ title })
        //             .where(eq(todos.id, id))
        //             .run();

        //         useTodoStore.getState().actions.refetchTodos();
        //     }

        //     set((state) => ({ todo: { ...state.todo, title } }));
        // },
        // onChangeDescription: (id, description) => {
        //     if (id) {
        //         db.update(todos)
        //             .set({ description })
        //             .where(eq(todos.id, id))
        //             .run();

        //         useTodoStore.getState().actions.refetchTodos();
        //     }

        //     set((state) => ({ todo: { ...state.todo, description } }));
        // },
        onChangePriority: (id, priority) => {
            if (id) {
                db.update(todos)
                    .set({ priority: Number(priority) })
                    .where(eq(todos.id, id))
                    .run();

                useTodoStore.getState().actions.refetchTodos();
            }

            set((state) => ({ todo: { ...state.todo, priority } }));
        },
        onChangeLabel: (id, label) => {
            if (id) {
                db.update(todos)
                    .set({ label })
                    .where(eq(todos.id, id))
                    .run();

                useTodoStore.getState().actions.refetchTodos();
            }

            set((state) => ({ todo: { ...state.todo, label } }));
        },
        onChangeSchedule: (id, schedule) => {
            if (id) {
                db.update(todos)
                    .set({ schedule })
                    .where(eq(todos.id, id))
                    .run();

                useTodoStore.getState().actions.refetchTodos();
            }

            set((state) => ({ todo: { ...state.todo, schedule } }));
        },
        toggleComplete: (id, complete) => {
            if (id) {
                db.update(todos)
                    .set({ complete: complete ? 1 : 0 })
                    .where(eq(todos.id, id))
                    .run();

                useTodoStore.getState().actions.refetchTodos();
            }

            set((state) => ({ todo: { ...state.todo, complete } }));
        },
        saveTodo: (id, todo) => {
            const todoId = id || generateUUID();
            if (!todo?.title) {
                return;
            }

            db.insert(todos)
                .values({
                    id: todoId,
                    title: todo?.title,
                    description: todo?.description,
                    priority: Number(todo?.priority),
                    label: todo?.label,
                    schedule: todo?.schedule ? new Date(todo?.schedule).toISOString() : null,
                    complete: todo?.complete ? 1 : 0,
                    createdAt: new Date().toISOString(),
                })
                .onConflictDoUpdate({
                    target: todos.id,
                    set: {
                        title: todo?.title,
                        description: todo?.description,
                        priority: Number(todo?.priority),
                        label: todo?.label,
                        schedule: todo?.schedule ? new Date(todo?.schedule).toISOString() : null,
                        complete: todo?.complete ? 1 : 0,
                        updatedAt: new Date().toISOString()
                    }
                })
                .run();

            set({ todo: DEFAULT_TODO });

            useTodoStore.getState().actions.refetchTodos();
        },
        deleteTodo: (id) => {
            db.delete(todos)
                .where(eq(todos.id, id))
                .run();

            useTodoStore.getState().actions.refetchTodos();
        }
    }
}));

export const useEditTodo = () => useEditTodoStore((state) => state.todo);
export const useEditTodoActions = () => useEditTodoStore((state) => state.actions);
//#endregion