import { desc, eq } from "drizzle-orm";
import { create } from "zustand";
import { db } from "@/db/client";
import { SelectTodo, todos } from "@/db/schema";

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
}

const useSearchStore = create<searchStore>((set) => ({
    searchText: '',
    actions: {
        onChangeSearchText: (text) => set({ searchText: text })
    }
}))

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
        }
    } catch (error) {
        return {
            todos: [],
            actions: {
                refetchTodos: () => set({ todos: fetchTodos.all() }),
                getTodo: (id) => fetchTodos.where(eq(todos.id, Number(id))).get()
            }
        }
    }
})

export const useTodos = () => useTodoStore((state) => state.todos);
export const useTodoActions = () => useTodoStore((state) => state.actions);

export const useTodo = (id?: string) => {
    if (!id) return DEFAULT_TODO;

    const todo = db.select().from(todos).where(eq(todos.id, Number(id))).get();

    return todo;
}

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
        onChangeTitle: (title: string) => void;
        onChangeDescription: (description: string) => void;
        onChangePriority: (priority: string) => void;
        onChangeLabel: (label: string) => void;
        onChangeSchedule: (schedule: string) => void;
        toggleComplete: (complete: boolean) => void;
        saveTodo: (id?: string) => void;
        deleteTodo: (id: string) => void;
    }
}

const useEditTodoStore = create<EditTodoStore>((set, get) => ({
    todo: DEFAULT_TODO,
    actions: {
        onChangeTitle: (title) => set((state) => ({ todo: { ...state.todo, title } })),
        onChangeDescription: (description) => set((state) => ({ todo: { ...state.todo, description } })),
        onChangePriority: (priority) => set((state) => ({ todo: { ...state.todo, priority } })),
        onChangeLabel: (label) => set((state) => ({ todo: { ...state.todo, label } })),
        onChangeSchedule: (schedule) => set((state) => ({ todo: { ...state.todo, schedule } })),
        toggleComplete: (complete) => set((state) => ({ todo: { ...state.todo, complete } })),
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