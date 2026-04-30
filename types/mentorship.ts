// types/mentorship.ts
export interface Mentor {
  id: string;
  user_id?: string;
  nome_completo: string;
  cargo: string;
  empresa: string;
  experiencia_total_anos: number;
  media_rating: number;
  preco_hora: number;
  localizacao: string;
  areas: string[];
  foto_url: string;
  bio: string;
  disponibilidades?: {
    id: string;
    mentor_id: string;
    data_hora_inicio: string;
    data_hora_fim: string;
    recorrente: boolean;
    dia_semana: number;
    duracao_slot: number;
    intervalo: number;
  }[];
  slots: AvailableSlot[];
  idiomas: string[];
  is_online: boolean;
  is_local: boolean;
}


export interface AvailableSlot {
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  isAvailable: boolean;
  id: string;
}

export interface MentorshipSession {
  id: string;
  mentorId: string;
  title: string;
  description: string;
  duration: number;
  price: number;
  type: 'one-time' | 'package' | 'ongoing';
  categories: string[];
}

export interface BookingFormData {
  mentorId: string;
  selectedDate: string;
  selectedTime: string;
  duration: number;
  sessionType: string;
  paymentMethod: 'mpesa' | 'emola' | 'comprovativo' | 'card';
  cardDetails?: CardDetails;
  phoneNumber?: string;
  studentId?: string;
  proofFile?: File;
}

export interface CardDetails {
  number: string;
  expiry: string;
  cvv: string;
  name: string;
}