import vine from '@vinejs/vine'

export const createProfissionalValidator = vine.compile(
  vine.object({
    especialidade: vine.string().trim().minLength(3),
  })
)