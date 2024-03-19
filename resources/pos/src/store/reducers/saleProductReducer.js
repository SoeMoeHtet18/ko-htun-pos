import {productActionType} from '../../constants';

export default (state = [], action) => {
    switch (action.type) {
        case productActionType.FETCH_PRODUCTS_BY_SALE:
            return action.payload;
        default:
            return state;
    }
};
