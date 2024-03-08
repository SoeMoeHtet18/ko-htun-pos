import {conversionActionType} from '../../constants';

export default (state = {}, action) => {
    switch (action.type) {
        case conversionActionType.CONVERSION_DETAILS:
            return action.payload;
        default:
            return state;
    }
};