import {stockExchangeActionType} from '../../constants';

export default (state = {}, action) => {
    switch (action.type) {
        case stockExchangeActionType.FETCH_STOCK_EXCHANGES:
            return action.payload;
        case stockExchangeActionType.FETCH_STOCK_EXCHANGE:
            return action.payload;
        case stockExchangeActionType.ADD_STOCK_EXCHANGE:
            return action.payload;
        case stockExchangeActionType.EDIT_STOCK_EXCHANGE:
            return state.map(item => item.id === +action.payload.id ? action.payload : item);
        case stockExchangeActionType.DELETE_STOCK_EXCHANGE:
            return state.filter(item => item.id !== action.payload);
        default:
            return state;
    }
};
