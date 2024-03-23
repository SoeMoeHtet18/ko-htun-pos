import {stockExchangeActionType} from '../../constants';

export default (state = {}, action) => {
    switch (action.type) {
        case stockExchangeActionType.STOCK_EXCHANGE_DETAILS:
            return action.payload;
        default:
            return state;
    }
};