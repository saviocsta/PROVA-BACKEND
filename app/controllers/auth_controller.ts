import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Profissional from '#models/profissional'
import { registerValidator, loginValidator } from '#validators/auth'
import Paciente from '#models/paciente'

export default class AuthController {
async register({ request, response }: HttpContext) {
  try {
    const data = await request.validateUsing(registerValidator)
    
    const usuarioExistente = await User.findBy('email', data.email)
    if (usuarioExistente) {
      return response.conflict({ message: 'Email já cadastrado' })
    }
    
    const usuario = await User.create({
      name: data.nome,
      email: data.email,
      password: data.senha,
      tipo: data.tipo
    })
    
    
    if (data.tipo === 'paciente') {
      await Paciente.create({
        userId: usuario.id
      })
    } else if (data.tipo === 'profissional') {
      await Profissional.create({
        userId: usuario.id,
        especialidade: 'Especialidade não definida'  
      })
    }
    
    return response.created({
      message: 'Usuário criado com sucesso',
      usuario: {
        id: usuario.id,
        name: usuario.name,
        email: usuario.email,
        tipo: usuario.tipo
      }
    })
  } catch (error: any) {
    return response.badRequest({
      message: 'Erro ao criar usuário',
      error: error.message
    })
  }
}

  async login({ request, response }: HttpContext) {
    try {
      const { email, senha } = await request.validateUsing(loginValidator)
      
      const usuario = await User.query()
        .where('email', email)
        .first()
      
      if (!usuario) {
        return response.unauthorized({ message: 'Credenciais inválidas' })
      }
      
      const senhaValida = await usuario.verifyPassword(senha)
      if (!senhaValida) {
        return response.unauthorized({ message: 'Credenciais inválidas' })
      }
      

      const token = await User.accessTokens.create(usuario)
      
      return response.ok({
        message: 'Login realizado com sucesso',
        token: {
          type: 'bearer',
          value: token.value!.release(),
          expiresAt: token.expiresAt
        },
        usuario: {
          id: usuario.id,
          name: usuario.name,
          email: usuario.email,
          tipo: usuario.tipo
        }
      })
    } catch (error: any) {
      return response.unauthorized({ 
        message: 'Credenciais inválidas',
        error: error.message
      })
    }
  }
}