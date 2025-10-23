import Route from '@adonisjs/core/services/router'
import RecipesController from '#controllers/recipes_controller'

Route.get('/recipes', [RecipesController, 'index'])
Route.get('/recipes/:id', [RecipesController, 'show'])
Route.post('/recipes', [RecipesController, 'store'])
Route.put('/recipes/:id', [RecipesController, 'update'])
Route.delete('/recipes/:id', [RecipesController, 'destroy'])
