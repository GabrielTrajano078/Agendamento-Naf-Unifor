import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { MessageCircle, MapPin } from 'lucide-react';

interface AttendanceType {
  id: string;
  name: string;
  duration: number;
}

interface BookingFormProps {
  onSuccess?: () => void;
}

export default function BookingForm({ onSuccess }: BookingFormProps) {
  const { user } = useAuth();
  const [attendanceTypes, setAttendanceTypes] = useState<AttendanceType[]>([]);
  const [selectedType, setSelectedType] = useState('');
  const [attendanceMode, setAttendanceMode] = useState<'presencial' | 'whatsapp'>('presencial');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  useEffect(() => {
    const savedTypes = localStorage.getItem('attendanceTypes');
    if (savedTypes) {
      setAttendanceTypes(JSON.parse(savedTypes));
    } else {
      const defaultTypes = [
        { id: '1', name: 'Consulta', duration: 30 },
        { id: '2', name: 'Orientação', duration: 45 },
        { id: '3', name: 'Atendimento Geral', duration: 30 },
        { id: '4', name: 'Reunião', duration: 60 },
      ];
      localStorage.setItem('attendanceTypes', JSON.stringify(defaultTypes));
      setAttendanceTypes(defaultTypes);
    }
  }, []);

  useEffect(() => {
    if (date) {
      const times: string[] = [];
      for (let hour = 9; hour < 18; hour++) {
        times.push(`${hour.toString().padStart(2, '0')}:00`);
        times.push(`${hour.toString().padStart(2, '0')}:30`);
      }

      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      const bookedTimes = bookings
        .filter((b: any) => b.date === date && b.status !== 'cancelled')
        .map((b: any) => b.time);

      const available = times.filter(t => !bookedTimes.includes(t));
      setAvailableTimes(available);
    }
  }, [date]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedType || !date || !time || !attendanceMode) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos',
        variant: 'destructive',
      });
      return;
    }

    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const conflict = bookings.find(
      (b: any) => b.date === date && b.time === time && b.status !== 'cancelled'
    );

    if (conflict) {
      toast({
        title: 'Conflito de Horário',
        description: 'Este horário já está reservado. Por favor, escolha outro.',
        variant: 'destructive',
      });
      return;
    }

    const attendanceType = attendanceTypes.find(t => t.id === selectedType);
    const newBooking = {
      id: `booking-${Date.now()}`,
      userId: user?.id,
      userName: user?.name,
      userEmail: user?.email,
      attendanceTypeId: selectedType,
      attendanceTypeName: attendanceType?.name,
      attendanceMode,
      date,
      time,
      status: 'pending',
      createdAt: new Date().toISOString(),
      history: [{
        action: 'created',
        timestamp: new Date().toISOString(),
        by: user?.name
      }]
    };

    bookings.push(newBooking);
    localStorage.setItem('bookings', JSON.stringify(bookings));

    const modeText = attendanceMode === 'presencial' ? 'presencial' : 'via WhatsApp';
    toast({
      title: 'Agendamento Realizado!',
      description: `Seu atendimento ${modeText} foi confirmado com sucesso`,
    });

    setTimeout(() => {
      toast({
        title: 'E-mail de Confirmação Enviado',
        description: 'Verifique sua caixa de entrada',
      });
    }, 1000);

    setSelectedType('');
    setAttendanceMode('presencial');
    setDate('');
    setTime('');

    if (onSuccess) onSuccess();
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="text-blue-900">Novo Agendamento</CardTitle>
        <CardDescription>Preencha os dados para agendar seu atendimento</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Atendimento</Label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Selecione o tipo de atendimento" />
              </SelectTrigger>
              <SelectContent>
                {attendanceTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name} ({type.duration} min)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Modalidade do Atendimento</Label>
            <RadioGroup value={attendanceMode} onValueChange={(value: any) => setAttendanceMode(value)}>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-blue-50 cursor-pointer">
                <RadioGroupItem value="presencial" id="presencial" />
                <Label htmlFor="presencial" className="flex items-center gap-2 cursor-pointer flex-1">
                  <MapPin className="w-4 h-4 text-blue-900" />
                  <div>
                    <div className="font-medium text-blue-900">Presencial</div>
                    <div className="text-sm text-muted-foreground">Atendimento no local</div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-blue-50 cursor-pointer">
                <RadioGroupItem value="whatsapp" id="whatsapp" />
                <Label htmlFor="whatsapp" className="flex items-center gap-2 cursor-pointer flex-1">
                  <MessageCircle className="w-4 h-4 text-blue-900" />
                  <div>
                    <div className="font-medium text-blue-900">Via WhatsApp</div>
                    <div className="text-sm text-muted-foreground">Atendimento online</div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {date && (
            <div className="space-y-2">
              <Label htmlFor="time">Horário</Label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger id="time">
                  <SelectValue placeholder="Selecione um horário" />
                </SelectTrigger>
                <SelectContent>
                  {availableTimes.length > 0 ? (
                    availableTimes.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      Sem horários disponíveis
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-blue-900 text-white hover:bg-blue-800"
          >
            Confirmar Agendamento
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
