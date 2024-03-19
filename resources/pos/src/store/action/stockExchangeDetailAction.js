import apiConfig from '../../config/apiConfig';
import {apiBaseURL, stockExchangeActionType, toastType} from '../../constants';
import {addToast} from './toastAction';
import {setLoading} from './loadingAction';

export const getStockExchangeDetail = (stockExchangeId, isLoading = true) => async (dispatch) => {
    if (isLoading) {
        dispatch(setLoading(true))
    }
    apiConfig.get(apiBaseURL.STOCK_EXCHANGES + '/' + stockExchangeId)
        .then((response) => {
            dispatch({type: stockExchangeActionType.STOCK_EXCHANGE_DETAILS, payload: response.data.data})
            if (isLoading) {
                dispatch(setLoading(false))
            }
        })
        .catch(({response}) => {
            dispatch(addToast(
                {text: response.data.message, type: toastType.ERROR}));
        });
};