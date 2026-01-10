import vine from '@vinejs/vine'

export const createDisponibilidadeValidator = vine.compile(
  vine.object({
    dia_da_semana: vine.number().min(0).max(6),
    hora_inicio: vine.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    hora_fim: vine.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  })
)