import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'consultas'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary() 
      
      table
        .integer('paciente_id')
        .unsigned()
        .references('id')
        .inTable('pacientes')
        .onDelete('CASCADE')
        .notNullable()

      table
        .integer('profissional_id')
        .unsigned()
        .references('id')
        .inTable('profissionais')
        .onDelete('CASCADE')
        .notNullable()

      table.date('data').notNullable()
      table.time('hora').notNullable()
      table.enum('status', ['agendada', 'cancelada', 'concluida']).defaultTo('agendada')

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}