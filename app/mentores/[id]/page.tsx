import { notFound } from 'next/navigation';
import Container from '@/components/Container';
import { fetchMentorProfile } from '@/lib/actions/mentor-actions';
import MentorSidebar from '@/components/mentor/MentorSidebar';
import MentorContent from '@/components/mentor/MentorContent';

interface Props {
  params: { id: string };
  searchParams: { date?: string; month?: string };
}

export default async function MentorPage({ params, searchParams }: Props) {
  const mentor = await fetchMentorProfile(params.id);
  if (!mentor) notFound();

  // Construir disponibilidades a partir dos slots (já ordenados no backend)
  const disponibilidades = (() => {
    const map = new Map<string, { id: string; startTime: string; endTime: string }[]>();
    for (const slot of mentor.slots) {
      if (!slot.isAvailable) continue; // usa isAvailable em vez de status
      const date = slot.date; // formato YYYY-MM-DD (local)
      const slotObj = { id: slot.id, startTime: slot.startTime, endTime: slot.endTime };
      const existing = map.get(date) || [];
      existing.push(slotObj);
      map.set(date, existing);
    }
    // Ordenar slots de cada data (caso o backend não garanta)
    for (const [date, slots] of map.entries()) {
      slots.sort((a, b) => a.startTime.localeCompare(b.startTime));
      map.set(date, slots);
    }
    return Array.from(map.entries())
      .map(([date, slots]) => ({ date, slots }))
      .sort((a, b) => a.date.localeCompare(b.date)); // ordenar por data
  })();

  // Definir data selecionada e mês atual a partir da URL (com fallbacks)
  let selectedDate = searchParams.date || null;
  let currentMonth = searchParams.month || null;

  if (!selectedDate && disponibilidades.length > 0) {
    selectedDate = disponibilidades[0].date;
  }
  if (!currentMonth && disponibilidades.length > 0) {
    currentMonth = disponibilidades[0].date.slice(0, 7); // YYYY-MM
  }

  return (
    <Container>
      <div className="py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <MentorSidebar
            mentor={mentor}
            disponibilidades={disponibilidades}
            selectedDate={selectedDate}
            currentMonth={currentMonth}
          />
          <MentorContent mentor={mentor} />
        </div>
      </div>
    </Container>
  );
}