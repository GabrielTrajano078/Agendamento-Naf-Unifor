// server/models/Agendamento.js
import mongoose from 'mongoose';

const agendamentoSchema = new mongoose.Schema({
  data: {type: String, required:true},
  hora:{ type: String, required:true},
  usuarioId: {type: String, required:true, unique:true},
  status: {type:String, required:true}, 
  name: {type:String, required:true},
  servicoPrestado: {type: String, required:true}
});

export default mongoose.model('Agendamento', agendamentoSchema);


/**
 * 1. Estrutura básica do Schema





---

2. Criando o modelo

const Usuario = mongoose.model('Usuario', usuarioSchema);


---

3. Campos avançados

Subdocumentos (aninhados)

endereco: {
  rua: String,
  cidade: String,
  estado: String
}

Array de valores

hobbies: [String]

Enum

genero: {
  type: String,
  enum: ['masculino', 'feminino', 'outro']
}


---

4. Validações personalizadas

idade: {
  type: Number,
  validate: {
    validator: function(v) {
      return v % 2 === 0; // Exemplo: idade deve ser par
    },
    message: props => `${props.value} não é um número par!`
  }
}


---

5. Métodos e Statics

Método de instância

usuarioSchema.methods.saudar = function() {
  console.log(`Olá, meu nome é ${this.nome}`);
};

Static (no modelo, não na instância)

usuarioSchema.statics.encontrarPorNome = function(nome) {
  return this.find({ nome: new RegExp(nome, 'i') });
};


---

 * 
 */