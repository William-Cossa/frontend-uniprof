import { getBookingById } from "@/lib/actions/agendamento-actions";
import { getCurrentUserProfile } from "@/lib/actions/auth-actions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import dynamic from "next/dynamic";

// Carregar VideoCall apenas no client (usa WebRTC/Socket.io)
const VideoCall = dynamic(() => import("@/components/video/VideoCall"), { ssr: false });

export const revalidate = 0;

export default async function SessaoPage({ params }: { params: { id: string } }) {
  const [userRes, bookingRes] = await Promise.all([
    getCurrentUserProfile(),
    getBookingById(params.id)
  ]);

  if (userRes.error || !userRes.data || bookingRes.error || !bookingRes.data) {
    redirect("/perfil");
  }

  const user = userRes.data;
  const booking = bookingRes.data;
  const token = cookies().get("uniprof_token")?.value;

  if (!token) {
    redirect("/perfil");
  }

  if (!booking.video_room_id) {
    return (
      <div className="container mx-auto p-6 max-w-4xl text-center mt-20">
        <h1 className="text-2xl font-bold mb-4">Sala de Reunião Indisponível</h1>
        <p className="text-muted-foreground mb-8">Esta mentoria ainda não possui uma sala de reunião gerada.</p>
        <Link href="/perfil" className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
          Voltar ao Perfil
        </Link>
      </div>
    );
  }

  if (booking.status !== "confirmado") {
    return (
      <div className="container mx-auto p-6 max-w-4xl text-center mt-20">
        <h1 className="text-2xl font-bold mb-4">Sessão Não Confirmada</h1>
        <p className="text-muted-foreground mb-8">Aguarde a confirmação do pagamento para aceder à sala de reunião.</p>
        <Link href="/perfil" className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
          Voltar ao Perfil
        </Link>
      </div>
    );
  }

  const dataInicio = new Date(booking.data_hora_inicio);
  const formattedDate = !isNaN(dataInicio.getTime()) ? dataInicio.toLocaleDateString('pt-BR') : '';
  const formattedTime = !isNaN(dataInicio.getTime()) ? dataInicio.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <div className="container mx-auto p-4 max-w-6xl min-h-screen flex flex-col">
      <header className="flex items-center gap-4 py-4 mb-4">
        <Link href="/perfil" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Link>
        <div>
          <h1 className="text-xl font-semibold">Mentoria com {booking.mentor?.nome_completo || 'Mentor'}</h1>
          {formattedDate && <p className="text-sm text-muted-foreground">
            {formattedDate} às {formattedTime}
          </p>}
        </div>
      </header>

      <main className="flex-1 w-full">
        <VideoCall
          agendamentoId={params.id}
          token={token}
          userName={user.nome_completo || user.email || "Participante"}
        />
      </main>
    </div>
  );
}
