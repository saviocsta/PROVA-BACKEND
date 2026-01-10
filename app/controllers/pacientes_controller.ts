import type { HttpContext } from '@adonisjs/core/http'
import Paciente from '#models/paciente'
import User from '#models/user'
import { updatePacienteValidator } from '#validators/paciente'
import hash from '@adonisjs/core/services/hash'

export default class PacientesController {
  async show({ auth, response }: HttpContext) {
    try {
      const usuario = await auth.authenticate() as User
      
      if (usuario.tipo !== 'paciente') {
        return response.forbidden({ message: 'Acesso permitido apenas para pacientes' })
      }
      
      const paciente = await Paciente.query()
        .where('userId', usuario.id)
        .preload('user')
        .preload('consultas', (query) => {
          query.preload('profissional', (profQuery) => {
            profQuery.preload('user')
          })
        })
        .first()
      
      if (!paciente) {
        return response.notFound({ message: 'Paciente não encontrado' })
      }
      
      return response.ok(paciente)
    } catch (error: any) {
      return response.badRequest({
        message: 'Erro ao buscar paciente',
        error: error.message
      })
    }
  }

  async update({ auth, request, response }: HttpContext) {
    try {
      const usuario = await auth.authenticate() as User
      
      if (usuario.tipo !== 'paciente') {
        return response.forbidden({ message: 'Acesso permitido apenas para pacientes' })
      }
      
      const data = await request.validateUsing(updatePacienteValidator)
      
      if (data.email && data.email !== usuario.email) {
        const emailExistente = await User.query()
          .where('email', data.email)
          .whereNot('id', usuario.id)
          .first()
        
        if (emailExistente) {
          return response.conflict({ message: 'Email já está em uso' })
        }
      }
      
      if (data.nome) {
        usuario.name = data.nome
      }
      
      if (data.email) {
        usuario.email = data.email
      }
      
      if (data.senha) {
        usuario.password = await hash.make(data.senha)
      }
      
      await usuario.save()
      
      return response.ok({
        message: 'Paciente atualizado com sucesso',
        paciente: {
          id: usuario.id,
          name: usuario.name,
          email: usuario.email,
          tipo: usuario.tipo
        }
      })
    } catch (error: any) {
      return response.badRequest({
        message: 'Erro ao atualizar paciente',
        error: error.message
      })
    }
  }
}