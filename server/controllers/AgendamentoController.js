// server/controllers/AgendamentoController.js
import Agendamento from '../models/Agendamento.js';

// const agendamentos = [
//   { id: 1, data: '2023-11-10', hora: '14:00', status: 'ativo', usuarioId: 10 },
//   { id: 2, data: '2023-11-12', hora: '09:00', status: 'concluido', usuarioId: 11 },
//   { id: 3, data: '2023-11-15', hora: '16:30', status: 'ativo', usuarioId: 12 },
// ];

export const listarAgendamentos = async (req, res) => {
  const agendamentos = await Agendamento.find();
  res.json(agendamentos);
};

export const criarAgendamento = async (req, res) => {
  const { data, hora, status, usuarioId, name, servicoPrestado } = req.body;
  console.log(req.body)
  const novo = new Agendamento({ data, hora, status, usuarioId, name, servicoPrestado });
  await novo.save();
  res.status(201).json(novo);
};

// "data": "2023-11-10",
// "hora": "14:00",
// "status": "ativo",
// "usuarioId": "1023"


export const obterAgendamento = async (req, res) => {
  try{
    const { id } = req.params;
    const ag = await Agendamento.findById(id);
    
    if (!Agendamento) {
      return res.status(404).json({ erro: 'Agendamento não encontrado com esse ID' });
    }
    res.json(ag)

  }catch(erro){
    res.status(500).json({ erro: 'Erro no servidor', detalhes: error.message });
  }
};

export const listarparametros = async (req, res) => {
  console.log(req.query);
  res.send();
}

export const atualizarAgendamento = async (req, res) => {
  const { name ,data, hora, status, usuarioId, servicoPrestado } = req.body;
  const ag = await Agendamento.findByIdAndUpdate(req.params.id, { name ,data, hora, status, usuarioId, servicoPrestado}, { new: true });
  res.json(ag);
};

export const deletarAgendamento = async (req, res) => {
  await Agendamento.findByIdAndDelete(req.params.id);
  res.status(204).end();
};

