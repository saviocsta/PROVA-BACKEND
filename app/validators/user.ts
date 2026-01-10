import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
    vine.object({
        name: vine.string().trim().minLength(3),
        email: vine.string().email(),
        password: vine.string().minLength(6),
        tipo: vine.enum(['paciente', 'profissional']),
    })
)

export const loginValidator = vine.compile(
    vine.object({
        email: vine.string().email(),
        password: vine.string(),
    })
)