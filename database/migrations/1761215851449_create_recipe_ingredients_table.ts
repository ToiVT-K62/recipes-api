import { BaseSchema } from '@adonisjs/lucid/schema'

export default class RecipeIngredientsSchema extends BaseSchema {
  protected tableName = 'recipe_ingredients'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('recipe_id').unsigned().references('recipes.id').onDelete('CASCADE')
      table.integer('ingredient_id').unsigned().references('ingredients.id').onDelete('CASCADE')
      table.float('quantity').nullable()
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
