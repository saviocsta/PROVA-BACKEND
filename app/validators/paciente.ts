import vine from '@vinejs/vine'

export const updatePacienteValidator = vine.compile(
  vine.object({
    nome: vine.string().trim().minLength(3).optional(),
    email: vine.string().email().optional(),
    senha: vine.string().minLength(6).optional(),
  })
)