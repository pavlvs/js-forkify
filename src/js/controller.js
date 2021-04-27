import 'core-js/stable'
import 'regenerator-runtime/runtime'
import * as model from './model'
import { MODAL_CLOSE_SECONDS } from './config'
import bookmarksView from './views/bookmarksView'
import paginationView from './views/paginationView'
import recipeView from './views/recipeView'
import resultsView from './views/resultsView'
import searchView from './views/searchView'
import addRecipeView from './views/addRecipeView'


if (module.hot) {
  module.hot.accept()
}

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1)

    if (!id) return
    recipeView.renderSpinner()

    // Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage())
    bookmarksView.update(model.state.bookmarks)

    // 1. Loading the recipe
    await model.loadRecipe(id)

    // 2. Render the recipe
    recipeView.render(model.state.recipe)

  } catch (err) {
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

const controlServings = function (newServings) {
  // update recipe servings (in state)
  model.updateServings(newServings)

  // update the recipe view
  // recipeView.render(model.state.recipe)
  recipeView.update(model.state.recipe)
}

const controlAddBookmark = function () {
  // Add or remove a bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe)
  }
  else {
    model.deleteBookmark(model.state.recipe.id)
  }

  // Update recipe view
  recipeView.update(model.state.recipe)

  // Render bookmarks
  bookmarksView.render(model.state.bookmarks)
}

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks)
}

const controlAddRecipe = async function (newRecipe) {

  try {
    // Show loading spinner
    addRecipeView.renderSpinner()

    // Upload new recipe data
    await model.uploadRecipe(newRecipe)
    console.log(model.state.recipe)

    // Render recipe
    recipeView.render(model.state.recipe)

    // Success _message
    addRecipeView.renderMessage()

    // Render bookmarks view
    bookmarksView.render(model.state.bookmarks)

    // Change id in the url
    window.history.pushState(null, '', `#${model.state.recipe.id}`)

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow()
    }, MODAL_CLOSE_SECONDS * 1000)

  } catch (err) {
    addRecipeView.renderError(err)
  }
}

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks)
  recipeView.addHandlerRender(controlRecipes)
  recipeView.addHandlerUpdateServings(controlServings)
  recipeView.addHandlerAddBookmark(controlAddBookmark)
  searchView.addHandlerSearch(controlSearchResults)
  paginationView.addHandlerClick(controlPagination)
  addRecipeView.addHandlerUpload(controlAddRecipe)
}

init()