import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Disponibilidade from './disponibilidade.js'
import Consulta from './consulta.js'

export default class Profissional extends BaseModel {
  public static table = 'profissionais'
  
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare especialidade: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => Disponibilidade)
  declare disponibilidades: HasMany<typeof Disponibilidade>

  @hasMany(() => Consulta)
  declare consultas: HasMany<typeof Consulta>
}