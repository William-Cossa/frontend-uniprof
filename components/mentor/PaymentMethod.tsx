'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CreditCard, Smartphone, FileText, Copy, Check } from 'lucide-react';

interface PaymentMethodProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
  onCardDetailsChange?: (details: any) => void;
  onPhoneNumberChange?: (phone: string) => void;
  onStudentIdChange?: (studentId: string) => void;
  onProofUpload?: (file: File) => void;
  totalAmount?: number;
}

export function PaymentMethod({
  selectedMethod,
  onMethodChange,
  onCardDetailsChange,
  onPhoneNumberChange,
  onStudentIdChange,
  onProofUpload,
  totalAmount = 0
}: PaymentMethodProps) {
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const [phoneNumber, setPhoneNumber] = useState('');
  const [studentId, setStudentId] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCardDetailChange = (field: string, value: string) => {
    const newDetails = { ...cardDetails, [field]: value };
    setCardDetails(newDetails);
    onCardDetailsChange?.(newDetails);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofFile(file);
      onProofUpload?.(file);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Falha ao copiar texto: ', err);
    }
  };

  const bankAccounts = {
    mbim: {
      name: "Millennium BIM",
      conta: "1024762418",
      nib: "000100000102476241857",
      titular: "Unitec Moçambique Lda.",
    },
    bci: {
      name: "BCI",
      conta: "25418442710001",
      nib: "000800005418442710113",
      titular: "Unitec Moçambique Lda.",
    },
    absa: {
      name: "ABSA",
      conta: "0014102004789",
      nib: "000200141410200478905",
      titular: "Unitec Moçambique Lda.",
    },
  };

  const paymentMethods = [
    {
      id: 'mpesa',
      name: 'M-Pesa',
      icon: Smartphone,
      logo: '/images/payments/Mpesa-logo.png',
      description: 'Pague usando sua conta M-Pesa'
    },
    {
      id: 'emola',
      name: 'e-Mola',
      icon: Smartphone,
      logo: '/images/payments/emola.png',
      description: 'Pague usando e-Mola'
    },

    {
      id: 'comprovativo',
      name: 'Transferência Bancária',
      icon: FileText,
      logo: '/images/payments/transferencia-logo.webp',
      description: 'Envie comprovativo de transferência'
    },
    {
      id: 'card',
      name: 'Cartão',
      icon: CreditCard,
      logo: '/images/payments/Mastercard-visa-card-logo.png',
      description: 'Pague usando o seu cartão Visa'
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">Método de Pagamento</h3>

      <Tabs defaultValue="mpesa" value={selectedMethod} onValueChange={onMethodChange} className="w-full">
        <TabsList className="grid grid-cols-2 lg:grid-cols-4  h-auto p-1 bg-gray-100 dark:bg-gray-900 mb-6">
          {paymentMethods.map((method) => (
            <TabsTrigger
              key={method.id}
              value={method.id}
              className="flex flex-col w-40 items-center gap-2 py-3 px-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 shadow-none border-0"
            >
              <div className="relative w-16 h-16 flex rounded-lg items-center justify-center">
                {method.logo ? (
                  <Image
                    src={method.logo}
                    alt={method.name}
                    fill
                    className="object-contain rounded-lg"
                  />
                ) : (
                  <method.icon className="w-6 h-6 text-gray-500" />
                )}
              </div>
              <span className="text-xs font-medium">{method.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* M-Pesa */}
        <TabsContent value="mpesa" className="mt-0">
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-green-500" />
              M-Pesa
            </h4>
            <div className="space-y-4">
              <div>
                <Label htmlFor="phoneNumber">Número de Telefone</Label>
                <Input
                  id="phoneNumber"
                  placeholder="+258 84 123 4567"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    onPhoneNumberChange?.(e.target.value);
                  }}
                />
                <p className="text-sm text-gray-500 mt-2">
                  Você receberá uma mensagem para confirmar o pagamento
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* e-Mola */}
        <TabsContent value="emola" className="mt-0">
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-yellow-500" />
              e-Mola
            </h4>
            <div className="space-y-4">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <h5 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                  Como pagar usando Emola:
                </h5>
                <div className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    <span>Digite <strong>*898#</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    <span>Opção <strong>9</strong> → Pagamentos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    <span>Opção <strong>1</strong> → Comerciante</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    <span>ID: <strong>801335</strong></span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard('801335', 'emola-id')}
                      className="h-6 px-2"
                    >
                      {copiedField === 'emola-id' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    <span>Digite o valor: <strong>{totalAmount.toFixed(2)} MT</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    <span>Conteúdo: <strong>Mentoria</strong></span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard('Mentoria', 'emola-content')}
                      className="h-6 px-2"
                    >
                      {copiedField === 'emola-content' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    <span>Confirme <strong>Unitec Moçambique US</strong></span>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="proofUploadEmola" className="block mb-2">
                  Envie o comprovativo de transferência
                </Label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {proofFile ? proofFile.name : 'Faça upload do comprovativo (PDF, JPG, PNG)'}
                  </p>
                  <Input
                    id="proofUploadEmola"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Label htmlFor="proofUploadEmola">
                    <Button variant="outline" asChild>
                      <span>Selecionar Arquivo</span>
                    </Button>
                  </Label>
                  {proofFile && (
                    <p className="text-sm text-green-600 mt-2">
                      ✓ Arquivo selecionado com sucesso
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Cartão */}
        <TabsContent value="card" className="mt-0">
          <div className="p-4 border rounded-lg space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-500" />
              Detalhes do Cartão
            </h4>

            <div className="space-y-4">
              <div>
                <Label htmlFor="cardName">Nome no Cartão</Label>
                <Input
                  id="cardName"
                  placeholder="João Silva"
                  value={cardDetails.name}
                  onChange={(e) => handleCardDetailChange('name', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="cardNumber">Número do Cartão</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.number}
                  onChange={(e) => handleCardDetailChange('number', e.target.value)}
                  maxLength={19}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Validade</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/AA"
                    value={cardDetails.expiry}
                    onChange={(e) => handleCardDetailChange('expiry', e.target.value)}
                    maxLength={5}
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={(e) => handleCardDetailChange('cvv', e.target.value)}
                    maxLength={3}
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Transferência */}
        <TabsContent value="comprovativo" className="mt-0">
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-500" />
              Transferência Bancária
            </h4>

            <div className="space-y-4">
              <div className="space-y-3">
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Faça a transferência para uma das nossas contas:
                </h5>

                {Object.entries(bankAccounts).map(([key, bank]) => (
                  <div key={key} className="border rounded-lg p-3 space-y-2 text-sm">
                    <h6 className="font-medium text-gray-900 dark:text-white">{bank.name}</h6>
                    <div className="grid grid-cols-1 gap-1">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Conta:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono">{bank.conta}</span>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(bank.conta, `${key}-conta`)} className="h-6 px-1">
                            {copiedField === `${key}-conta` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">NIB:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono">{bank.nib}</span>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(bank.nib, `${key}-nib`)} className="h-6 px-1">
                            {copiedField === `${key}-nib` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-blue-800 dark:text-blue-200 font-medium">Valor Total:</span>
                  <span className="font-bold text-blue-800 dark:text-blue-200">
                    {totalAmount.toFixed(2)} MT
                  </span>
                </div>
              </div>

              <div>
                <Label htmlFor="proofUploadTransfer" className="block mb-2 text-sm">
                  Upload do Comprovativo
                </Label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                  <Input
                    id="proofUploadTransfer"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Label htmlFor="proofUploadTransfer">
                    <Button variant="outline" size="sm" asChild>
                      <span>Selecionar Arquivo</span>
                    </Button>
                  </Label>
                  {proofFile && <p className="text-xs text-green-600 mt-2">{proofFile.name}</p>}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}