import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Lock, Mail, User, Calendar } from 'lucide-react';

export default function Login() {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginEmail || !loginPassword) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos',
        variant: 'destructive',
      });
      return;
    }

    const success = await login(loginEmail, loginPassword);
    if (success) {
      toast({
        title: 'Login realizado!',
        description: 'Bem-vindo de volta',
      });

      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (currentUser.type === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      toast({
        title: 'Erro',
        description: 'E-mail ou senha incorretos',
        variant: 'destructive',
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!registerName || !registerEmail || !registerPassword || !registerConfirmPassword) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos',
        variant: 'destructive',
      });
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      toast({
        title: 'Erro',
        description: 'As senhas não coincidem',
        variant: 'destructive',
      });
      return;
    }

    if (registerPassword.length < 4) {
      toast({
        title: 'Erro',
        description: 'A senha deve ter no mínimo 4 caracteres',
        variant: 'destructive',
      });
      return;
    }

    const success = await register(registerName, registerEmail, registerPassword);
    if (success) {
      toast({
        title: 'Cadastro realizado!',
        description: 'Agora você pode fazer login',
      });
      document.querySelector('[value="login"]')?.dispatchEvent(new MouseEvent('click'));
    } else {
      toast({
        title: 'Erro',
        description: 'E-mail já cadastrado',
        variant: 'destructive',
      });
    }
  };

  const handleRecoverPassword = () => {
    if (!loginEmail) {
      toast({
        title: 'Erro',
        description: 'Digite seu e-mail primeiro',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'E-mail enviado!',
      description: 'Verifique sua caixa de entrada para redefinir sua senha',
    });
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ backgroundColor: '#0a2342' }}
    >
      {/* Logo e título */}
      <div className="flex flex-col items-center mb-8 text-white text-center space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Agendamento Naf</h1>
        </div>
        <p className="text-sm opacity-90">
          Sistema de agendamento para atendimento <span className="font-semibold">NAF</span>
        </p>
      </div>

      {/* Card de login/cadastro */}
      <Card className="w-full max-w-md shadow-lg border-none bg-white">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-blue-900">Bem-vindo</CardTitle>
          <CardDescription className="text-center">
            Faça login ou crie sua conta para continuar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Cadastro</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="link"
                  className="px-0 text-sm text-blue-900 hover:text-blue-700"
                  onClick={handleRecoverPassword}
                >
                  Esqueceu sua senha?
                </Button>
                <Button
                  type="submit"
                  className="w-full bg-blue-900 text-white hover:bg-blue-800"
                >
                  Entrar
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-4">
                  Admin: admin@admin.com / 1234
                </p>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">Nome Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="João Silva"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-confirm-password">Confirmar Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={registerConfirmPassword}
                      onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-900 text-white hover:bg-blue-800"
                >
                  Criar Conta
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
