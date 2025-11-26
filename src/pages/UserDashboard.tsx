import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, LogOut, MessageCircle, Plus, List } from 'lucide-react';
import BookingForm from '@/components/BookingForm';
import MyBookings from '@/components/MyBookings';

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const [view, setView] = useState<'home' | 'book' | 'bookings'>('home');

  const handleWhatsAppSupport = () => {
    window.open('https://wa.me/5511999999999', '_blank');
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b bg-white shadow-soft">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-900 to-blue-800 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Agendamento Unifor</h1>
              <p className="text-sm text-gray-500">Olá, {user?.name}!</p>
            </div>
          </div>
          <Button variant="outline" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {view === 'home' && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Painel do Usuário</h2>
              <p className="text-gray-500">Gerencie seus atendimentos agendados</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card
                className="shadow-card hover:shadow-soft transition-shadow cursor-pointer"
                onClick={() => setView('book')}
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-blue-900/10 flex items-center justify-center mb-4">
                    <Plus className="w-6 h-6 text-blue-900" />
                  </div>
                  <CardTitle>Agendar Atendimento</CardTitle>
                  <CardDescription>
                    Marque um horário para atendimento presencial ou via WhatsApp
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full bg-blue-900 text-white hover:bg-blue-800"
                    onClick={() => setView('book')}
                  >
                    Novo Agendamento
                  </Button>
                </CardContent>
              </Card>

              <Card
                className="shadow-card hover:shadow-soft transition-shadow cursor-pointer"
                onClick={() => setView('bookings')}
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-blue-900/10 flex items-center justify-center mb-4">
                    <List className="w-6 h-6 text-blue-900" />
                  </div>
                  <CardTitle>Meus Atendimentos</CardTitle>
                  <CardDescription>
                    Visualize todos os seus atendimentos agendados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    className="w-full border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white"
                    onClick={() => setView('bookings')}
                  >
                    Ver Atendimentos
                  </Button>
                </CardContent>
              </Card>

              <Card
                className="shadow-card hover:shadow-soft transition-shadow cursor-pointer"
                onClick={handleWhatsAppSupport}
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-green-600/10 flex items-center justify-center mb-4">
                    <MessageCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle>Suporte</CardTitle>
                  <CardDescription>Fale conosco via WhatsApp</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    className="w-full border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                    onClick={handleWhatsAppSupport}
                  >
                    Abrir WhatsApp
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {view === 'book' && (
          <div className="max-w-2xl mx-auto">
            <Button
              variant="outline"
              onClick={() => setView('home')}
              className="mb-6 border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white"
            >
              ← Voltar
            </Button>
            <BookingForm onSuccess={() => setView('bookings')} />
          </div>
        )}

        {view === 'bookings' && (
          <div className="max-w-4xl mx-auto">
            <Button
              variant="outline"
              onClick={() => setView('home')}
              className="mb-6 border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white"
            >
              ← Voltar
            </Button>
            <MyBookings />
          </div>
        )}
      </main>
    </div>
  );
}
