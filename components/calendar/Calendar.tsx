// components/calendar/Calendar.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { toLocalDateString, parseLocalDate, formatDateLocal } from '@/lib/dates';

interface CalendarProps {
    disponibilidades: { date: string; slots: { id: string; startTime: string; endTime: string }[] }[];
    selectedDate: string | null;
    currentMonth: string | null; // formato YYYY-MM
    selectedSlotIds: string[];
    onToggleSlot: (id: string) => void;
}

export default function CalendarComponent({ disponibilidades, selectedDate, currentMonth, selectedSlotIds, onToggleSlot }: CalendarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const availableDates = useMemo(() => new Set(disponibilidades.map(d => d.date)), [disponibilidades]);

    // Converte currentMonth (YYYY-MM) para objeto Date (mês de referência)
    const monthDate = useMemo(() => {
        if (currentMonth) {
            const [year, month] = currentMonth.split('-').map(Number);
            return new Date(year, month - 1, 1);
        }
        return new Date();
    }, [currentMonth]);

    // Gera os dias do calendário (sempre usando datas locais)
    const calendarDays = useMemo(() => {
        const year = monthDate.getFullYear();
        const month = monthDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const firstDayOfWeek = firstDay.getDay(); // 0 = domingo
        const days: { date: string; isCurrentMonth: boolean; isAvailable: boolean }[] = [];

        // Dias do mês anterior
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            const date = new Date(year, month - 1, prevMonthLastDay - i);
            days.push({
                date: toLocalDateString(date),
                isCurrentMonth: false,
                isAvailable: false,
            });
        }

        // Dias do mês atual
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const date = new Date(year, month, day);
            const dateString = toLocalDateString(date);
            days.push({
                date: dateString,
                isCurrentMonth: true,
                isAvailable: availableDates.has(dateString),
            });
        }

        // Dias do próximo mês (completar 42 células)
        const totalCells = 42;
        const remaining = totalCells - days.length;
        for (let day = 1; day <= remaining; day++) {
            const date = new Date(year, month + 1, day);
            days.push({
                date: toLocalDateString(date),
                isCurrentMonth: false,
                isAvailable: false,
            });
        }

        return days;
    }, [monthDate, availableDates]);

    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    const hasAvailabilityInMonth = () => {
        const year = monthDate.getFullYear();
        const month = monthDate.getMonth();
        return disponibilidades.some(avail => {
            const d = parseLocalDate(avail.date);
            return d.getFullYear() === year && d.getMonth() === month;
        });
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        let newMonth = new Date(monthDate);
        if (direction === 'prev') newMonth.setMonth(monthDate.getMonth() - 1);
        else newMonth.setMonth(monthDate.getMonth() + 1);
        const newMonthStr = `${newMonth.getFullYear()}-${String(newMonth.getMonth() + 1).padStart(2, '0')}`;
        const params = new URLSearchParams(searchParams.toString());
        params.set('month', newMonthStr);
        // Se a data selecionada não pertence ao novo mês, remove da URL
        if (selectedDate && !selectedDate.startsWith(newMonthStr)) {
            params.delete('date');
        }
        router.push(`?${params.toString()}`, { scroll: false });
    };

    const selectDate = (date: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('date', date);
        router.push(`?${params.toString()}`, { scroll: false });
    };

    // Sincroniza: se a data selecionada não está mais disponível, remove da URL
    useEffect(() => {
        if (selectedDate && !availableDates.has(selectedDate)) {
            const params = new URLSearchParams(searchParams.toString());
            params.delete('date');
            router.replace(`?${params.toString()}`, { scroll: false });
        }
    }, [selectedDate, availableDates, router, searchParams]);

    const selectedSlot = selectedDate ? disponibilidades.find(d => d.date === selectedDate) : null;

    return (
        <div>
            {/* Cabeçalho com navegação de mês */}
            <div className="flex items-center justify-between mb-4">
                <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')} className="h-8 w-8 p-0">
                    <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium min-w-32 text-center">
                    {monthNames[monthDate.getMonth()]} {monthDate.getFullYear()}
                </span>
                <Button variant="outline" size="sm" onClick={() => navigateMonth('next')} className="h-8 w-8 p-0">
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>

            {!hasAvailabilityInMonth() && (
                <div className="mb-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-xs text-yellow-700 dark:text-yellow-300 text-center">
                    Nenhuma disponibilidade neste mês
                </div>
            )}

            {/* Dias da semana */}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map(day => (
                    <div key={day} className="text-xs text-gray-500 dark:text-gray-400 text-center py-1 font-medium">
                        {day}
                    </div>
                ))}
            </div>

            {/* Grade de dias */}
            <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, idx) => {
                    const formatted = formatDateLocal(day.date);
                    const isSelected = selectedDate === day.date;
                    const isToday = (() => {
                        const today = new Date();
                        return toLocalDateString(today) === day.date;
                    })();
                    return (
                        <button
                            key={idx}
                            onClick={() => day.isAvailable && selectDate(day.date)}
                            disabled={!day.isAvailable}
                            className={`
                relative h-10 rounded-lg text-sm font-medium transition-all duration-200
                ${!day.isCurrentMonth
                                    ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                                    : day.isAvailable
                                        ? isSelected
                                            ? 'bg-primary text-primary-foreground shadow-md scale-105'
                                            : isToday
                                                ? 'bg-secondary text-white shadow-sm'
                                                : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:shadow-sm'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                }
              `}
                        >
                            {formatted.day}
                            {day.isAvailable && day.isCurrentMonth && (
                                <div className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${isSelected ? 'bg-primary-foreground' : 'bg-secondary'}`} />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Legenda */}
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-4">
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-secondary rounded-full" />
                    <span>Disponível</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full" />
                    <span>Indisponível</span>
                </div>
            </div>

            {/* Slots do dia selecionado */}
            {selectedSlot && (
                <div className="mt-4 p-4 bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/20">
                    <h4 className="text-sm font-semibold mb-3 text-gray-900 dark:text-white">
                        Horários disponíveis - {formatDateLocal(selectedSlot.date).weekday}, {formatDateLocal(selectedSlot.date).full}
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                        {selectedSlot.slots.map((slot) => {
                            const isSelected = selectedSlotIds.includes(slot.id);
                            return (
                                <div
                                    key={slot.id}
                                    onClick={() => onToggleSlot(slot.id)}
                                    className={`text-xs border py-2 px-3 rounded text-center font-medium transition-colors duration-200 cursor-pointer ${
                                        isSelected 
                                            ? 'bg-secondary text-white border-secondary' 
                                            : 'bg-white dark:bg-gray-700 border-secondary text-gray-600 dark:text-secondary-foreground hover:bg-secondary hover:text-white dark:hover:bg-secondary'
                                    }`}
                                >
                                    {slot.startTime}-{slot.endTime}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}