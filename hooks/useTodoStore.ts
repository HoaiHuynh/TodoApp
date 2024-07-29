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
    }
}

const useTodoStore = create<TodoStore>((set) => {
    const fetchTodos = db.select().from(todos).orderBy(desc(todos.priority));

    try {
        return {
            todos: fetchTodos.all(),
            actions: {
                refetchTodos: () => set({ todos: fetchTodos.all() })
            }
        }
    } catch (error) {
        return {
            todos: [],
            actions: {
                refetchTodos: () => set({ todos: fetchTodos.all() })
            }
        }
    }
})

export const useTodos = () => useTodoStore((state) => state.todos);
export const useTodoActions = () => useTodoStore((state) => state.actions);

export type EditTodoModel = {
    title?: string;
    priority?: string;
    label?: string;
    schedule?: string;
    completed?: boolean
};

type EditTodoStore = {
    todo: EditTodoModel;
    actions: {
        onChangeTitle: (title: string) => void;
        onChangePriority: (priority: string) => void;
        onChangeLabel: (label: string) => void;
        onChangeSchedule: (schedule: string) => void;
        toggleComplete: (completed: boolean) => void;
        saveTodo: (id: string) => void;
        deleteTodo: (id: string) => void;
    }
}

const useEditTodoStore = create<EditTodoStore>((set, get) => ({
    todo: {
        title: '',
        priority: '',
        label: '',
        schedule: '',
        completed: false
    },
    actions: {
        onChangeTitle: (title) => set((state) => ({ todo: { ...state.todo, title } })),
        onChangePriority: (priority) => set((state) => ({ todo: { ...state.todo, priority } })),
        onChangeLabel: (label) => set((state) => ({ todo: { ...state.todo, label } })),
        onChangeSchedule: (schedule) => set((state) => ({ todo: { ...state.todo, schedule } })),
        toggleComplete: (completed) => set((state) => ({ todo: { ...state.todo, completed } })),
        saveTodo: (id) => {
            const { title, priority, label, schedule, completed } = get().todo;

            if (!title) {
                return;
            }

            db.insert(todos)
                .values({
                    id: Number(id),
                    title,
                    priority: Number(priority),
                    label,
                    schedule,
                    completed: completed ? 1 : 0,
                    createdAt: new Date().toISOString(),
                })
                .onConflictDoUpdate({
                    target: todos.id,
                    set: {
                        title,
                        priority: Number(priority),
                        label,
                        schedule,
                        completed: completed ? 1 : 0,
                        updatedAt: new Date().toISOString()
                    }
                })
                .run()

            set({ todo: { title: '', priority: '', label: '', schedule: '', completed: false } });

            useTodoStore.getState().actions.refetchTodos();
        },
        deleteTodo: (id) => {
            db.delete(todos)
                .where(eq(todos.id, Number(id)))
                .run();

            useTodoStore.getState().actions.refetchTodos()
        }
    }
}));

export const useEditTodo = () => useEditTodoStore((state) => state.todo);
export const useEditTodoActions = () => useEditTodoStore((state) => state.actions);