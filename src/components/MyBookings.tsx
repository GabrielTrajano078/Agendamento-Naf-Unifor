import { useState, useEffect } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { bookingsApi } from '@/lib/api';
import { Calendar, Clock, X } from 'lucide-react';

interface Booking {
  _id: string;
  data: string;
  hora: string;
  status: string;
  usuarioId: string;
  name: string;
  servicoPrestado: string;
}

export default function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, [user]);

  const loadBookings = async () => {
    try {
      const allBookings = await bookingsApi.getAll();
      // Filtra apenas os agendamentos do usuário atual
      const userBookings = allBookings.filter((b: Booking) => b.usuarioId === user?.id);
      setBookings(userBookings);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar seus agendamentos',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; label: string }> = {
      pending: { color: 'bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors cursor-default', label: 'Pendente' },
      confirmed: { color: 'bg-blue-200 text-blue-900 hover:bg-blue-300 transition-colors cursor-default', label: 'Confirmado' },
      completed: { color: 'bg-blue-300 text-blue-900 hover:bg-blue-400 transition-colors cursor-default', label: 'Concluído' },
      cancelled: { color: 'bg-red-100 text-red-700 hover:bg-red-200 transition-colors cursor-default', label: 'Cancelado' },
      ativo: { color: 'bg-blue-200 text-blue-900 hover:bg-blue-300 transition-colors cursor-default', label: 'Ativo' },
      concluido: { color: 'bg-blue-300 text-blue-900 hover:bg-blue-400 transition-colors cursor-default', label: 'Concluído' },
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

  const deleteBooking = async (bookingId: string) => {
    try {
      await bookingsApi.delete(bookingId);
      setBookings(bookings.filter((b) => b._id !== bookingId));
      toast({
        title: 'Agendamento excluído',
        description: 'O agendamento foi removido da sua lista',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o agendamento',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-blue-900">Meus Atendimentos</CardTitle>
          <CardDescription>Carregando...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

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
              <TableHead>Serviço</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Horário</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking._id}>
                <TableCell className="font-medium text-blue-900">
                  {booking.servicoPrestado}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="w-4 h-4 text-blue-900" />
                    <span>{formatDate(booking.data)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-4 h-4 text-blue-900" />
                    <span>{booking.hora}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(booking.status)}
                </TableCell>
                <TableCell className="text-right">
                  {(booking.status === 'cancelled' || booking.status === 'concluido') && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteBooking(booking._id)}
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
