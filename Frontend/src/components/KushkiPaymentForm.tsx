import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard } from 'lucide-react';
import { tokenizeCard, loadKushkiScript } from '@/services/kushki';

interface KushkiPaymentFormProps {
  amount: number;
  onSuccess: (token: string) => void;
  onError: (error: string) => void;
  loading: boolean;
}

export default function KushkiPaymentForm({
  amount,
  onSuccess,
  onError,
  loading,
}: KushkiPaymentFormProps) {
  const [cardData, setCardData] = useState({
    name: '',
    number: '',
    expiryMonth: '',
    expiryYear: '',
    cvc: '',
  });
  const [kushkiLoaded, setKushkiLoaded] = useState(false);
  const [formError, setFormError] = useState('');

  // Cargar script de Kushki al montar el componente
  React.useEffect(() => {
    loadKushkiScript()
      .then(() => setKushkiLoaded(true))
      .catch((error) => {
        console.error('Error al cargar Kushki:', error);
        setFormError('Error al cargar el sistema de pagos. Por favor, recarga la página.');
      });
  }, []);

  const formatCardNumber = (value: string) => {
    // Remover espacios y caracteres no numéricos
    const cleaned = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    // Agregar espacios cada 4 dígitos
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardData({ ...cardData, number: formatted.replace(/\s/g, '') });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    const [month, year] = value.split('/');
    setCardData({
      ...cardData,
      expiryMonth: month || '',
      expiryYear: year || '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Validaciones
    if (!cardData.name.trim()) {
      setFormError('Por favor, ingresa el nombre en la tarjeta');
      return;
    }

    if (cardData.number.replace(/\s/g, '').length < 13) {
      setFormError('Por favor, ingresa un número de tarjeta válido');
      return;
    }

    if (!cardData.expiryMonth || !cardData.expiryYear) {
      setFormError('Por favor, ingresa la fecha de expiración');
      return;
    }

    if (cardData.cvc.length < 3) {
      setFormError('Por favor, ingresa el código de seguridad (CVC)');
      return;
    }

    if (!kushkiLoaded) {
      setFormError('El sistema de pagos aún se está cargando. Por favor, espera un momento.');
      return;
    }

    try {
      // Tokenizar la tarjeta
      const result = await tokenizeCard({
        name: cardData.name,
        number: cardData.number.replace(/\s/g, ''),
        expiryMonth: cardData.expiryMonth,
        expiryYear: cardData.expiryYear,
        cvc: cardData.cvc,
      });

      if (result.token) {
        onSuccess(result.token);
      } else {
        onError(result.error || 'Error al procesar la tarjeta');
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Error desconocido');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && (
        <Alert variant="destructive">
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}

      <div>
        <Label htmlFor="card-name">Nombre en la tarjeta</Label>
        <Input
          id="card-name"
          type="text"
          value={cardData.name}
          onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
          placeholder="Juan Pérez"
          required
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="card-number">Número de tarjeta</Label>
        <Input
          id="card-number"
          type="text"
          value={formatCardNumber(cardData.number)}
          onChange={handleCardNumberChange}
          placeholder="1234 5678 9012 3456"
          maxLength={19}
          required
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="card-expiry">Fecha de expiración</Label>
          <Input
            id="card-expiry"
            type="text"
            value={
              cardData.expiryMonth && cardData.expiryYear
                ? `${cardData.expiryMonth}/${cardData.expiryYear}`
                : ''
            }
            onChange={handleExpiryChange}
            placeholder="MM/AA"
            maxLength={5}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="card-cvc">CVC</Label>
          <Input
            id="card-cvc"
            type="text"
            value={cardData.cvc}
            onChange={(e) =>
              setCardData({
                ...cardData,
                cvc: e.target.value.replace(/\D/g, '').substring(0, 4),
              })
            }
            placeholder="123"
            maxLength={4}
            required
            className="mt-1"
          />
        </div>
      </div>

      <Alert>
        <AlertDescription>
          Tus datos están protegidos. El pago se procesa de forma segura a través de Kushki.
        </AlertDescription>
      </Alert>

      <Button
        type="submit"
        disabled={loading || !kushkiLoaded}
        className="w-full bg-[#0066FF] hover:bg-[#0052CC]"
      >
        <CreditCard className="w-4 h-4 mr-2" />
        {loading
          ? 'Procesando...'
          : `Pagar $${amount.toFixed(0)} con Kushki`}
      </Button>

      {!kushkiLoaded && (
        <p className="text-sm text-gray-500 text-center">
          Cargando sistema de pagos...
        </p>
      )}
    </form>
  );
}

