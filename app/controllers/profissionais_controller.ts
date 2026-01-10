import type { HttpContext } from '@adonisjs/core/http'
import Profissional from '#models/profissional'
import User from '#models/user'
import { createProfissionalValidator } from '#validators/profissional'

export default class ProfissionaisController {
  async index({ response }: HttpContext) {
    try {
      const profissionais = await Profissional.query()
        .preload('user')
        .select('id', 'especialidade', 'userId')
      
      return response.ok({
        profissionais: profissionais
      })
    } catch (error: any) {
      return response.badRequest({
        message: 'Erro ao listar profissionais',
        error: error.message
      })
    }
  }
  async update({ request, response, auth }: HttpContext) {
  try {
    const usuario = await auth.authenticate() as User
    
    if (usuario.tipo !== 'profissional') {
      return response.forbidden('Apenas profissionais podem atualizar este perfil')
    }
    
    const data = await request.validateUsing(createProfissionalValidator)
    
    // Busca o profissional (deve existir por causa do registro)
    const profissional = await Profissional.query()
      .where('userId', usuario.id)
      .first()
    
    if (!profissional) {
      return response.notFound('Perfil profissional não encontrado')
    }
    
    // ATUALIZA especialidade
    profissional.merge(data)
    await profissional.save()
    
    return response.ok({
      message: 'Perfil profissional atualizado com sucesso',
      profissional: profissional
    })
  } catch (error: any) {
    return response.badRequest({
      message: 'Erro ao atualizar perfil profissional',
      error: error.message
    })
  }
}

  async show({ params, response }: HttpContext) {
    try {
      const profissional = await Profissional.query()
        .where('id', params.id)
        .preload('user')
        .preload('disponibilidades')
        .first()
      
      if (!profissional) {
        return response.notFound('Profissional não encontrado')
      }
      
      return response.ok({
        profissional: profissional
      })
    } catch (error: any) {
      return response.badRequest({
        message: 'Erro ao buscar profissional',
        error: error.message
      })
    }
  }

async store({ request, response, auth }: HttpContext) {
  try {
    const usuario = await auth.authenticate() as User
    
    if (usuario.tipo !== 'profissional') {
      return response.forbidden('Apenas profissionais podem criar este perfil')
    }
    
    const data = await request.validateUsing(createProfissionalValidator)
    
    // Busca ou cria perfil profissional
    let profissional = await Profissional.query()
      .where('userId', usuario.id)
      .first()
    
    if (profissional) {
      // Se já existe, ATUALIZA
      profissional.merge(data)
      await profissional.save()
      
      return response.ok({
        message: 'Perfil profissional ATUALIZADO com sucesso',
        profissional: profissional
      })
    } else {
      // Se não existe, CRIA
      profissional = await Profissional.create({
        userId: usuario.id,
        ...data
      })
      
      return response.created({
        message: 'Perfil profissional criado com sucesso',
        profissional: profissional
      })
    }
  } catch (error: any) {
    return response.badRequest({
      message: 'Erro ao criar/atualizar perfil profissional',
      error: error.message
      })
  }
  }
}