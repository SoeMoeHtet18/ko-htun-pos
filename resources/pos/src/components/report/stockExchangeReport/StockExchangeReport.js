import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import MasterLayout from "../../MasterLayout";
import TabTitle from "../../../shared/tab-title/TabTitle";
import {
    currencySymbolHandling,
    getFormattedMessage,
    placeholderText,
} from "../../../shared/sharedMethod";
import ReactDataTable from "../../../shared/table/ReactDataTable";
import { fetchFrontSetting } from "../../../store/action/frontSettingAction";
import TopProgressBar from "../../../shared/components/loaders/TopProgressBar";
import { fetchStockExchanges } from "../../../store/action/stockExchangeAction";
import ProductDetail from "../ProductDetail";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { totalStockExchangeReportExcelAction } from "../../../store/action/totalStockExchangeReportExcelAction";
import PaymentDetail from "../PaymentDetail";
import { constants } from "../../../constants";

const StockExchangeReport = (props) => {
    const {
        isLoading,
        totalRecord,
        fetchFrontSetting,
        fetchStockExchanges,
        stockExchanges,
        totalStockExchangeReportExcelAction,
        frontSetting,
        dates,
        search,
        allConfigData,
    } = props;
    const [isWarehouseValue, setIsWarehouseValue] = useState(false);
    const [ isDetails, setIsDetails ] = useState( null );
    const [ lgShow, setLgShow ] = useState( false );
    const [ paymentDetailData, setPaymentDetailData] = useState(null);
    const [ paymentDetailShow, setPaymentDetailShow ] = useState(false);
    const [ pageRendered, setPageRendered ] = useState(false);
    const dispatch = useDispatch();

    const currencySymbol =
        frontSetting &&
        frontSetting.value &&
        frontSetting.value.currency_symbol;

    useEffect(() => {
        fetchFrontSetting();
    }, []);

    const itemsValue =
        currencySymbol && stockExchanges &&
        stockExchanges.length >= 0 &&
        stockExchanges.map((stockExchange) => ({
            time: moment(stockExchange.attributes.created_at).format("LT"),
            reference_code: stockExchange.attributes.reference_code,
            customer_name: stockExchange.attributes.customer_name,
            warehouse_name: stockExchange.attributes.warehouse_name,
            sales_reference_code: stockExchange.attributes.sales_reference_code,
            payment_status: stockExchange.attributes.payment_status,
            grand_total: stockExchange.attributes.grand_total,
            return_in_items_name: stockExchange.attributes.return_in_items_name,
            return_out_items_name: stockExchange.attributes.return_out_items_name,
            return_in_items: stockExchange.attributes.return_in_items,
            return_out_items: stockExchange.attributes.return_out_items,
            sub_total: stockExchange.attributes.return_out_items.reduce((accumulator, currentItem) => accumulator + currentItem.product_price, 0) -
                stockExchange.attributes.return_in_items.reduce((accumulator, currentItem) => accumulator + currentItem.product_price, 0),
            tax_amount: stockExchange.attributes.tax_amount,
            tax_rate: stockExchange.attributes.tax_rate,
            discount: stockExchange.attributes.discount,
            shipping: stockExchange.attributes.shipping,
            id: stockExchange.id,
            currency: currencySymbol,
        }));

    useState(() => {
        if(!pageRendered) {
            dispatch({ type: constants.SEARCH_ACTION, payload: ''});
        }
        setPageRendered(true);
    }, []);

    useEffect(() => {
        if (isWarehouseValue === true) {
            totalStockExchangeReportExcelAction(dates, setIsWarehouseValue, {search: search.length > 0 ? search : ''});
        }
    }, [isWarehouseValue]);

    const columns = [
        {
            name: getFormattedMessage("dashboard.recentSales.reference.label"),
            sortField: "reference_code",
            sortable: false,
            cell: (row) => {
                return (
                    <span className="badge bg-light-danger">
                        <span>{row.reference_code}</span>
                    </span>
                );
            },
        },
        {
            name: getFormattedMessage("customer.title"),
            selector: (row) => row.customer_name,
            sortField: "customer_name",
            sortable: false,
        },
        {
            name: getFormattedMessage("warehouse.title"),
            selector: (row) => row.warehouse_name,
            sortField: "warehouse_name",
            sortable: false,
        },
        {
            name: getFormattedMessage("sales.title"),
            selector: (row) => row.sales_reference_code,
            sortField: "sales_reference_code",
            sortable: false,
        },
        {
            name: getFormattedMessage( "stock-exchange.return-in-price.label" ),
            selector: row => row.return_in_items,
            sortField: 'return_in_items',
            sortable: false,
            cell: (row) => {
                return (
                    <span className="d-flex align-items-center">{row.return_in_items.reduce((accumulator, currentItem) => accumulator + currentItem.product_price, 0)}
                        <button title={placeholderText('globally.view.tooltip.label')}
                            className='btn text-success px-1 fs-3 border-0'
                            onClick={(e) => {
                                e.stopPropagation();
                                onClickDetailsModel(row.return_in_items)
                            }}>
                            <FontAwesomeIcon icon={faEye}/>
                        </button>
                    </span>
                )
            }
        },
        {
            name: getFormattedMessage( "stock-exchange.return-out-price.label" ),
            selector: row => row.return_out_items_name,
            sortField: 'return_out_items',
            sortable: false,
            cell: (row) => {
                return (
                    <span className="d-flex align-items-center">{row.return_out_items.reduce((accumulator, currentItem) => accumulator + currentItem.product_price, 0)}
                        <button title={placeholderText('globally.view.tooltip.label')}
                            className='btn text-success px-1 fs-3 border-0'
                            onClick={(e) => {
                                e.stopPropagation();
                                onClickDetailsModel(row.return_out_items)
                            }}>
                            <FontAwesomeIcon icon={faEye}/>
                        </button>
                    </span>
                )
            }
        },
        {
            name: getFormattedMessage( "pos-sub-total.title" ),
            selector: row => row.sub_total,
            sortField: 'sub_total',
            sortable: false,
        },
        {
            name: getFormattedMessage("purchase.grant-total.label"),
            selector: (row) =>
                currencySymbolHandling(
                    allConfigData,
                    row.currency,
                    row.grand_total
                ),
            sortField: "grand_total",
            sortable: true,
            cell: (row) => {
                return (
                    <span  className="d-flex align-items-center">
                        {row.grand_total}
                        <button title={placeholderText('globally.view.tooltip.label')}
                            className='btn text-success px-1 fs-3 border-0'
                            onClick={(e) => {
                                e.stopPropagation();
                                onClickPaymentModel(row);
                            }}>
                            <FontAwesomeIcon icon={faEye}/>
                        </button>    
                    </span>
                )
            }
        },
        {
            name: getFormattedMessage(
                "dashboard.recentSales.paymentStatus.label"
            ),
            sortField: "payment_status",
            sortable: false,
            cell: (row) => {
                return (
                    (row.payment_status === 1 && (
                        <span className="badge bg-light-success">
                            <span>
                                {getFormattedMessage(
                                    "payment-status.filter.paid.label"
                                )}
                            </span>
                        </span>
                    )) ||
                    (row.payment_status === 2 && (
                        <span className="badge bg-light-danger">
                            <span>
                                {getFormattedMessage(
                                    "payment-status.filter.unpaid.label"
                                )}
                            </span>
                        </span>
                    )) ||
                    (row.payment_status === 3 && (
                        <span className="badge bg-light-warning">
                            <span>
                                {getFormattedMessage(
                                    "payment-status.filter.partial.label"
                                )}
                            </span>
                        </span>
                    ))
                );
            },
        },
    ];

    const onChange = (filter) => {
        fetchStockExchanges(filter, true);
    };

    const onExcelClick = () => {
        setIsWarehouseValue(true);
    };

    const onClickDetailsModel = ( isDetails = null ) => {
        setLgShow( true );
        setIsDetails( isDetails );
    };

    const onClickPaymentModel = (stockExchangeData = null) => {
        let paymentDetail = {
            sub_total: stockExchangeData.sub_total,
            tax_amount: stockExchangeData.tax_amount,
            tax_rate: stockExchangeData.tax_rate,
            discount: stockExchangeData.discount,
            shipping: stockExchangeData.shipping,
            grand_total: stockExchangeData.grand_total
        };
        setPaymentDetailShow(true);
        setPaymentDetailData(paymentDetail);
    }

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText("stock-exchange.reports.title")} />
            <ReactDataTable
                columns={columns}
                items={itemsValue}
                onChange={onChange}
                isLoading={isLoading}
                totalRows={totalRecord}
                isShowDateRangeField
                isEXCEL
                isShowFilterField
                isPaymentStatus
                onExcelClick={onExcelClick}
            />
            <ProductDetail onDetails={isDetails} setLgShow={setLgShow} lgShow={lgShow} />
             <PaymentDetail paymentData={paymentDetailData} lgShow={paymentDetailShow} setLgShow={setPaymentDetailShow}
                allConfigData={allConfigData} frontSetting={frontSetting} />
        </MasterLayout>
    );
};

const mapStateToProps = (state) => {
    const {
        stockExchanges,
        frontSetting,
        isLoading,
        totalRecord,
        dates,
        search,
        allConfigData,
    } = state;
    return {
        stockExchanges,
        frontSetting,
        isLoading,
        totalRecord,
        dates,
        search,
        allConfigData,
    };
};

export default connect(mapStateToProps, {
    fetchFrontSetting,
    fetchStockExchanges,
    totalStockExchangeReportExcelAction,
})(StockExchangeReport);
