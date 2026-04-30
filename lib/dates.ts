export function toLocalDateString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function parseLocalDate(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
}

export function formatDateLocal(dateString: string) {
    const date = parseLocalDate(dateString);
    return {
        day: date.getDate(),
        month: date.toLocaleDateString('pt-BR', { month: 'long' }),
        weekday: date.toLocaleDateString('pt-BR', { weekday: 'long' }),
        full: date.toLocaleDateString('pt-BR'),
    };
}