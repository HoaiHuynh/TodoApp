import { addDays, endOfWeek } from 'date-fns';
import { ComboOptions, DateOption } from '@/types/type';

export const APP_CALENDAR_EVENT = 'TodoApp';

export const dateOptions: DateOption[] = [
    { label: 'Today', value: new Date(), icon: 'calendar-clear-outline', color: '#16a34a' },
    { label: 'Tomorrow', value: addDays(new Date(), 1), icon: 'sunny-outline', color: '#fbbf24' },
    { label: 'This Weekend', value: endOfWeek(new Date()), icon: 'bed-outline', color: '#f87171' },
    { label: 'No Date', value: null, icon: 'remove-circle-outline', color: '#94a3b8' },
];


export const priorityOptions: ComboOptions<number>[] = [
    { label: 'Low', value: 3, icon: 'flag-outline', color: '#16a34a' },
    { label: 'Medium', value: 2, icon: 'flag-outline', color: '#fbbf24' },
    { label: 'High', value: 1, icon: 'flag-outline', color: '#f87171' },
];

export const labelOptions: ComboOptions[] = [
    { label: 'Personal', value: 'personal', icon: 'person-circle-outline', color: '#16a34a', backgroundColor: '#f0fff4' },
    { label: 'Work', value: 'work', icon: 'briefcase-outline', color: '#fbbf24', backgroundColor: '#fffbdd' },
    { label: 'Study', value: 'study', icon: 'school-outline', color: '#f87171', backgroundColor: '#fef2f2' },
    { label: 'Shopping', value: 'shopping', icon: 'cart-outline', color: '#3b82f6', backgroundColor: '#eff6ff' },
    { label: 'Home', value: 'home', icon: 'home-outline', color: '#f472b6', backgroundColor: '#fef5f7' },
    { label: 'Health', value: 'health', icon: 'heart-outline', color: '#f59e0b', backgroundColor: '#fffbeb' },
    { label: 'Finance', value: 'finance', icon: 'wallet-outline', color: '#10b981', backgroundColor: '#f0fdf4' },
    { label: 'Entertainment', value: 'entertainment', icon: 'film-outline', color: '#3b82f6', backgroundColor: '#eff6ff' },
    { label: 'Other', value: 'other', icon: 'ellipsis-horizontal-circle-outline', color: '#94a3b8', backgroundColor: '#f4f4f5' },
];