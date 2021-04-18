import { API_URL, RESULTS_PER_PAGE } from './config'
import { getJSON } from './helpers'

export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        resultsPerPage: RESULTS_PER_PAGE,
        page: 1
    },
}

export const loadRecipe = async function (id) {

    try {
        const data = await getJSON(`${API_URL}${id}`)

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

export const loadSearchResults = async function (query) {
    try {
        state.search.query = query
        const data = await getJSON(`${API_URL}?search=${query}`)

        state.search.results = data.data.recipes.map(recipe => {
            return {
                id: recipe.id,
                title: recipe.title,
                publisher: recipe.publisher,
                image: recipe.image_url,
            }
        })
    } catch (err) {
        console.error(err)
        throw err
    }
}

export const getSearchResultsPage = function (page = state.search.page) {
    state.search.page = page

    const start = (page - 1) * state.search.resultsPerPage// 0
    const end = page * state.search.resultsPerPage // 9

    return state.search.results.slice(start, end)
}

export const updateServings = function (newServings) {
    state.recipe.ingredients.forEach(ingredient => {
        ingredient.quantity = ingredient.quantity * newServings / state.recipe.servings
    })

    state.recipe.servings = newServings
}