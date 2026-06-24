"use client"
import Container from '@/components/Container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Clock, Languages, Calendar, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { AvailableSlot, Mentor } from '@/types/mentorship';

interface Props {
  mentor: Mentor;
}

export default function MentorDetailClient({ mentor }: Props) {
  const reviewsRef = useRef<HTMLDivElement>(null);
  const [selectedSlots, setSelectedSlots] = useState<AvailableSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Build disponibilidades from slots for the calendar
  const disponibilidades = (() => {
    const map = new Map<string, AvailableSlot[]>();
    for (const slot of mentor.slots) {
      if (!slot.isAvailable) continue;
      const existing = map.get(slot.date) || [];
      existing.push(slot);
      map.set(slot.date, existing);
    }
    return Array.from(map.entries())
      .map(([date, slots]) => ({ date, slots }))
      .sort((a, b) => a.date.localeCompare(b.date));
  })();

  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    if (disponibilidades.length > 0) {
      const firstAvailableDate = new Date(disponibilidades[0].date);
      return new Date(firstAvailableDate.getFullYear(), firstAvailableDate.getMonth(), 1);
    }
    return new Date();
  });

  useEffect(() => {
    if (disponibilidades.length > 0 && !selectedDate) {
      setSelectedDate(disponibilidades[0].date);
    }
  }, [disponibilidades.length, selectedDate]);

  const generateCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const days = [];

    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({ date: date.toISOString().split('T')[0], isCurrentMonth: false, isAvailable: false });
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      const isAvailable = disponibilidades.some(a => a.date === dateString);
      days.push({ date: dateString, isCurrentMonth: true, isAvailable });
    }

    const totalCells = 42;
    const nextMonthDays = totalCells - days.length;
    for (let day = 1; day <= nextMonthDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({ date: date.toISOString().split('T')[0], isCurrentMonth: false, isAvailable: false });
    }

    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') newMonth.setMonth(prev.getMonth() - 1);
      else newMonth.setMonth(prev.getMonth() + 1);
      return newMonth;
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('pt-BR', { month: 'long' }),
      weekday: date.toLocaleDateString('pt-BR', { weekday: 'long' }),
      full: date.toLocaleDateString('pt-BR')
    };
  };

  const getAvailableSlotsForDate = (date: string) => {
    const availability = disponibilidades.find(a => a.date === date);
    return availability ? availability.slots : [];
  };

  const toggleSlot = (slot: AvailableSlot) => {
    setSelectedSlots(prev => {
      if (prev.find(s => s.id === slot.id)) {
        return prev.filter(s => s.id !== slot.id);
      }
      return [...prev, slot];
    });
  };

  const hasAvailabilityInCurrentMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    return disponibilidades.some(avail => {
      const date = new Date(avail.date);
      return date.getFullYear() === year && date.getMonth() === month;
    });
  };

  const findNextAvailableMonth = (direction: 'prev' | 'next') => {
    let year = currentMonth.getFullYear();
    let month = currentMonth.getMonth();
    let attempts = 0;
    while (attempts < 24) {
      if (direction === 'next') { month++; if (month > 11) { month = 0; year++; } }
      else { month--; if (month < 0) { month = 11; year--; } }
      const hasAvailability = disponibilidades.some(avail => {
        const date = new Date(avail.date);
        return date.getFullYear() === year && date.getMonth() === month;
      });
      if (hasAvailability) return new Date(year, month, 1);
      attempts++;
    }
    return currentMonth;
  };

  const calendarDays = generateCalendar();
  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <Container>
      <div className="py-8">
        <Link href="/mentores" className="text-primary hover:underline mb-6 inline-block">
          ← Voltar para mentores
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
                <div className="relative h-64 w-full mb-4">
                  <Image src={mentor.foto_url} alt={`Foto de ${mentor.nome_completo}`} fill className="object-cover rounded-lg" />
                </div>

                <div className="text-center">
                  <h1 className="text-2xl font-bold text-muted-foreground dark:text-white">{mentor.nome_completo}</h1>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">{mentor.cargo} • {mentor.empresa}</p>

                  <div className="flex items-center justify-center text-yellow-500 mb-4">
                    <Star className="w-5 h-5 fill-current" />
                    <span className="ml-1 font-medium">{mentor.media_rating.toFixed(1)}</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-gray-600 dark:text-gray-400">{mentor.experiencia_total_anos} anos</span>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4 mr-2" />{mentor.localizacao}
                    </div>
                    <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
                      <Languages className="w-4 h-4 mr-2" />{mentor.idiomas.join(', ')}
                    </div>
                  </div>

                  <div className="mb-6">
                    <span className="text-3xl font-bold text-secondary">MT {mentor.preco_hora.toFixed(2)}</span>
                    <span className="text-gray-500 ml-1">/hora</span>
                  </div>
                </div>
              </div>

              {/* Availability Calendar */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-secondary" />Disponibilidade
                  </h3>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setCurrentMonth(findNextAvailableMonth('prev'))} className="h-8 w-8 p-0">
                      <ChevronLeft className="w-4 h-4 text-secondary" />
                    </Button>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-32 text-center">
                      {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </span>
                    <Button variant="outline" size="sm" onClick={() => setCurrentMonth(findNextAvailableMonth('next'))} className="h-8 w-8 p-0">
                      <ChevronRight className="w-4 h-4 text-secondary" />
                    </Button>
                  </div>
                </div>

                {!hasAvailabilityInCurrentMonth() && (
                  <div className="mb-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-xs text-yellow-700 dark:text-yellow-300 text-center">
                    Nenhuma disponibilidade neste mês
                  </div>
                )}

                <div className="mb-4">
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {weekDays.map(day => (
                      <div key={day} className="text-xs text-gray-500 dark:text-gray-400 text-center py-1 font-medium">{day}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, index) => {
                      const formattedDate = formatDate(day.date);
                      const isSelected = selectedDate === day.date;
                      const isToday = new Date().toDateString() === new Date(day.date).toDateString();
                      return (
                        <button
                          key={index}
                          onClick={() => day.isAvailable && setSelectedDate(day.date)}
                          disabled={!day.isAvailable}
                          className={`
                            relative h-10 rounded-lg text-sm font-medium transition-all duration-200
                            ${!day.isCurrentMonth ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                              : day.isAvailable
                                ? isSelected ? 'bg-primary text-primary-foreground shadow-md scale-105'
                                  : isToday ? 'bg-secondary text-white shadow-sm'
                                    : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:shadow-sm'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                            }
                          `}
                        >
                          {formattedDate.day}
                          {day.isAvailable && day.isCurrentMonth && (
                            <div className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${isSelected ? 'bg-primary-foreground' : 'bg-secondary'}`} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-1"><div className="w-2 h-2 bg-secondary rounded-full"></div><span>Disponível</span></div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div><span>Indisponível</span></div>
                </div>

                {selectedDate && (
                  <div className="mt-4 p-4 bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/20">
                    <h4 className="text-sm font-semibold mb-3 text-gray-900 dark:text-white">
                      Horários disponíveis - {formatDate(selectedDate).weekday}, {formatDate(selectedDate).full}
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {getAvailableSlotsForDate(selectedDate).map((slot, index) => {
                        const isSelected = selectedSlots.some(s => s.id === slot.id);
                        return (
                          <div
                            key={index}
                            onClick={() => toggleSlot(slot)}
                            className={`text-xs py-2 px-3 rounded text-center font-medium transition-colors duration-200 cursor-pointer border ${isSelected
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
                <Link href={`/mentor/${mentor.id}/agendar?slots=${selectedSlots.map(s => s.id).join(',')}`}>
                  <Button disabled={selectedSlots.length === 0} className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
                    {selectedSlots.length > 0 ? `Agendar ${selectedSlots.length} sessão(ões)` : 'Selecione horários'}
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
              <h2 className="text-2xl font-bold mb-4">Sobre</h2>
              <div className="prose dark:prose-invert max-w-none">
                {mentor.bio.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-700 dark:text-gray-300">{paragraph}</p>
                ))}
              </div>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
              <h2 className="text-2xl font-bold mb-4">Áreas</h2>
              <div className="flex flex-wrap gap-2">
                {mentor.areas.map((category) => (
                  <Badge key={category} className="bg-primary text-primary-foreground px-3 py-1">{category}</Badge>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </Container>
  );
}