import apiConfig from "../../config/apiConfig";
import { apiBaseURL, conversionActionType, toastType } from "../../constants";
import { addToast } from "./toastAction";
import {
    addInToTotalRecord,
    removeFromTotalRecord,
    setTotalRecord,
} from "./totalRecordAction";
import { setLoading } from "./loadingAction";
import requestParam from "../../shared/requestParam";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { setSavingButton } from "./saveButtonAction";

export const fetchConversions =
    (filter = {}, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        const admin = true;
        let url = apiBaseURL.CONVERSIONS;
        
        if (
            !_.isEmpty(filter) &&
            (filter.page || filter.pageSize || filter.search)
        ) {
            url += requestParam(filter, admin, null, null, url);
        }
        await apiConfig
            .get(url)
            .then((response) => {
                dispatch({
                    type: conversionActionType.FETCH_CONVERSIONS,
                    payload: response.data.data,
                });
                dispatch(
                    setTotalRecord(
                        response.data.meta.total !== undefined &&
                            response.data.meta.total >= 0
                            ? response.data.meta.total
                            : response.data.data.total
                    )
                );
                if (isLoading) {
                    dispatch(setLoading(false));
                }
            })
            .catch(({ response }) => {
                dispatch(
                    addToast({
                        text: response.data.message,
                        type: toastType.ERROR,
                    })
                );
            });
    };

export const fetchConversion =
    (conversionId, singleConversion, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        await apiConfig
            .get(
                apiBaseURL.CONVERSIONS + "/" + conversionId + "/edit",
                singleConversion
            )
            .then((response) => {
                dispatch({
                    type: conversionActionType.FETCH_CONVERSION,
                    payload: response.data.data,
                });
                if (isLoading) {
                    dispatch(setLoading(false));
                }
            })
            .catch(({ response }) => {
                dispatch(
                    addToast({
                        text: response.data.message,
                        type: toastType.ERROR,
                    })
                );
            });
    };

export const addConversion = (conversion, navigate) => async (dispatch) => {
    dispatch(setSavingButton(true));
    await apiConfig
        .post(apiBaseURL.CONVERSIONS, conversion)
        .then((response) => {
            dispatch({
                type: conversionActionType.ADD_CONVERSIONS,
                payload: response.data.data,
            });
            dispatch(
                addToast({
                    text: getFormattedMessage(
                        "conversions.success.create.message"
                    ),
                })
            );
            dispatch(addInToTotalRecord(1));
            navigate("/app/conversions");
            dispatch(setSavingButton(false));
        })
        .catch(({ response }) => {
            dispatch(setSavingButton(false));
            dispatch(
                addToast({ text: response.data.message, type: toastType.ERROR })
            );
        });
};

export const editConversion =
    (conversionId, conversion, navigate) => async (dispatch) => {
        dispatch(setSavingButton(true));
        await apiConfig
            .patch(apiBaseURL.CONVERSIONS + "/" + conversionId, conversion)
            .then((response) => {
                dispatch(
                    addToast({
                        text: getFormattedMessage(
                            "conversions.success.edit.message"
                        ),
                    })
                );
                navigate("/app/conversions");
                dispatch({
                    type: conversionActionType.EDIT_CONVERSIONS,
                    payload: response.data.data,
                });
                dispatch(setSavingButton(false));
            })
            .catch(({ response }) => {
                dispatch(setSavingButton(false));
                response &&
                    dispatch(
                        addToast({
                            text: response.data.message,
                            type: toastType.ERROR,
                        })
                    );
            });
    };

export const deleteConversion = (conversionId) => async (dispatch) => {
    await apiConfig
        .delete(apiBaseURL.CONVERSIONS + "/" + conversionId)
        .then(() => {
            dispatch(removeFromTotalRecord(1));
            dispatch({
                type: conversionActionType.DELETE_CONVERSIONS,
                payload: conversionId,
            });
            dispatch(
                addToast({
                    text: getFormattedMessage(
                        "conversions.success.delete.message"
                    ),
                })
            );
        })
        .catch(({ response }) => {
            dispatch(
                addToast({ text: response.data.message, type: toastType.ERROR })
            );
        });
};
