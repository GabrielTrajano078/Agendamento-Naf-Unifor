// server/controllers/UsersController.js
import Users from '../models/Users.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const listarUsers = async (req, res) => {
  const users = await Users.find();
  res.json(users);  
};

export const criarUsers = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    // 1. Verifica se o usuário já existe
    const usuarioExistente = await Users.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ erro: 'Este e-mail já está cadastrado.' });
    }

    // 2. CRIA O HASH DA SENHA
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    // 3. Cria o novo usuário com a senha criptografada
    const novoUsuario = new Users({
      nome,
      email,
      senha: senhaHash, // Salva o hash, não a senha pura
      // 'type' será 'user' por padrão, conforme seu AuthContext
    });

    await novoUsuario.save();

    res.status(201).json({ message: 'Usuário criado com sucesso!' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro no servidor ao criar usuário.' });
  }
};



export const loginUser = async (req, res) => {
  try {
   
    const { email, password } = req.body; 

 
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
    }

    
    const isMatch = await bcrypt.compare(password, user.senha); 
    if (!isMatch) {
      return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
    }

    // 3. GERA O TOKEN (JWT)
    const payload = {
      userId: user._id,
      type: user.type
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 4. Retorna o token e os dados do usuário
    res.json({
      token,
      user: {
        id: user._id,
        name: user.nome,
        email: user.email,
        type: user.type
      }
    });

  } catch (error) {
   
    console.error(error); 
    res.status(500).json({ erro: 'Erro no servidor ao fazer login.' });
  }
};

export const editarUsers = async (req, res) => {
  const {nome, email,senha, } = req.body;
  console.log(req.body)
  const user = await Users.findByIdAndUpdate(req.params.id ,{nome, email,senha, }, {new: true} );
  res.json(user);
}

