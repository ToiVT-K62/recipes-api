import { BaseSchema } from '@adonisjs/lucid/schema'

export default class IngredientsSchema extends BaseSchema {
  protected tableName = 'ingredients'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.string('unit').nullable()
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
