const dateOptions = { timeZone: "Asia/Jakarta" };
export const eventDateKey = (iso: string) =>
  new Intl.DateTimeFormat("en-CA", { ...dateOptions, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(iso));
export const eventDay = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { ...dateOptions, day: "2-digit" }).format(
    new Date(iso),
  );
export const eventMonth = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { ...dateOptions, month: "short" }).format(
    new Date(iso),
  );
export const eventTime = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    ...dateOptions,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
export const eventDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    ...dateOptions,
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
