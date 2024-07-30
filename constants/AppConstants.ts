import { addDays, endOfWeek } from "date-fns";
import { DateOption } from "@/types/type";

export const dateOptions: DateOption[] = [
    { label: 'Today', value: new Date(), icon: 'calendar-clear-outline', color: '#16a34a' },
    { label: 'Tomorrow', value: addDays(new Date(), 1), icon: 'sunny-outline', color: '#fbbf24' },
    { label: 'This Weekend', value: endOfWeek(new Date()), icon: 'bed-outline', color: '#f87171' },
    { label: 'No Date', value: null, icon: 'remove-circle-outline', color: '#94a3b8' },
];