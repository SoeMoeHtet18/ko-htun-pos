import apiConfig from '../../config/apiConfig';
import {apiBaseURL, conversionActionType, toastType} from '../../constants';
import {addToast} from './toastAction';
import {setLoading} from './loadingAction';

export const getConversionDetails = (conversionId, isLoading = true) => async (dispatch) => {
    if (isLoading) {
        dispatch(setLoading(true))
    }
    apiConfig.get(apiBaseURL.CONVERSIONS + '/' + conversionId)
        .then((response) => {
            dispatch({type: conversionActionType.CONVERSION_DETAILS, payload: response.data.data})
            if (isLoading) {
                dispatch(setLoading(false))
            }
        })
        .catch(({response}) => {
            dispatch(addToast(
                {text: response.data.message, type: toastType.ERROR}));
        });
};