import {conversionActionType} from '../../constants';

export default (state = {}, action) => {
    switch (action.type) {
        case conversionActionType.FETCH_CONVERSIONS:
            return action.payload;
        case conversionActionType.FETCH_CONVERSION:
            return action.payload;
        case conversionActionType.ADD_CONVERSIONS:
            return action.payload;
        case conversionActionType.EDIT_CONVERSIONS:
            return state.map(item => item.id === +action.payload.id ? action.payload : item);
        case conversionActionType.DELETE_CONVERSIONS:
            return state.filter(item => item.id !== action.payload);
        default:
            return state;
    }
};