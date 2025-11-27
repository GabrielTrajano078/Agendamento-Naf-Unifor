// server/routes/agendamentoRoutes.js

import express from 'express';
import {
  listarAgendamentos,
  obterAgendamento,
  criarAgendamento,
  atualizarAgendamento,
  deletarAgendamento,
  listarparametros
} from '../controllers/AgendamentoController.js';

import {listarUsers} from '../controllers/UsersController.js';
 
const router = express.Router();


// router.get('/users', listarUsers);

router.get('/listarAg', listarAgendamentos);
router.get('/listaId/:id', obterAgendamento);
router.post('/criarAg', criarAgendamento);
router.put('/:id', atualizarAgendamento);
router.delete('/excluirAg/:id', deletarAgendamento);

router.get('/listarparametros', listarparametros);
// Rota inválida dentro de /agendamento/*
router.use((req, res) => {
  res.status(404).json({
    erro: 'Subrota de /agendamento não encontrada',
    caminho: req.originalUrl
  });
});


export default router;
