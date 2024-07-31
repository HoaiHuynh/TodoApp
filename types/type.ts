export interface DateOption {
    label: string;
    value: Date | null;
    icon: string;
    color: string;
}

export interface ComboOptions {
    label: string;
    value: string;
    icon: string;
    color: string;
}

export type ThemeType = 'light' | 'dark';

export type PriorityType = 'low' | 'medium' | 'high';