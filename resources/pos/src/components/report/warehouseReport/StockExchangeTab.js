import React, { useEffect, useState } from "react";
import moment from "moment";
import { connect } from "react-redux";
import ReactDataTable from "../../../shared/table/ReactDataTable";
import {
    currencySymbolHandling,
    getFormattedMessage,
    placeholderText,
} from "../../../shared/sharedMethod";
import { fetchStockExchanges } from "../../../store/action/stockExchangeAction";
import { fetchFrontSetting } from "../../../store/action/frontSettingAction";
import { stockExchangeExcelAction } from "../../../store/action/stockExchangeExcelAction";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProductDetail from "./ProductDetail";

const StockExchangeTab = (props) => {
    const {
        isLoading,
        totalRecord,
        fetchStockExchanges,
        stockExchanges,
        frontSetting,
        fetchFrontSetting,
        warehouseValue,
        stockExchangeExcelAction,
        allConfigData,
    } = props;
    const currencySymbol =
        frontSetting &&
        frontSetting.value &&
        frontSetting.value.currency_symbol;
    const [isWarehouseValue, setIsWarehouseValue] = useState(false);
    const [ isDetails, setIsDetails ] = useState( null );
    const [ lgShow, setLgShow ] = useState( false );

    useEffect(() => {
        fetchFrontSetting();
    }, [warehouseValue]);

    const itemsValue =
        currencySymbol &&
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
            id: stockExchange.id,
            currency: currencySymbol,
        }));

    useEffect(() => {
        if (isWarehouseValue === true) {
            stockExchangeExcelAction(warehouseValue.value, setIsWarehouseValue);
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
            name: getFormattedMessage( 'stock-exchange.table.return-in.label' ),
            selector: row => row.return_in_items_name,
            sortField: 'return_in_items',
            sortable: false,
            cell: (row) => {
                return (
                    <span className="d-flex align-items-center">{row.return_in_items_name}
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
            name: getFormattedMessage( 'stock-exchange.table.return-out.label' ),
            selector: row => row.return_out_items_name,
            sortField: 'return_out_items',
            sortable: false,
            cell: (row) => {
                return (
                    <span className="d-flex align-items-center">{row.return_out_items_name}
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
            name: getFormattedMessage("purchase.grant-total.label"),
            selector: (row) =>
                currencySymbolHandling(
                    allConfigData,
                    row.currency,
                    row.grand_total
                ),
            sortField: "grand_total",
            sortable: true,
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

    return (
        <div className="warehouse_stock_exchange_report_table">
            <ReactDataTable
                columns={columns}
                items={itemsValue}
                onChange={onChange}
                warehouseValue={warehouseValue}
                isLoading={isLoading}
                totalRows={totalRecord}
                isEXCEL
                onExcelClick={onExcelClick}
                isPaymentStatus
                isShowFilterField
            />
             <ProductDetail onDetails={isDetails} setLgShow={setLgShow} lgShow={lgShow} />
        </div>
    );
};

const mapStateToProps = (state) => {
    const { isLoading, totalRecord, stockExchanges, frontSetting } = state;
    return { isLoading, totalRecord, stockExchanges, frontSetting };
};

export default connect(mapStateToProps, {
    fetchFrontSetting,
    fetchStockExchanges,
    stockExchangeExcelAction,
})(StockExchangeTab);
