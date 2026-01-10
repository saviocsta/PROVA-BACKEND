import type { HttpContext } from '@adonisjs/core/http'
import Disponibilidade from '#models/disponibilidade'
import Profissional from '#models/profissional'
import User from '#models/user'
import { createDisponibilidadeValidator } from '#validators/disponibilidade'

export default class DisponibilidadesController {
  async store({ request, response, auth }: HttpContext) {
    try {
      const usuario = await auth.authenticate() as User
      
      if (usuario.tipo !== 'profissional') {
        return response.forbidden('Apenas profissionais podem criar disponibilidades')
      }
      
      const data = await request.validateUsing(createDisponibilidadeValidator)
      
      const profissional = await Profissional.query()
        .where('userId', usuario.id)
        .first()
      
      if (!profissional) {
        return response.notFound('Perfil profissional não encontrado')
      }
      
      const disponibilidade = await Disponibilidade.create({
        profissionalId: profissional.id,
        diaDaSemana: data.dia_da_semana,
        horaInicio: data.hora_inicio,
        horaFim: data.hora_fim
      })
      
      return response.created({
        message: 'Disponibilidade criada com sucesso',
        disponibilidade: disponibilidade
      })
    } catch (error: any) {
      return response.badRequest({
        message: 'Erro ao criar disponibilidade',
        error: error.message
      })
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const disponibilidades = await Disponibilidade.query()
        .where('profissionalId', params.profissional_id)
      
      return response.ok({
        disponibilidades: disponibilidades
      })
    } catch (error: any) {
      return response.badRequest({
        message: 'Erro ao listar disponibilidades',
        error: error.message
      })
    }
  }
}