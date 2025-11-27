import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { bookingsApi } from '@/lib/api';
import { Calendar, Clock, Search, Download, Edit, X } from 'lucide-react';

interface Booking {
  _id: string;
  data: string;
  hora: string;
  status: string;
  usuarioId: string;
  name: string;
  servicoPrestado: string;
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 5;

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [searchTerm, bookings]);

  const loadBookings = async () => {
    try {
      const data = await bookingsApi.getAll();
      setBookings(data);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os agendamentos',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterBookings = () => {
    if (!searchTerm) {
      setFilteredBookings(bookings);
      return;
    }

    const filtered = bookings.filter(
      (b) =>
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.servicoPrestado.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.data.includes(searchTerm)
    );
    setFilteredBookings(filtered);
    setCurrentPage(1);
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      await bookingsApi.update(bookingId, { status: newStatus });
      
      const updated = bookings.map((b) => {
        if (b._id === bookingId) {
          return { ...b, status: newStatus };
        }
        return b;
      });

      setBookings(updated);
      toast({
        title: 'Status atualizado',
        description: 'O status do agendamento foi alterado com sucesso',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o status',
        variant: 'destructive',
      });
    }
  };

  const cancelBooking = (bookingId: string) => {
    updateBookingStatus(bookingId, 'cancelled');
  };

  const deleteBooking = async (bookingId: string) => {
    try {
      await bookingsApi.delete(bookingId);
      const updated = bookings.filter((b) => b._id !== bookingId);
      setBookings(updated);
      toast({
        title: 'Agendamento excluído',
        description: 'O agendamento foi removido permanentemente',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o agendamento',
        variant: 'destructive',
      });
    }
  };

  const saveEditedBooking = async () => {
    if (!editingBooking) return;

    try {
      await bookingsApi.update(editingBooking._id, {
        data: editingBooking.data,
        hora: editingBooking.hora,
        status: editingBooking.status,
      });

      const updated = bookings.map((b) => {
        if (b._id === editingBooking._id) {
          return editingBooking;
        }
        return b;
      });

      setBookings(updated);
      setEditingBooking(null);
      toast({
        title: 'Agendamento atualizado',
        description: 'As alterações foram salvas com sucesso',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o agendamento',
        variant: 'destructive',
      });
    }
  };

  const exportToCSV = () => {
    const headers = ['Cliente', 'Serviço', 'Data', 'Horário', 'Status'];
    const rows = bookings.map((b) => [
      b.name,
      b.servicoPrestado,
      b.data,
      b.hora,
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
      year: 'numeric'
    });
  };

  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Agendamentos</h2>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

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
            placeholder="Buscar por nome, serviço ou data..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Serviço</TableHead>
              <TableHead>Data/Hora</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedBookings.map((booking) => (
              <TableRow key={booking._id}>
                <TableCell>
                  <p className="font-medium">{booking.name}</p>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{booking.servicoPrestado}</span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-blue-900" />
                      <span>{formatDate(booking.data)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-blue-900" />
                      <span>{booking.hora}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-2">
                    {getStatusBadge(booking.status)}
                    <Select
                      value={booking.status}
                      onValueChange={(value) => updateBookingStatus(booking._id, value)}
                    >
                      <SelectTrigger className="w-32 h-8 text-xs border-blue-900 text-blue-900">
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
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
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
                                value={editingBooking.data}
                                onChange={(e) =>
                                  setEditingBooking({ ...editingBooking, data: e.target.value })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Horário</Label>
                              <Input
                                type="time"
                                value={editingBooking.hora}
                                onChange={(e) =>
                                  setEditingBooking({ ...editingBooking, hora: e.target.value })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Status</Label>
                              <Select
                                value={editingBooking.status}
                                onValueChange={(value) =>
                                  setEditingBooking({ ...editingBooking, status: value })
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

                    {booking.status === 'cancelled' ? (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            title="Excluir agendamento"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir Agendamento</AlertDialogTitle>
                            <AlertDialogDescription>
                              Você deseja excluir esse agendamento? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Não</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteBooking(booking._id)}
                              className="bg-red-600 text-white hover:bg-red-700"
                            >
                              Sim, excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => cancelBooking(booking._id)}
                        title="Cancelar agendamento"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
