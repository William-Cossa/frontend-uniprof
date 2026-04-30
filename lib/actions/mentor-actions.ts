"use server";

const API_URL = process.env.API_BASE_URL;

export interface MentorFromAPI {
  id: string;
  user_id: string;
  nome_completo: string;
  email?: string;
  contacto?: string;
  bio: string;
  experiencia_total_anos: number;
  preco_hora: number;
  foto_url: string;
  media_rating: number;
  is_aprovado: boolean;
  cargo: string;
  empresa: string;
  localizacao: string;
  idiomas: string[] | string;
  is_online: boolean;
  is_local: boolean;
  areas?: { id: string; nome: string; descricao: string }[];
  disponibilidades?: {
    id: string;
    mentor_id: string;
    data_hora_inicio: string;
    data_hora_fim: string;
    recorrente: boolean;
    dia_semana: number;
    duracao_slot: number;
    intervalo: number;
    slots: {
      id: string;
      mentor_id: string;
      data_hora_inicio: string;
      data_hora_fim: string;
      status: "livre" | "reservado";
    }[];
  }[];
}

export interface AreaMentoriaFromAPI {
  id: string;
  nome: string;
  descricao: string;
}

function normalizeMentor(raw: MentorFromAPI) {
  return {
    ...raw,
    preco_hora: Number(raw.preco_hora) || 0,
    media_rating: Number(raw.media_rating) || 0,
    idiomas: typeof raw.idiomas === "string" ? JSON.parse(raw.idiomas) : (raw.idiomas ?? []),
    areas: (raw.areas ?? []).map((a) => a.nome),
    slots: (raw.disponibilidades ?? [])
      .flatMap((d) => d.slots ?? [])
      .map((s) => ({
        id: s.id,
        date: s.data_hora_inicio.split("T")[0],
        startTime: new Date(s.data_hora_inicio).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        endTime: new Date(s.data_hora_fim).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        isAvailable: s.status === "livre",
      })),
    foto_url: raw.foto_url || "/images/mentorhero.jpg",
    cargo: raw.cargo || "",
    empresa: raw.empresa || "",
    localizacao: raw.localizacao || "",
  };
}

export async function fetchMentores() {
  try {
    const res = await fetch(`${API_URL}/mentores`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];

    const data: MentorFromAPI[] = await res.json();
    return data.filter((m) => m.is_aprovado).map(normalizeMentor);
  } catch (error) {
    console.error("Erro ao buscar mentores:", error);
    return [];
  }
}

export async function fetchMentorProfile(id: string) {
  try {
    const res = await fetch(`${API_URL}/mentores/${id}/perfil`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;

    const data: MentorFromAPI = await res.json();
    return normalizeMentor(data);
  } catch (error) {
    console.error("Erro ao buscar perfil do mentor:", error);
    return null;
  }
}

export async function fetchAreasMentoria() {
  try {
    const res = await fetch(`${API_URL}/areas-mentoria`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) return [];

    const data: AreaMentoriaFromAPI[] = await res.json();
    return data.map((a) => a.nome);
  } catch (error) {
    console.error("Erro ao buscar áreas:", error);
    return [];
  }
}
