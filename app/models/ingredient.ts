import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import Recipe from './recipe.js'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'

export default class Ingredient extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare unit: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @manyToMany(() => Recipe, {
    pivotTable: 'recipe_ingredients',
    pivotColumns: ['quantity'],
  })
  declare ingredients: ManyToMany<typeof Recipe>
}
