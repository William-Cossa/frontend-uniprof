import { getMenteeBookings } from '@/lib/actions/agendamento-actions';
import { getCurrentUserProfile } from '@/lib/actions/auth-actions';
import { ProfileView } from '@/components/profile/ProfileView';

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
    // Buscar os dados reais no servidor
    const [userRes, bookingsRes] = await Promise.all([
        getCurrentUserProfile(),
        getMenteeBookings()
    ]);

    const initialUser = userRes.data || null;
    const initialBookings = bookingsRes.data || [];

    // Mapear os dados de agendamentos para o formato Booking do front-end
    // Campos reais do DB: data_hora_inicio, data_hora_fim, duracao_minutos, preco, status, mentor_id
    // Associação eager-loaded: mentor { nome_completo, foto_url, cargo }
    const formattedBookings = initialBookings.map((b: any) => {
        const inicio = b.data_hora_inicio ? new Date(b.data_hora_inicio) : null;
        const fim = b.data_hora_fim ? new Date(b.data_hora_fim) : null;
        const inicioValid = inicio && !isNaN(inicio.getTime());
        const fimValid = fim && !isNaN(fim.getTime());

        return {
            id: b.id,
            mentorId: b.mentor_id,
            mentorName: b.mentor?.nome_completo || 'Mentor',
            mentorAvatar: b.mentor?.foto_url || '/images/avatar.jpg',
            mentorTitle: b.mentor?.cargo || 'Mentor Profissional',
            date: inicioValid ? inicio.toISOString().split('T')[0] : 'Data Indisponível',
            startTime: inicioValid ? inicio.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '--:--',
            endTime: fimValid ? fim.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '--:--',
            duration: b.duracao_minutos || 0,
            status: b.status === "confirmado" ? "confirmed" : 
                    b.status === "cancelado" ? "cancelled" : 
                    b.status === "concluido" ? "completed" : "pending",
            price: Number(b.preco) || 0,
            paymentMethod: "mpesa",
            meetingLink: b.video_room_id,
            notes: b.motivo_cancelamento
        };
    });

    return <ProfileView initialUser={initialUser} initialBookings={formattedBookings} />;
}