import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Trash2, UserCircle } from 'lucide-react';
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

interface User {
  id: string;
  name: string;
  email: string;
  type: 'user' | 'admin';
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const saved = localStorage.getItem('users');
    if (saved) {
      setUsers(JSON.parse(saved));
    }
  };

  const deleteUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    
    if (user?.type === 'admin') {
      toast({
        title: 'Erro',
        description: 'Não é possível excluir usuários administradores',
        variant: 'destructive',
      });
      return;
    }

    const updated = users.filter((u) => u.id !== userId);
    setUsers(updated);
    localStorage.setItem('users', JSON.stringify(updated));

    // Também remove todos os agendamentos do usuário
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const updatedBookings = bookings.filter((b: any) => b.userId !== userId);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));

    toast({
      title: 'Usuário excluído',
      description: 'O usuário e seus agendamentos foram removidos',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Usuários</h2>
        <p className="text-muted-foreground">Gerencie os usuários do sistema</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {users.map((user) => (
          <Card key={user.id} className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-900/10 flex items-center justify-center">
                    <UserCircle className="w-6 h-6 text-blue-900" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <Badge
                      className={`mt-2 ${
                        user.type === 'admin'
                          ? 'bg-blue-900 text-white hover:bg-blue-800'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      {user.type === 'admin' ? 'Administrador' : 'Usuário'}
                    </Badge>
                  </div>
                </div>
                {user.type !== 'admin' && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        className="bg-blue-900 text-white hover:bg-blue-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita
                          e todos os agendamentos do usuário serão removidos.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteUser(user.id)}
                          className="bg-blue-900 text-white hover:bg-blue-800"
                        >
                          Confirmar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
