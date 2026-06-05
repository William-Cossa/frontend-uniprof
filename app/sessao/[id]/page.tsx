import { getBookingById, validarTokenSessao } from "@/lib/actions/agendamento-actions";
import { getCurrentUserProfile } from "@/lib/actions/auth-actions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import dynamic from "next/dynamic";

// Carregar VideoCall apenas no client (usa WebRTC/Socket.io)
const VideoCall = dynamic(() => import("@/components/video/VideoCall"), { ssr: false });

export const revalidate = 0;

interface SessaoPageProps {
  params: { id: string };
  searchParams: { t?: string };
}

export default async function SessaoPage({ params, searchParams }: SessaoPageProps) {
  const agendamentoId = params.id;
  const sessionToken = searchParams.t;

  // ─────────────────────────────────────────────────────────────
  // MODO 1: Acesso via token de sessão (link gerado para mentor)
  // ─────────────────────────────────────────────────────────────
  if (sessionToken) {
    const validationRes = await validarTokenSessao(sessionToken, agendamentoId);

    if (validationRes.error || !validationRes.data) {
      return <SessaoErro mensagem={validationRes.error || "O link de sessão é inválido ou expirou."} />;
    }

    // Tentar buscar detalhes do agendamento (pode falhar se não tiver cookie)
    // Não bloqueia — apenas enriquece a UI com info contextual
    let booking: any = null;
    try {
      const bookingRes = await getBookingById(agendamentoId);
      if (!bookingRes.error && bookingRes.data) {
        booking = bookingRes.data;
      }
    } catch {
      // Ignorar — o mentor pode não ter cookie; o session token é suficiente
    }

    const dataInicio = booking?.data_hora_inicio ? new Date(booking.data_hora_inicio) : null;
    const formattedDate = dataInicio && !isNaN(dataInicio.getTime())
      ? dataInicio.toLocaleDateString("pt-BR")
      : null;
    const formattedTime = dataInicio && !isNaN(dataInicio.getTime())
      ? dataInicio.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
      : null;

    const mentorName = booking?.mentor?.nome_completo || null;
    const role = validationRes.data.role;

    return (
      <div className="container mx-auto p-4 max-w-6xl min-h-screen flex flex-col">
        <header className="flex items-center gap-4 py-4 mb-4">
          <Link
            href="/"
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold">
              {mentorName ? `Mentoria com ${mentorName}` : "Sessão de Mentoria"}
            </h1>
            {formattedDate && formattedTime && (
              <p className="text-sm text-muted-foreground">
                {formattedDate} às {formattedTime}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-0.5 capitalize">
              A entrar como: <span className="font-medium">{role}</span>
            </p>
          </div>
        </header>

        <main className="flex-1 w-full">
          <VideoCall
            agendamentoId={agendamentoId}
            token=""
            sessionToken={sessionToken}
            userName={role === "mentor" ? (mentorName || "Mentor") : "Participante"}
          />
        </main>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // MODO 2: Acesso normal — utilizador autenticado via cookie
  // ─────────────────────────────────────────────────────────────
  const [userRes, bookingRes] = await Promise.all([
    getCurrentUserProfile(),
    getBookingById(agendamentoId),
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
      <SessaoErro
        titulo="Sala de Reunião Indisponível"
        mensagem="Esta mentoria ainda não possui uma sala de reunião gerada."
        href="/perfil"
        hrefLabel="Voltar ao Perfil"
      />
    );
  }

  if (booking.status !== "confirmado") {
    return (
      <SessaoErro
        titulo="Sessão Não Confirmada"
        mensagem="Aguarde a confirmação do pagamento para aceder à sala de reunião."
        href="/perfil"
        hrefLabel="Voltar ao Perfil"
      />
    );
  }

  const dataInicio = new Date(booking.data_hora_inicio);
  const formattedDate = !isNaN(dataInicio.getTime())
    ? dataInicio.toLocaleDateString("pt-BR")
    : "";
  const formattedTime = !isNaN(dataInicio.getTime())
    ? dataInicio.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <div className="container mx-auto p-4 max-w-6xl min-h-screen flex flex-col">
      <header className="flex items-center gap-4 py-4 mb-4">
        <Link
          href="/perfil"
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Link>
        <div>
          <h1 className="text-xl font-semibold">
            Mentoria com {booking.mentor?.nome_completo || "Mentor"}
          </h1>
          {formattedDate && (
            <p className="text-sm text-muted-foreground">
              {formattedDate} às {formattedTime}
            </p>
          )}
        </div>
      </header>

      <main className="flex-1 w-full">
        <VideoCall
          agendamentoId={agendamentoId}
          token={token}
          userName={user.nome_completo || user.email || "Participante"}
        />
      </main>
    </div>
  );
}

// ─── Componente de erro reutilizável ───────────────────────────
function SessaoErro({
  titulo = "Acesso Negado",
  mensagem,
  href = "/",
  hrefLabel = "Voltar ao Início",
}: {
  titulo?: string;
  mensagem: string;
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <div className="container mx-auto p-6 max-w-md text-center mt-20">
      <div className="flex justify-center mb-6">
        <ShieldAlert className="w-16 h-16 text-red-400" />
      </div>
      <h1 className="text-2xl font-bold mb-3">{titulo}</h1>
      <p className="text-muted-foreground mb-8">{mensagem}</p>
      <Link
        href={href}
        className="px-5 py-2.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      >
        {hrefLabel}
      </Link>
    </div>
  );
}
