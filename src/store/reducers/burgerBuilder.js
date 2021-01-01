import * as actionType from '../actions/actionTypes';
import { updateObject } from '../utility';
const initialState = {
	ingredients: null,
	totalPrice: 4,
	error: false,
	building: false
};

const INGREDIENT_PRICE = {
	salad: 0.5,
	bacon: 0.7,
	cheese: 0.4,
	meat: 1.3
};

function addIngredient(state, action) {
	const updatedIngredient = { [action.ingredientName]: state.ingredients[action.ingredientName] + 1 };
	const updatedIngredients = updateObject(state.ingredients, updatedIngredient);
	const updatedState = {
		ingredients: updatedIngredients,
		totalPrice: state.totalPrice + INGREDIENT_PRICE[action.ingredientName],
		building: true
	};
	return updateObject(state, updatedState);
}

function removeIngredient(state, action) {
	const removeIngredient = { [action.ingredientName]: state.ingredients[action.ingredientName] - 1 };
	const removeIngredients = updateObject(state.ingredients, removeIngredient);
	const removeUpdatedState = {
		ingredients: removeIngredients,
		totalPrice: state.totalPrice - INGREDIENT_PRICE[action.ingredientName],
		building: true
	};
	return updateObject(state, removeUpdatedState);
}

function setIngredient(state, action) {
	return updateObject(state, {
		ingredients: {
			salad: action.ingredients.salad,
			bacon: action.ingredients.bacon,
			cheese: action.ingredients.cheese,
			meat: action.ingredients.meat
		},
		totalPrice: 4,
		error: false,
		building: false
	});
}

function fetchIngredient(state, action) {
	return updateObject(state, { error: true });
}

const reducer = (state = initialState, action) => {

	switch (action.type) {
		case actionType.ADD_INGREDIENT: return addIngredient(state, action);
		case actionType.REMOVE_INGREDIENT: return removeIngredient(state, action);
		case actionType.SET_INGREDIENTS: return setIngredient(state, action);
		case actionType.FETCH_INGREDIENTS_FAILED: return fetchIngredient(state, action);
		default: return state;
	}
}

export default reducer;