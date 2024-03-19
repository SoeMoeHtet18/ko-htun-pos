import apiConfig from "../../config/apiConfig";
import { apiBaseURL, stockExchangeActionType, toastType } from "../../constants";
import { addToast } from "./toastAction";
import {
    addInToTotalRecord,
    removeFromTotalRecord,
    setTotalRecord,
} from "./totalRecordAction";
import { setLoading } from "./loadingAction";
import requestParam from "../../shared/requestParam";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { callSaleApi } from "./saleApiAction";
import { setSavingButton } from "./saveButtonAction";

export const fetchStockExchanges =
    (filter = {}, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        const admin = true;
        let url = apiBaseURL.STOCK_EXCHANGES;
        
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
                    type: stockExchangeActionType.FETCH_STOCK_EXCHANGES,
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
                dispatch(callSaleApi(false));
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

export const fetchStockExchange =
    (stockExchangeId, singleStockExchange, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        await apiConfig
            .get(
                apiBaseURL.STOCK_EXCHANGES + "/" + stockExchangeId + "/edit",
                singleStockExchange
            )
            .then((response) => {
                dispatch({
                    type: stockExchangeActionType.FETCH_STOCK_EXCHANGE,
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

export const addStockExchange = (stockExchange, navigate) => async (dispatch) => {
    dispatch(setSavingButton(true));
    await apiConfig
        .post(apiBaseURL.STOCK_EXCHANGES, stockExchange)
        .then((response) => {
            dispatch({
                type: stockExchangeActionType.ADD_STOCK_EXCHANGE,
                payload: response.data.data,
            });
            dispatch(
                addToast({
                    text: getFormattedMessage(
                        "stock-exchange.success.create.message"
                    ),
                })
            );
            dispatch(addInToTotalRecord(1));
            navigate("/app/stock-exchanges");
            dispatch(setSavingButton(false));
        })
        .catch(({ response }) => {
            dispatch(setSavingButton(false));
            dispatch(
                addToast({ text: response.data.message, type: toastType.ERROR })
            );
        });
};

export const editStockExchange =
    (stockExchangeId, stockExchange, navigate) => async (dispatch) => {
        dispatch(setSavingButton(true));
        await apiConfig
            .patch(apiBaseURL.STOCK_EXCHANGES + "/" + stockExchangeId, stockExchange)
            .then((response) => {
                dispatch(
                    addToast({
                        text: getFormattedMessage(
                            "stock-exchange.success.edit.message"
                        ),
                    })
                );
                navigate("/app/stock-exchanges");
                dispatch({
                    type: stockExchangeActionType.EDIT_STOCK_EXCHANGE,
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

export const deleteStockExchange = (userId) => async (dispatch) => {
    await apiConfig
        .delete(apiBaseURL.STOCK_EXCHANGES + "/" + userId)
        .then(() => {
            dispatch(removeFromTotalRecord(1));
            dispatch({
                type: stockExchangeActionType.DELETE_STOCK_EXCHANGE,
                payload: userId,
            });
            dispatch(
                addToast({
                    text: getFormattedMessage(
                        "stock-exchange.success.delete.message"
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
