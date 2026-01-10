import type { HttpContext } from '@adonisjs/core/http'
import Consulta from '#models/consulta'
import Disponibilidade from '#models/disponibilidade'
import Paciente from '#models/paciente'
import Profissional from '#models/profissional'
import User from '#models/user'
import { createConsultaValidator, updateConsultaValidator } from '#validators/consulta'
import { DateTime } from 'luxon'

export default class ConsultasController {
  async store({ request, response, auth }: HttpContext) {
    try {
      const usuario = await auth.authenticate() as User
      
      if (usuario.tipo !== 'paciente') {
        return response.forbidden('Apenas pacientes podem agendar consultas')
      }
      
      const { profissional_id, data, hora } = await request.validateUsing(createConsultaValidator)
      
      const paciente = await Paciente.query()
        .where('userId', usuario.id)
        .first()
      
      if (!paciente) {
        return response.notFound('Perfil paciente não encontrado')
      }
      
      const profissional = await Profissional.query()
        .where('id', profissional_id)
        .first()
      
      if (!profissional) {
        return response.notFound('Profissional não encontrado')
      }
      
      const dataConsulta = DateTime.fromISO(data)
      if (!dataConsulta.isValid) {
        return response.badRequest('Data inválida')
      }
      
      const diaSemana = dataConsulta.weekday % 7
      
      const disponibilidade = await Disponibilidade.query()
        .where('profissionalId', profissional_id)
        .where('diaDaSemana', diaSemana)
        .andWhere('horaInicio', '<=', hora)
        .andWhere('horaFim', '>=', hora)
        .first()
      
      if (!disponibilidade) {
        return response.badRequest('Profissional não está disponível neste horário')
      }
      
      const consultaConflitante = await Consulta.query()
        .where('profissionalId', profissional_id)
        .where('data', dataConsulta.toISODate()) 
        .where('hora', hora)
        .whereNot('status', 'cancelada')
        .first()
      
      if (consultaConflitante) {
        return response.conflict('Horário já ocupado para este profissional')
      }
      

      const consulta = await Consulta.create({
        pacienteId: paciente.id,
        profissionalId: profissional_id,
        data: dataConsulta, 
        hora: hora,
        status: 'agendada'
      })
      
      return response.created({
        message: 'Consulta agendada com sucesso',
        consulta: consulta
      })
    } catch (error: any) {
      return response.badRequest({
        message: 'Erro ao agendar consulta',
        error: error.message
      })
    }
  }

  async index({ response, auth }: HttpContext) {
    try {

      const usuario = await auth.authenticate() as User
      
      if (usuario.tipo !== 'paciente') {
        return response.forbidden('Apenas pacientes podem ver suas consultas')
      }
      
      const paciente = await Paciente.query()
        .where('userId', usuario.id)
        .first()
      
      if (!paciente) {
        return response.notFound('Perfil paciente não encontrado')
      }
      
      const consultas = await Consulta.query()
        .where('pacienteId', paciente.id)
        .preload('profissional', (query) => {
          query.preload('user')
        })
        .orderBy('data', 'desc')
        .orderBy('hora', 'desc')
      
      return response.ok({
        consultas: consultas
      })
    } catch (error: any) {
      return response.badRequest({
        message: 'Erro ao listar consultas',
        error: error.message
      })
    }
  }

  async update({ params, request, response, auth }: HttpContext) {
    try {

      const usuario = await auth.authenticate() as User
      
      if (usuario.tipo !== 'paciente') {
        return response.forbidden('Apenas pacientes podem atualizar consultas')
      }
      
     
      const paciente = await Paciente.query()
        .where('userId', usuario.id)
        .first()
      
      if (!paciente) {
        return response.notFound('Perfil paciente não encontrado')
      }
      
      const consulta = await Consulta.query()
        .where('id', params.id)
        .where('pacienteId', paciente.id)
        .first()
      
      if (!consulta) {
        return response.notFound('Consulta não encontrada')
      }
      
      if (consulta.status === 'cancelada') {
        return response.badRequest('Consultas canceladas não podem ser atualizadas')
      }
      
      const data = await request.validateUsing(updateConsultaValidator)
      
      if (data.status && data.status !== 'concluida') {
        return response.badRequest('Só é permitido atualizar para status "concluida"')
      }
      
      consulta.merge(data)
      await consulta.save()
      
      return response.ok({
        message: 'Consulta atualizada com sucesso',
        consulta: consulta
      })
    } catch (error: any) {
      return response.badRequest({
        message: 'Erro ao atualizar consulta',
        error: error.message
      })
    }
  }

  async destroy({ params, response, auth }: HttpContext) {
    try {
 
      const usuario = await auth.authenticate() as User
      
      if (usuario.tipo !== 'paciente') {
        return response.forbidden('Apenas pacientes podem cancelar consultas')
      }
      

      const paciente = await Paciente.query()
        .where('userId', usuario.id)
        .first()
      
      if (!paciente) {
        return response.notFound('Perfil paciente não encontrado')
      }
      
      const consulta = await Consulta.query()
        .where('id', params.id)
        .where('pacienteId', paciente.id)
        .first()
      
      if (!consulta) {
        return response.notFound('Consulta não encontrada')
      }
      
      if (consulta.status !== 'agendada') {
        return response.badRequest('Apenas consultas agendadas podem ser canceladas')
      }
      
      consulta.status = 'cancelada'
      await consulta.save()
      
      return response.ok({ 
        message: 'Consulta cancelada com sucesso' 
      })
    } catch (error: any) {
      return response.badRequest({
        message: 'Erro ao cancelar consulta',
        error: error.message
      })
    }
  }
}