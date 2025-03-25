export function dateFormatter(date: Date) {
    console.log(date);
    const { format } = new Intl.DateTimeFormat("pt-BR");
    return format(date);
}