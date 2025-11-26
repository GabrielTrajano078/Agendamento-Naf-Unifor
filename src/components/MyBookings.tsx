import { useState, useEffect } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, Clock, MessageCircle, MapPin, X } from 'lucide-react';

interface Booking {
  id: string;
  attendanceTypeId: string;
  attendanceTypeName: string;
  attendanceMode: 'presencial' | 'whatsapp';
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export default function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const userBookings = allBookings.filter((b: any) => b.userId === user?.id);
    setBookings(userBookings);
  }, [user]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; label: string }> = {
      pending: { color: 'bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors cursor-default', label: 'Pendente' },
      confirmed: { color: 'bg-blue-200 text-blue-900 hover:bg-blue-300 transition-colors cursor-default', label: 'Confirmado' },
      completed: { color: 'bg-blue-300 text-blue-900 hover:bg-blue-400 transition-colors cursor-default', label: 'Concluído' },
      cancelled: { color: 'bg-red-100 text-red-700 hover:bg-red-200 transition-colors cursor-default', label: 'Cancelado' },
    };

    const config = variants[status] || variants.pending;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const deleteBooking = (bookingId: string) => {
    const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const updated = allBookings.filter((b: any) => b.id !== bookingId);
    localStorage.setItem('bookings', JSON.stringify(updated));
    setBookings(bookings.filter((b) => b.id !== bookingId));
    toast({
      title: 'Agendamento excluído',
      description: 'O agendamento foi removido da sua lista',
    });
  };

  if (bookings.length === 0) {
    return (
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-blue-900">Meus Atendimentos</CardTitle>
          <CardDescription>Você ainda não tem atendimentos agendados</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-blue-900">Meus Atendimentos</h2>
        <p className="text-muted-foreground">Visualize todos os seus atendimentos agendados</p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo de Atendimento</TableHead>
              <TableHead>Modalidade</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Horário</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium text-blue-900">
                  {booking.attendanceTypeName}
                </TableCell>
                <TableCell>
                  {booking.attendanceMode === 'presencial' ? (
                    <Badge className="bg-blue-100 text-blue-900 border border-blue-300 gap-1 hover:bg-blue-200 transition-colors cursor-default">
                      <MapPin className="w-3 h-3" />
                      Presencial
                    </Badge>
                  ) : (
                    <Badge className="bg-blue-100 text-blue-900 border border-blue-300 gap-1 hover:bg-blue-200 transition-colors cursor-default">
                      <MessageCircle className="w-3 h-3" />
                      WhatsApp
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="w-4 h-4 text-blue-900" />
                    <span>{formatDate(booking.date)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-4 h-4 text-blue-900" />
                    <span>{booking.time}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(booking.status)}
                </TableCell>
                <TableCell className="text-right">
                  {booking.status === 'cancelled' && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteBooking(booking.id)}
                      title="Excluir agendamento"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
