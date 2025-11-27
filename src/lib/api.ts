// src/lib/api.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper para fazer requisições com token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// ============ USUÁRIOS ============

export const authApi = {
  // Login
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/usuarios/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.erro || 'Erro ao fazer login');
    }
    
    return response.json();
  },

  // Registrar
  register: async (nome: string, email: string, senha: string) => {
    const response = await fetch(`${API_URL}/usuarios/registrar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, senha }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.erro || 'Erro ao criar usuário');
    }
    
    return response.json();
  },

  // Listar usuários
  getUsers: async () => {
    const response = await fetch(`${API_URL}/usuarios/listarUser`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao buscar usuários');
    }
    
    return response.json();
  },
};

// ============ AGENDAMENTOS ============

export const bookingsApi = {
  // Listar todos os agendamentos
  getAll: async () => {
    const response = await fetch(`${API_URL}/agendamentos/listarAg`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao buscar agendamentos');
    }
    
    return response.json();
  },

  // Obter agendamento por ID
  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/agendamentos/listaId/${id}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao buscar agendamento');
    }
    
    return response.json();
  },

  // Criar agendamento
  create: async (data: {
    data: string;
    hora: string;
    status: string;
    usuarioId: string;
    name: string;
    servicoPrestado: string;
  }) => {
    const response = await fetch(`${API_URL}/agendamentos/criarAg`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.erro || 'Erro ao criar agendamento');
    }
    
    return response.json();
  },

  // Atualizar agendamento
  update: async (id: string, data: {
    data?: string;
    hora?: string;
    status?: string;
    usuarioId?: string;
    name?: string;
    servicoPrestado?: string;
  }) => {
    const response = await fetch(`${API_URL}/agendamentos/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao atualizar agendamento');
    }
    
    return response.json();
  },

  // Deletar agendamento
  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/agendamentos/excluirAg/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao deletar agendamento');
    }
    
    return true;
  },
};

