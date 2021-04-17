import { API_URL } from './config'
import { getJSON } from './helpers'
export const state = {
    recipe: {}
}

export const loadRecipe = async function (id) {

    try {
        const data = await getJSON(`${API_URL}/${id}`)

        let { recipe } = data.data
        state.recipe = {
            id: recipe.id,
            title: recipe.title,
            publisher: recipe.publisher,
            sourceURL: recipe.source_url,
            image: recipe.image_url,
            servings: recipe.servings,
            cookingTime: recipe.cooking_time,
            ingredients: recipe.ingredients
        }
    } catch (err) {
        // Temporary error handling
        console.error(err)
        throw err
    }
}