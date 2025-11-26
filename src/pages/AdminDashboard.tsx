import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, LogOut, CalendarCheck, Settings, Users } from 'lucide-react';
import AdminBookings from '@/components/admin/AdminBookings';
import AdminAttendanceTypes from '@/components/admin/AdminAttendanceTypes';
import AdminUsers from '@/components/admin/AdminUsers';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'bookings' | 'types' | 'users'>('bookings');

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-900 to-blue-800 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Agendamento NAF</h1>
              <p className="text-sm text-gray-500">Painel Administrativo</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={logout}
            className="border-blue-900 text-blue-900 hover:bg-blue-50 transition-colors"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>

      {/* Layout */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-white h-[calc(100vh-73px)] p-4">
          <nav className="space-y-2">
            <Button
              variant={activeTab === 'bookings' ? 'default' : 'ghost'}
              className={`w-full justify-start transition-colors ${
                activeTab === 'bookings'
                  ? 'bg-blue-900 text-white hover:bg-blue-800'
                  : 'hover:bg-blue-50 text-gray-700'
              }`}
              onClick={() => setActiveTab('bookings')}
            >
              <CalendarCheck className="mr-2 h-4 w-4" />
              Agendamentos
            </Button>

            <Button
              variant={activeTab === 'types' ? 'default' : 'ghost'}
              className={`w-full justify-start transition-colors ${
                activeTab === 'types'
                  ? 'bg-blue-900 text-white hover:bg-blue-800'
                  : 'hover:bg-blue-50 text-gray-700'
              }`}
              onClick={() => setActiveTab('types')}
            >
              <Settings className="mr-2 h-4 w-4" />
              Tipos de Atendimento
            </Button>

            <Button
              variant={activeTab === 'users' ? 'default' : 'ghost'}
              className={`w-full justify-start transition-colors ${
                activeTab === 'users'
                  ? 'bg-blue-900 text-white hover:bg-blue-800'
                  : 'hover:bg-blue-50 text-gray-700'
              }`}
              onClick={() => setActiveTab('users')}
            >
              <Users className="mr-2 h-4 w-4" />
              Usuários
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-white">
          {activeTab === 'bookings' && <AdminBookings />}
          {activeTab === 'types' && <AdminAttendanceTypes />}
          {activeTab === 'users' && <AdminUsers />}
        </main>
      </div>
    </div>
  );
}
