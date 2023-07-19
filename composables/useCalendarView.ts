type CalendarView = 'day' | 'month';

export function useCalendarView(): ComputedRef<CalendarView | null> {
    const route = useRoute();

    const views = {
        'dashboard-day': 'day' as CalendarView,
        'dashboard': 'week' as CalendarView,
    } as Record<string, CalendarView>;

    const view = computed(() => {
        const routeName = route.name as string;

        return views[routeName];
    });

    return view;
}