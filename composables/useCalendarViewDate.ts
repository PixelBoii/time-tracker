import dayjs from "dayjs";

export function useCalendarViewDate() {
    const state = useState("calendarViewDate", () => dayjs().toISOString());

    const dateComputed = computed({
        get: () => dayjs(state.value),
        set: (value) => {
            state.value = value.toISOString();
        },
    });

    return dateComputed;
}
