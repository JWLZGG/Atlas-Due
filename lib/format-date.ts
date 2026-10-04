const ATLAS_TIME_ZONE = "UTC";

const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: ATLAS_TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
});

export function formatAtlasDateTime(value: Date | string | number): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "unknown";
    }

    const parts = formatter.formatToParts(date);
    const get = (type: string) =>
        parts.find((part) => part.type === type)?.value ?? "";

    return `${get("day")}/${get("month")}/${get("year")}, ${get("hour")}:${get(
        "minute"
    )}:${get("second")} ${ATLAS_TIME_ZONE}`;
}