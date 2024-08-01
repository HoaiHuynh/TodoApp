export interface DateOption {
    label: string;
    value: Date | null;
    icon: string;
    color: string;
}

export interface ComboOptions<T = string> {
    label: string;
    value: T;
    icon: string;
    color: string;
    backgroundColor?: string;
}

export type ThemeType = 'light' | 'dark';

export type PriorityType = 'low' | 'medium' | 'high';