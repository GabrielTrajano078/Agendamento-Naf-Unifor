import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Calendar, Clock, Search, Download, Edit, X, History, MessageCircle, MapPin } from 'lucide-react';

interface Booking {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  attendanceTypeId: string;
  attendanceTypeName: string;
  attendanceMode: 'presencial' | 'whatsapp';
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  history: Array<{
    action: string;
    timestamp: string;
    by: string;
  }>;
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [showHistory, setShowHistory] = useState<Booking | null>(null);
  const itemsPerPage = 5;

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [searchTerm, bookings]);

  const loadBookings = () => {
    const saved = localStorage.getItem('bookings');
    if (saved) {
      setBookings(JSON.parse(saved));
    }
  };

  const filterBookings = () => {
    if (!searchTerm) {
      setFilteredBookings(bookings);
      return;
    }

    const filtered = bookings.filter(
      (b) =>
        b.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.attendanceTypeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.date.includes(searchTerm)
    );
    setFilteredBookings(filtered);
    setCurrentPage(1);
  };

  const updateBookingStatus = (bookingId: string, newStatus: string) => {
    const updated = bookings.map((b) => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: newStatus as any,
          history: [
            ...b.history,
            {
              action: `Status alterado para ${newStatus}`,
              timestamp: new Date().toISOString(),
              by: 'Admin'
            }
          ]
        };
      }
      return b;
    });

    setBookings(updated);
    localStorage.setItem('bookings', JSON.stringify(updated));
    toast({
      title: 'Status atualizado',
      description: 'O status do agendamento foi alterado com sucesso',
    });
  };

  const cancelBooking = (bookingId: string) => {
    updateBookingStatus(bookingId, 'cancelled');
  };

  const saveEditedBooking = () => {
    if (!editingBooking) return;

    const updated = bookings.map((b) => {
      if (b.id === editingBooking.id) {
        return {
          ...editingBooking,
          history: [
            ...b.history,
            {
              action: 'Agendamento editado',
              timestamp: new Date().toISOString(),
              by: 'Admin'
            }
          ]
        };
      }
      return b;
    });

    setBookings(updated);
    localStorage.setItem('bookings', JSON.stringify(updated));
    setEditingBooking(null);
    toast({
      title: 'Agendamento atualizado',
      description: 'As alterações foram salvas com sucesso',
    });
  };

  const exportToCSV = () => {
    const headers = ['Cliente', 'E-mail', 'Tipo', 'Modalidade', 'Data', 'Horário', 'Status'];
    const rows = bookings.map((b) => [
      b.userName,
      b.userEmail,
      b.attendanceTypeName,
      b.attendanceMode === 'presencial' ? 'Presencial' : 'WhatsApp',
      b.date,
      b.time,
      b.status
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agendamentos-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();

    toast({
      title: 'Exportação concluída',
      description: 'Os dados foram exportados com sucesso',
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; label: string }> = {
      pending: { color: 'bg-blue-100 text-blue-800', label: 'Pendente' },
      confirmed: { color: 'bg-blue-200 text-blue-900', label: 'Confirmado' },
      completed: { color: 'bg-blue-300 text-blue-900', label: 'Concluído' },
      cancelled: { color: 'bg-red-100 text-red-700', label: 'Cancelado' }
    };

    const config = variants[status] || variants.pending;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Agendamentos</h2>
          <p className="text-muted-foreground">Gerencie todos os atendimentos agendados</p>
        </div>
        <Button onClick={exportToCSV} className="bg-blue-900 text-white hover:bg-blue-800">
          <Download className="mr-2 h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, tipo ou data..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="space-y-4">
        {paginatedBookings.map((booking) => (
          <Card key={booking.id} className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-foreground">{booking.userName}</h3>
                  <p className="text-sm text-muted-foreground">{booking.userEmail}</p>
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="bg-blue-900 text-white hover:bg-blue-800"
                        size="sm"
                        onClick={() => setShowHistory(booking)}
                      >
                        <History className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Histórico de Alterações</DialogTitle>
                        <DialogDescription>
                          Todas as modificações deste agendamento
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-3">
                        {booking.history.map((entry, idx) => (
                          <div key={idx} className="border-l-2 border-blue-900 pl-4">
                            <p className="text-sm font-medium">{entry.action}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(entry.timestamp).toLocaleString('pt-BR')} - {entry.by}
                            </p>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="bg-blue-900 text-white hover:bg-blue-800"
                        size="sm"
                        onClick={() => setEditingBooking(booking)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Agendamento</DialogTitle>
                        <DialogDescription>
                          Faça as alterações necessárias
                        </DialogDescription>
                      </DialogHeader>
                      {editingBooking && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Data</Label>
                            <Input
                              type="date"
                              value={editingBooking.date}
                              onChange={(e) =>
                                setEditingBooking({ ...editingBooking, date: e.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Horário</Label>
                            <Input
                              type="time"
                              value={editingBooking.time}
                              onChange={(e) =>
                                setEditingBooking({ ...editingBooking, time: e.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Status</Label>
                            <Select
                              value={editingBooking.status}
                              onValueChange={(value) =>
                                setEditingBooking({ ...editingBooking, status: value as any })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pendente</SelectItem>
                                <SelectItem value="confirmed">Confirmado</SelectItem>
                                <SelectItem value="completed">Concluído</SelectItem>
                                <SelectItem value="cancelled">Cancelado</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button onClick={saveEditedBooking} className="w-full bg-blue-900 text-white hover:bg-blue-800">
                            Salvar Alterações
                          </Button>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => cancelBooking(booking.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground">{booking.attendanceTypeName}</p>
                  {booking.attendanceMode === 'presencial' ? (
                    <Badge className="bg-blue-100 text-blue-900 border border-blue-300 gap-1">
                      <MapPin className="w-3 h-3" />
                      Presencial
                    </Badge>
                  ) : (
                    <Badge className="bg-blue-100 text-blue-900 border border-blue-300 gap-1">
                      <MessageCircle className="w-3 h-3" />
                      WhatsApp
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-900" />
                    <span>{formatDate(booking.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-900" />
                    <span>{booking.time}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                {getStatusBadge(booking.status)}
                <Select
                  value={booking.status}
                  onValueChange={(value) => updateBookingStatus(booking.id, value)}
                >
                  <SelectTrigger className="w-40 border-blue-900 text-blue-900">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="confirmed">Confirmado</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            className="bg-blue-900 text-white hover:bg-blue-800"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            className="bg-blue-900 text-white hover:bg-blue-800"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Próxima
          </Button>
        </div>
      )}
    </div>
  );
}
