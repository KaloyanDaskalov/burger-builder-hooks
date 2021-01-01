import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
	orders: [],
	loading: false,
	purchased: false
};

function purchaseSuccess(state, action) {
	const order = updateObject(action.orderData, { id: action.id });
	return updateObject(state, {
		loading: false,
		purchased: true,
		orders: state.orders.concat(order)
	});
}

function fetchSuccess(state, action) {
	return updateObject(state, {
		loading: false,
		orders: action.orders
	});
}

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.PURCHASE_BURGER_SUCCESS: return purchaseSuccess(state, action);
		case actionTypes.PURCHASE_BURGER_FAIL: return updateObject(state, { loading: false });
		case actionTypes.PURCHASE_BURGER_START: return updateObject(state, { loading: true });
		case actionTypes.PURCHASE_INIT: return updateObject(state, { purchased: false });
		case actionTypes.FETCH_ORDERS_START: return updateObject(state, { loading: true });
		case actionTypes.FETCH_ORDERS_SUCCESS: return fetchSuccess(state, action);
		case actionTypes.FETCH_ORDERS_FAIL: return updateObject(state, { loading: false });
		default: return state;
	}
};

export default reducer;