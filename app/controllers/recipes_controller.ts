import Recipe from '#models/recipe'
import Ingredient from '#models/ingredient'
import type { HttpContext } from '@adonisjs/core/http'

export default class RecipesController {
  async index({ request }: HttpContext) {
    const { search, ingredient } = request.qs()

    const query = Recipe.query().preload('ingredients')

    if (search) {
      query.whereRaw('LOWER(title) LIKE ?', [`%${search.toLowerCase()}%`])
    }

    if (ingredient) {
      query.whereHas('ingredients', (q) => {
        q.whereRaw('LOWER(name) LIKE ?', [`%${ingredient.toLowerCase()}%`])
      })
    }

    return await query
  }

  async show({ params }: HttpContext) {
    const recipe = await Recipe.query()
      .where('id', params.id)
      .preload('ingredients')
      .firstOrFail()

    return recipe
  }


  async store({ request }: HttpContext) {
    const data = request.only(['title', 'description', 'steps', 'imageUrl', 'ingredients'])

    const recipe = await Recipe.create({
      title: data.title,
      description: data.description,
      steps: data.steps,
      imageUrl: data.imageUrl,
    })

    if (Array.isArray(data.ingredients) && data.ingredients.length) {
      for (const ing of data.ingredients) {
        const ingredient = await Ingredient.firstOrCreate(
          { name: ing.name },
          { unit: ing.unit }
        )

        await recipe.related('ingredients').attach({
          [ingredient.id]: { quantity: ing.quantity || 1 },
        })
      }
    }

    await recipe.load('ingredients')

    return recipe
  }

  async update({ params, request, response }: HttpContext) {
    const data = request.only(['title', 'description', 'steps', 'imageUrl', 'ingredients'])
    const recipe = await Recipe.findOrFail(params.id)

    recipe.merge({
      title: data.title,
      description: data.description,
      steps: data.steps,
      imageUrl: data.imageUrl,
    })
    await recipe.save()

    if (Array.isArray(data.ingredients)) {
      await recipe.related('ingredients').detach()

      for (const ing of data.ingredients) {
        const ingredient = await Ingredient.firstOrCreate(
          { name: ing.name },
          { unit: ing.unit }
        )

        await recipe.related('ingredients').attach({
          [ingredient.id]: { quantity: ing.quantity || 1 },
        })
      }
    }

    await recipe.load('ingredients')

    return response.ok(recipe)
  }

  async destroy({ params, response }: HttpContext) {
    const recipe = await Recipe.findOrFail(params.id)

    await recipe.related('ingredients').detach()

    await recipe.delete()

    return response.noContent()
  }
}
