import { desc, eq } from 'drizzle-orm';
import { create } from 'zustand';
import { db } from '@/db/client';
import { SelectTodo, todos } from '@/db/schema';

type searchStore = {
    searchText: string;
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

const useSearchStore = create<searchStore>((set) => ({
    searchText: '',
    actions: {
        onChangeSearchText: (text) => set({ searchText: text })
    }
}));

export const useSearchText = () => useSearchStore((state) => state.searchText);
export const useSearchActions = () => useSearchStore((state) => state.actions);

type TodoStore = {
    todos: SelectTodo[];
    actions: {
        refetchTodos: () => void;
        getTodo: (id: string) => SelectTodo | undefined;
    }
}

const useTodoStore = create<TodoStore>((set) => {
    const fetchTodos = db.select().from(todos).orderBy(desc(todos.priority));

    try {
        return {
            todos: fetchTodos.all(),
            actions: {
                refetchTodos: () => set({ todos: fetchTodos.all() }),
                getTodo: (id) => fetchTodos.where(eq(todos.id, Number(id))).get()
            }
        };
    } catch (error) {
        return {
            todos: [],
            actions: {
                refetchTodos: () => set({ todos: fetchTodos.all() }),
                getTodo: (id) => fetchTodos.where(eq(todos.id, Number(id))).get()
            }
        };
    }
});

export const useTodos = () => useTodoStore((state) => state.todos);
export const useTodoActions = () => useTodoStore((state) => state.actions);

export const useTodo = (id?: string) => {
    if (!id) return DEFAULT_TODO;

    const todo = db.select().from(todos).where(eq(todos.id, Number(id))).get();

    return todo;
};

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
        onChangeTitle: (id: string | null | undefined, title: string) => void;
        onChangeDescription: (id: string | null | undefined, description: string) => void;
        onChangePriority: (id: string | null | undefined, priority: string) => void;
        onChangeLabel: (id: string | null | undefined, label: string) => void;
        onChangeSchedule: (id: string | null | undefined, schedule: string) => void;
        toggleComplete: (id: string | null | undefined, complete: boolean) => void;
        saveTodo: (id: string | null | undefined) => void;
        deleteTodo: (id: string | null | undefined) => void;
    }
}

const useEditTodoStore = create<EditTodoStore>((set, get) => ({
    todo: DEFAULT_TODO,
    actions: {
        onChangeTitle: (id, title) => {
            if (id) {
                db.update(todos)
                    .set({ title })
                    .where(eq(todos.id, Number(id)))
                    .run();

                useTodoStore.getState().actions.refetchTodos();
            }

            set((state) => ({ todo: { ...state.todo, title } }));
        },
        onChangeDescription: (id, description) => {
            if (id) {
                db.update(todos)
                    .set({ description })
                    .where(eq(todos.id, Number(id)))
                    .run();

                useTodoStore.getState().actions.refetchTodos();
            }

            set((state) => ({ todo: { ...state.todo, description } }));
        },
        onChangePriority: (id, priority) => {
            if (id) {
                db.update(todos)
                    .set({ priority: Number(priority) })
                    .where(eq(todos.id, Number(id)))
                    .run();

                useTodoStore.getState().actions.refetchTodos();
            }

            set((state) => ({ todo: { ...state.todo, priority } }));
        },
        onChangeLabel: (id, label) => {
            if (id) {
                db.update(todos)
                    .set({ label })
                    .where(eq(todos.id, Number(id)))
                    .run();

                useTodoStore.getState().actions.refetchTodos();
            }

            set((state) => ({ todo: { ...state.todo, label } }));
        },
        onChangeSchedule: (id, schedule) => {
            if (id) {
                db.update(todos)
                    .set({ schedule })
                    .where(eq(todos.id, Number(id)))
                    .run();

                useTodoStore.getState().actions.refetchTodos();
            }

            set((state) => ({ todo: { ...state.todo, schedule } }));
        },
        toggleComplete: (id, complete) => {
            if (id) {
                db.update(todos)
                    .set({ complete: complete ? 1 : 0 })
                    .where(eq(todos.id, Number(id)))
                    .run();

                useTodoStore.getState().actions.refetchTodos();
            }

            set((state) => ({ todo: { ...state.todo, complete } }));
        },
        saveTodo: (id) => {
            const { title, description, priority, label, schedule, complete } = get().todo;

            if (!title) {
                return;
            }

            db.insert(todos)
                .values({
                    id: Number(id),
                    title,
                    description,
                    priority: Number(priority),
                    label,
                    schedule,
                    complete: complete ? 1 : 0,
                    createdAt: new Date().toISOString(),
                })
                .onConflictDoUpdate({
                    target: todos.id,
                    set: {
                        title,
                        description,
                        priority: Number(priority),
                        label,
                        schedule,
                        complete: complete ? 1 : 0,
                        updatedAt: new Date().toISOString()
                    }
                })
                .run();

            set({ todo: DEFAULT_TODO });

            useTodoStore.getState().actions.refetchTodos();
        },
        deleteTodo: (id) => {
            db.delete(todos)
                .where(eq(todos.id, Number(id)))
                .run();

            useTodoStore.getState().actions.refetchTodos();
        }
    }
}));

export const useEditTodo = () => useEditTodoStore((state) => state.todo);
export const useEditTodoActions = () => useEditTodoStore((state) => state.actions);