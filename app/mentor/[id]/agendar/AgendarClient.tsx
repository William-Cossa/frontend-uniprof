'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Container from '@/components/Container';
import { Button } from '@/components/ui/button';
import { Mentor, BookingFormData } from '@/types/mentorship';
import { ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { PaymentMethod } from '@/components/mentor/PaymentMethod';
import { createAgendamento, calcularPreco } from '@/lib/actions/agendamento-actions';
import { toast } from 'sonner';

interface Props {
  mentor: Mentor;
}

export default function AgendarClient({ mentor }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slotIds = searchParams.get('slots')?.split(',').filter(Boolean) || [];

  const selectedSlots = useMemo(() => {
    return mentor.slots.filter(s => slotIds.includes(s.id));
  }, [mentor.slots, slotIds]);

  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingFormData>({
    mentorId: mentor.id,
    selectedDate: '',
    selectedTime: '',
    duration: 60,
    sessionType: 'one-time',
    paymentMethod: 'mpesa',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [priceData, setPriceData] = useState<{ preco: number; duracaoMinutos: number } | null>(null);
  const [priceLoading, setPriceLoading] = useState(false);

  useEffect(() => {
    if (slotIds.length === 0) return;
    setPriceLoading(true);
    calcularPreco({ mentor_id: mentor.id, slot_ids: slotIds })
      .then((result) => {
        if (result.data) {
          setPriceData({ preco: result.data.preco, duracaoMinutos: result.data.duracaoMinutos });
        } else if (result.error) {
          toast.error(result.error);
        }
      })
      .finally(() => setPriceLoading(false));
  }, [mentor.id, slotIds.join(',')]);

  const handlePaymentMethodChange = (method: string) => {
    setBookingData(prev => ({ ...prev, paymentMethod: method as BookingFormData['paymentMethod'] }));
  };

  const handleConfirmBooking = async () => {
    if (bookingData.paymentMethod === 'mpesa' && !bookingData.phoneNumber?.trim()) {
      toast.error('Introduza o número de telefone para pagamento M-Pesa.');
      setStep(1);
      return;
    }

    setIsProcessing(true);

    const result = await createAgendamento({
      mentor_id: mentor.id,
      slot_ids: slotIds,
      paymentMethod: bookingData.paymentMethod,
      phoneNumber: bookingData.phoneNumber
    });

    setIsProcessing(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    setIsSuccess(true);
    setTimeout(() => { router.push('/mentores'); }, 3000);
  };

  if (isSuccess) {
    return (
      <Container>
        <div className="min-h-screen flex items-center justify-center py-12">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Sessão Agendada com Sucesso!</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              A sua sessão com {mentor.nome_completo} foi agendada para {selectedSlots.length} horário(s).
            </p>
            <Button onClick={() => router.push('/mentores')}>Voltar para Mentores</Button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      {isProcessing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-200">
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Processando Pagamento</h3>
            {bookingData.paymentMethod === 'mpesa' ? (
              <p className="text-gray-600 dark:text-gray-400 mb-6 font-medium">
                Por favor, introduza o PIN M-Pesa no seu telemóvel para confirmar a transação.
              </p>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                A validar os dados de pagamento...
              </p>
            )}
            <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold animate-pulse">
              Não feche esta página enquanto processamos...
            </p>
          </div>
        </div>
      )}
      
      <div className="py-8 relative">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />Voltar
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Agendar Sessão</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Steps */}
            <div className="flex items-center justify-between max-w-md mx-auto mb-8">
              {[1, 2].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {stepNumber}
                  </div>
                  {stepNumber < 2 && <div className={`w-12 h-1 mx-2 ${step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'}`} />}
                </div>
              ))}
            </div>

            {step === 1 && (
              <PaymentMethod
                selectedMethod={bookingData.paymentMethod}
                onMethodChange={handlePaymentMethodChange}
                onCardDetailsChange={(details) => setBookingData(prev => ({ ...prev, cardDetails: details }))}
                onPhoneNumberChange={(phone) => setBookingData(prev => ({ ...prev, phoneNumber: phone }))}
                onStudentIdChange={(studentId) => setBookingData(prev => ({ ...prev, studentId }))}
                onProofUpload={(file) => setBookingData(prev => ({ ...prev, proofFile: file }))}
                totalAmount={priceData?.preco ?? 0}
              />
            )}

            {step === 2 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">Confirmar Agendamento</h3>
                <div className="space-y-4">
                  <div className="flex justify-between"><span className="text-gray-600">Mentor:</span><span className="font-medium">{mentor.nome_completo}</span></div>
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-600">Horários Selecionados:</span>
                    {selectedSlots.map((slot) => (
                      <span key={slot.id} className="font-medium text-sm ml-2">
                        • {new Date(slot.date).toLocaleDateString('pt-BR')} ({slot.startTime} - {slot.endTime})
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between"><span className="text-gray-600">Duração Total:</span><span className="font-medium">{priceData?.duracaoMinutos ?? '...'} minutos</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Método de Pagamento:</span><span className="font-medium capitalize">{bookingData.paymentMethod}</span></div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      {priceLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-secondary" />
                      ) : (
                        <span className="text-secondary">MT {priceData?.preco.toFixed(2) ?? '0.00'}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6">
              <Button variant="outline" onClick={() => setStep(step - 1)} disabled={step === 1}>Anterior</Button>
              {step < 2 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={!bookingData.paymentMethod || (bookingData.paymentMethod === 'mpesa' && !bookingData.phoneNumber?.trim())}
                >Continuar</Button>
              ) : (
                <Button onClick={handleConfirmBooking} disabled={isProcessing || selectedSlots.length === 0} className="bg-primary hover:bg-primary/90">
                  {isProcessing ? 'Processando...' : 'Confirmar Agendamento'}
                </Button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
                <h3 className="font-semibold mb-4">Resumo da Sessão</h3>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="relative h-12 w-12">
                    <Image src={mentor.foto_url} alt={mentor.nome_completo} fill className="rounded-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-medium">{mentor.nome_completo}</h4>
                    <p className="text-sm text-gray-600">{mentor.cargo}</p>
                  </div>
                </div>
                {selectedSlots.length > 0 && (
                  <div className="space-y-3 text-sm">
                    <h5 className="font-medium">Horários:</h5>
                    <div className="max-h-32 overflow-y-auto pr-2 space-y-2">
                      {selectedSlots.map((slot) => (
                        <div key={slot.id} className="flex justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded">
                          <span className="text-gray-600 dark:text-gray-300">{new Date(slot.date).toLocaleDateString('pt-BR')}</span>
                          <span className="font-medium">{slot.startTime} - {slot.endTime}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between pt-2 border-t"><span className="text-gray-600">Duração Total:</span><span>{priceData?.duracaoMinutos ?? '...'} min</span></div>
                  </div>
                )}
                <div className="border-t mt-4 pt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    {priceLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-secondary" />
                    ) : (
                      <span className="text-secondary">MT {priceData?.preco.toFixed(2) ?? '0.00'}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Informações Importantes</h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Connecte minutos antes da sessão</li>
                  <li>• Tenha suas perguntas preparadas</li>
                  <li>• Conexão estável de internet</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
