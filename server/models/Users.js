// server/models/users.js
import mongoose from 'mongoose';


const usersSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  senha: {
    type: String,
    min: 0,
    max: 120,
    required: true
  },
  type: {
    type: String,
    enum: ['user', 'admin'], // Só permite 'user' ou 'admin'
    default: 'user'         // Define 'user' como padrão
  },
  criadoEm: {
    type: Date,
    default: Date.now
  },
  ativo: {
    type: Boolean,
    default: true
  }
});


export default mongoose.connection.useDb('sample_mflix').model('Users', usersSchema);


