import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'disponibilidades'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table
        .integer('profissional_id')
        .unsigned()
        .references('id')
        .inTable('profissionais')
        .onDelete('CASCADE')
        .notNullable()

      table.integer('dia_da_semana').notNullable().checkBetween([0, 6]) 
      table.time('hora_inicio').notNullable()
      table.time('hora_fim').notNullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}