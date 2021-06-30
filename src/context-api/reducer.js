export const initialState = {
	BASE_URL: 'https://test.anchoratechs.com',
	categories: undefined,
	products: undefined,
}

export const actionTypes = {
	SET_CATEGORIES: 'SET_CATEGORIES',
	SET_PRODUCTS: 'SET_PRODUCTS'
}

const reducer = (state, action) => {
	console.log(action)

	switch (action.type) {
		case actionTypes.SET_CATEGORIES:
			return {
				...state,
				categories: action.categories,
			}
		case actionTypes.SET_PRODUCTS:
			return {
				...state,
				products: action.products,
			}
		default:
			return state
	}
}

export default reducer 