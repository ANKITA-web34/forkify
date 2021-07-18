// import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE } from './config.js';
import { getJSON } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultPerPage : RES_PER_PAGE,
  },
  bookmarks: [],
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}`);
 
    const { recipe } = data.data;    
    state.recipe = {
      id: recipe.id,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      publisher: recipe.publisher,
      title: recipe.title,
      ingredients: recipe.ingredients,
      sourceUrl: recipe.source_url,
      imageUrl: recipe.image_url,
    };

    if(state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else 
      state.recipe.bookmarked = false;    
   
    console.log(state.recipe);
  } catch (err) {
      console.error(err);
      throw err;
  }
};

//Search Functionality
export const loadSearchResult = async function(query) {
  try {
    state.search.query = query;

    const data = await getJSON(`${API_URL}?search=${query}`);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
      };
    });
    state.search.page = 1;
  } catch(err) {
    console.error(err);
    throw err;
  }
};

export const getSearchResultPage = function(page = state.search.page ) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultPerPage;  //0;
  const end = page * state.search.resultPerPage; //9;

  return state.search.results.slice(start, end);
};

export const updateServings = function(newServings) {
  // newQuantity = oldQuantiiy(3) * newServings(2) / oldServings(8) //
  state.recipe.ingredients.forEach(ing => {
  ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
 });

 //update the servings
 state.recipe.servings = newServings;
};

export const addBookmark = function(recipe) {
  //Add bookmark
  state.bookmarks.push(recipe);
  
  //mark current recipe as bookmark
  if(recipe.id === state.recipe.id) 
    state.recipe.bookmarked = true;
}

export const deleteBookmark = function(id) {
  //delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  //mark current recipe as not bookmark
  if(id === state.recipe.id) 
    state.recipe.bookmarked = false;
}