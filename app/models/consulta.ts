import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Paciente from './paciente.js'
import Profissional from './profissional.js'

export default class Consulta extends BaseModel {
   public static table = 'consultas'
   
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare pacienteId: number

  @column()
  declare profissionalId: number

  @column.date() 
  declare data: DateTime

  @column()
  declare hora: string

  @column()
  declare status: 'agendada' | 'cancelada' | 'concluida'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Paciente)
  declare paciente: BelongsTo<typeof Paciente>

  @belongsTo(() => Profissional)
  declare profissional: BelongsTo<typeof Profissional>
}