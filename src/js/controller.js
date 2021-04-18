import 'core-js/stable'
import 'regenerator-runtime/runtime'
import * as model from './model'
import paginationView from './views/paginationView'
import recipeView from './views/recipeView'
import resultsView from './views/resultsView'
import searchView from './views/searchView'

if (module.hot) {
  module.hot.accept()
}

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1)

    if (!id) return
    recipeView.renderSpinner()

    // 1. Loading the recipe
    await model.loadRecipe(id)

    // 2. Render the recipe
    recipeView.render(model.state.recipe)

  } catch (err) {
    console.log(err)
    recipeView.renderError()
  }
}

const controlSearchResults = async function (query) {
  try {
    resultsView.renderSpinner()

    // 1. Get search query
    query = searchView.getQuery()
    if (!query) return

    // 2. load search results
    await model.loadSearchResults(query)

    // 3. Render results
    resultsView.render(model.getSearchResultsPage())

    // 4. Render initial pagination buttons
    paginationView.render(model.state.search)

  } catch (error) {
    console.log(error)
  }
}

const controlPagination = function (goToPage) {
  // 3. Render new results
  resultsView.render(model.getSearchResultsPage(goToPage))

  // 4. Render new pagination buttons
  paginationView.render(model.state.search)
}

const init = function () {
  recipeView.addHandlerRender(controlRecipes)
  searchView.addHandlerSearch(controlSearchResults)
  paginationView.addHandlerClick(controlPagination)
}

init()