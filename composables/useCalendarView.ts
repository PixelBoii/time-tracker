type CalendarView = "day" | "month" | "report";

export function useCalendarView(): ComputedRef<CalendarView | null> {
    const route = useRoute();

    const views = {
        dashboard: "week" as CalendarView,
        "dashboard-day": "day" as CalendarView,
        "dashboard-report": "report" as CalendarView,
    } as Record<string, CalendarView>;

    const view = computed(() => {
        const routeName = route.name as string;

        return views[routeName];
    });

    return view;
}
