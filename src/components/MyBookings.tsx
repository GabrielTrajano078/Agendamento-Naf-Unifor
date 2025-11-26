import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, Clock, MessageCircle, MapPin } from 'lucide-react';

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
      pending: { color: 'bg-yellow-200 text-yellow-800', label: 'Pendente' },
      confirmed: { color: 'bg-blue-900 text-white', label: 'Confirmado' },
      completed: { color: 'bg-green-700 text-white', label: 'Concluído' },
      cancelled: { color: 'bg-red-600 text-white', label: 'Cancelado' },
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
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="text-blue-900">Meus Atendimentos</CardTitle>
        <CardDescription>Visualize todos os seus atendimentos agendados</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.id} className="border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-blue-900">{booking.attendanceTypeName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {booking.attendanceMode === 'presencial' ? (
                        <Badge className="bg-blue-50 text-blue-900 border border-blue-300 gap-1">
                          <MapPin className="w-3 h-3" />
                          Presencial
                        </Badge>
                      ) : (
                        <Badge className="bg-blue-50 text-blue-900 border border-blue-300 gap-1">
                          <MessageCircle className="w-3 h-3" />
                          WhatsApp
                        </Badge>
                      )}
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4 text-blue-900" />
                    <span>{formatDate(booking.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4 text-blue-900" />
                    <span>{booking.time}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
