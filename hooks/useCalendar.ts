import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import * as Calendar from 'expo-calendar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addHours } from 'date-fns';
import { generateUUID } from '@/utils/AppUtil';
import { APP_CALENDAR_EVENT } from '@/constants/AppConstants';
import { TodoDto } from '@/types/type';

const useCalendar = () => {
    const [calendarId, setCalendarId] = useState<string | null | undefined>(null);

    useEffect(() => {
        (async () => {
            const currentCalendarId = await AsyncStorage.getItem('calendarId');
            if (currentCalendarId) {
                setCalendarId(currentCalendarId);
            }
        })();
    }, []);

    const setCalendarIdToStorage = async (id: string) => {
        await AsyncStorage.setItem('calendarId', id);
        setCalendarId(id);
    };

    const requestPermission = async () => {
        const { status } = await Calendar.requestCalendarPermissionsAsync();

        if (status === 'granted') {
            const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);

            const appEvent = calendars.find((item) => item.title === APP_CALENDAR_EVENT);

            if (!appEvent) {
                createCalendar();
            }
            else {
                setCalendarIdToStorage(appEvent?.id);
            }
        }
    };

    async function getDefaultCalendarSource() {
        const defaultCalendar = await Calendar.getDefaultCalendarAsync();
        return defaultCalendar.source;
    }

    const androidCalendarSource: Calendar.Source = {
        isLocalAccount: true,
        name: APP_CALENDAR_EVENT,
        id: generateUUID(),
        type: 'LOCAL'
    };

    const createCalendar = async () => {
        const defaultCalendarSource =
            Platform.OS === 'ios'
                ? await getDefaultCalendarSource()
                : androidCalendarSource;

        const newCalendarID = await Calendar.createCalendarAsync({
            title: APP_CALENDAR_EVENT,
            color: 'blue',
            entityType: Calendar.EntityTypes.EVENT,
            sourceId: defaultCalendarSource?.id,
            source: defaultCalendarSource,
            name: 'internalCalendarName',
            ownerAccount: 'personal',
            accessLevel: Calendar.CalendarAccessLevel.OWNER,
        });

        setCalendarIdToStorage(newCalendarID);
    };

    const createEvent = async (todo: TodoDto, date: Date) => {
        if (!calendarId) {
            return;
        }

        const eventId = await Calendar.createEventAsync(calendarId, {
            alarms: [{ relativeOffset: -5, method: Calendar.AlarmMethod.ALERT }],
            title: todo?.title || 'Todo Event',
            notes: todo?.description || 'Todo Description',
            allDay: false,
            calendarId: calendarId,
            creationDate: new Date(),
            startDate: new Date(date),
            endDate: addHours(new Date(date), 1)
        });

        return eventId;
    };

    return { createCalendar, createEvent, requestPermission };
};

export default useCalendar;