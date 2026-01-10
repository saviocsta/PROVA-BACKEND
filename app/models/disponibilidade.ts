import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Profissional from './profissional.js'

export default class Disponibilidade extends BaseModel {
  public static table = 'disponibilidades'
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'profissional_id' })
  declare profissionalId: number

  @column({ columnName: 'dia_da_semana' })
  declare diaDaSemana: number

  @column({ columnName: 'hora_inicio' })
  declare horaInicio: string

  @column({ columnName: 'hora_fim' })
  declare horaFim: string

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime

  @belongsTo(() => Profissional)
  declare profissional: BelongsTo<typeof Profissional>
}