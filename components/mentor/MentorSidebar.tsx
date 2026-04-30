'use client';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Star, Languages, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CalendarComponent from '@/components/calendar/Calendar';
import { Mentor } from '@/types/mentorship';
import { useState } from 'react';

interface Props {
    mentor: Mentor;
    disponibilidades: { date: string; slots: { id: string; startTime: string; endTime: string }[] }[];
    selectedDate: string | null;
    currentMonth: string | null;
}

export default function MentorSidebar({ mentor, disponibilidades, selectedDate, currentMonth }: Props) {
    const [selectedSlotIds, setSelectedSlotIds] = useState<string[]>([]);

    const toggleSlot = (id: string) => {
        setSelectedSlotIds(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
    };

    return (
        <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
                {/* Card de perfil */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
                    <div className="relative h-64 w-full mb-4">
                        <Image
                            src={mentor.foto_url}
                            alt={mentor.nome_completo}
                            fill
                            className="object-cover rounded-lg"
                        />
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-muted-foreground dark:text-white">
                            {mentor.nome_completo}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 mb-2">
                            {mentor.cargo} • {mentor.empresa}
                        </p>
                        <div className="flex items-center justify-center text-yellow-500 mb-4">
                            <Star className="w-5 h-5 fill-current" />
                            <span className="ml-1 font-medium">{mentor.media_rating.toFixed(1)}</span>
                            <span className="mx-2 text-gray-300">•</span>
                            <span className="text-gray-600 dark:text-gray-400">
                                {mentor.experiencia_total_anos} anos
                            </span>
                        </div>
                        <div className="space-y-2 mb-6">
                            <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
                                <MapPin className="w-4 h-4 mr-2" />
                                {mentor.localizacao}
                            </div>
                            <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
                                <Languages className="w-4 h-4 mr-2" />
                                {mentor.idiomas.join(', ')}
                            </div>
                        </div>
                        <div className="mb-6">
                            <span className="text-3xl font-bold text-secondary">
                                MT {mentor.preco_hora.toFixed(2)}
                            </span>
                            <span className="text-gray-500 ml-1">/hora</span>
                        </div>
                    </div>
                </div>

                {/* Card do calendário */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
                    <div className="flex items-center gap-2 mb-4">
                        <Calendar className="w-4 h-4 text-secondary" />
                        <h3 className="font-semibold">Disponibilidade</h3>
                    </div>
                    <CalendarComponent
                        disponibilidades={disponibilidades}
                        selectedDate={selectedDate}
                        currentMonth={currentMonth}
                        selectedSlotIds={selectedSlotIds}
                        onToggleSlot={toggleSlot}
                    />
                    <Link href={`/mentor/${mentor.id}/agendar?slots=${selectedSlotIds.join(',')}`}>
                        <Button disabled={selectedSlotIds.length === 0} className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
                            {selectedSlotIds.length > 0 ? `Agendar ${selectedSlotIds.length} sessão(ões)` : 'Selecione horários'}
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}