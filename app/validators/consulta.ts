import vine from '@vinejs/vine'

export const createConsultaValidator = vine.compile(
  vine.object({
    profissional_id: vine.number().positive(),
    data: vine.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    hora: vine.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  })
)

export const updateConsultaValidator = vine.compile(
  vine.object({
    status: vine.enum(['agendada', 'concluida']),
  })
)