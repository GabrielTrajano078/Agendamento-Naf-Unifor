import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface AttendanceType {
  id: string;
  name: string;
  duration: number;
}

export default function AdminAttendanceTypes() {
  const [types, setTypes] = useState<AttendanceType[]>([]);
  const [editingType, setEditingType] = useState<AttendanceType | null>(null);
  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeDuration, setNewTypeDuration] = useState('30');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    loadTypes();
  }, []);

  const loadTypes = () => {
    const saved = localStorage.getItem('attendanceTypes');
    if (saved) {
      setTypes(JSON.parse(saved));
    } else {
      const defaultTypes = [
        { id: '1', name: 'Consulta', duration: 30 },
        { id: '2', name: 'Orientação', duration: 45 },
        { id: '3', name: 'Atendimento Geral', duration: 30 },
        { id: '4', name: 'Reunião', duration: 60 },
      ];
      localStorage.setItem('attendanceTypes', JSON.stringify(defaultTypes));
      setTypes(defaultTypes);
    }
  };

  const addType = () => {
    if (!newTypeName || !newTypeDuration) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos',
        variant: 'destructive',
      });
      return;
    }

    const newType = {
      id: `type-${Date.now()}`,
      name: newTypeName,
      duration: parseInt(newTypeDuration)
    };

    const updated = [...types, newType];
    setTypes(updated);
    localStorage.setItem('attendanceTypes', JSON.stringify(updated));

    setNewTypeName('');
    setNewTypeDuration('30');
    setIsAddDialogOpen(false);

    toast({
      title: 'Tipo adicionado',
      description: 'O novo tipo de atendimento foi criado com sucesso',
    });
  };

  const updateType = () => {
    if (!editingType) return;

    const updated = types.map((t) =>
      t.id === editingType.id ? editingType : t
    );

    setTypes(updated);
    localStorage.setItem('attendanceTypes', JSON.stringify(updated));
    setEditingType(null);

    toast({
      title: 'Tipo atualizado',
      description: 'As alterações foram salvas com sucesso',
    });
  };

  const deleteType = (typeId: string) => {
    const updated = types.filter((t) => t.id !== typeId);
    setTypes(updated);
    localStorage.setItem('attendanceTypes', JSON.stringify(updated));

    toast({
      title: 'Tipo excluído',
      description: 'O tipo de atendimento foi removido com sucesso',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Tipos de Atendimento</h2>
          <p className="text-muted-foreground">Gerencie os tipos de atendimento disponíveis</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-900 text-white hover:bg-blue-800">
              <Plus className="mr-2 h-4 w-4" />
              Novo Tipo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Tipo de Atendimento</DialogTitle>
              <DialogDescription>Crie um novo tipo de atendimento</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nome do Tipo</Label>
                <Input
                  value={newTypeName}
                  onChange={(e) => setNewTypeName(e.target.value)}
                  placeholder="Ex: Consulta"
                />
              </div>
              <div className="space-y-2">
                <Label>Duração (minutos)</Label>
                <Input
                  type="number"
                  value={newTypeDuration}
                  onChange={(e) => setNewTypeDuration(e.target.value)}
                  placeholder="30"
                />
              </div>
              <Button onClick={addType} className="w-full bg-blue-900 text-white hover:bg-blue-800">
                Adicionar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {types.map((type) => (
          <Card key={type.id} className="shadow-card">
            <CardHeader>
              <CardTitle>{type.name}</CardTitle>
              <CardDescription>{type.duration} minutos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setEditingType(type)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Editar Tipo de Atendimento</DialogTitle>
                      <DialogDescription>Altere os dados do tipo</DialogDescription>
                    </DialogHeader>
                    {editingType && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Nome do Tipo</Label>
                          <Input
                            value={editingType.name}
                            onChange={(e) =>
                              setEditingType({ ...editingType, name: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Duração (minutos)</Label>
                          <Input
                            type="number"
                            value={editingType.duration}
                            onChange={(e) =>
                              setEditingType({
                                ...editingType,
                                duration: parseInt(e.target.value)
                              })
                            }
                          />
                        </div>
                        <Button onClick={updateType} className="w-full bg-blue-900 text-white hover:bg-blue-800">
                          Salvar Alterações
                        </Button>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteType(type.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
