import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import MasterLayout from '../MasterLayout';
import TabTitle from '../../shared/tab-title/TabTitle';
import ReactDataTable from '../../shared/table/ReactDataTable';
import { getFormattedDate, getFormattedMessage, placeholderText } from '../../shared/sharedMethod';
import { fetchFrontSetting } from '../../store/action/frontSettingAction';
import { fetchStockExchanges } from '../../store/action/stockExchangeAction';
import ActionButton from '../../shared/action-buttons/ActionButton';
import { fetchAllWarehouses } from '../../store/action/warehouseAction';
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import DeleteStockExchange from './DeleteStockExchange';
import StockExchangeDetail from './StockExchangeDetail';

const StockExchange = ( props ) => {
    const { stockExchanges, fetchStockExchanges, totalRecord, isLoading, fetchFrontSetting, frontSetting, warehouses, fetchAllWarehouses, allConfigData } = props;
    const [ deleteModel, setDeleteModel ] = useState( false );
    const [ detailsModel, setDetailsModel ] = useState( false );
    const [ isDelete, setIsDelete ] = useState( null );
    const [ isDetails, setIsDetails ] = useState( null );
    const [ lgShow, setLgShow ] = useState( false );

    useEffect( () => {
        fetchFrontSetting();
        fetchAllWarehouses();
    }, [] );

    const currencySymbol = frontSetting && frontSetting.value && frontSetting.value.currency_symbol

    const onChange = ( filter ) => {
        fetchStockExchanges( filter, true );
    };

    //stockExchanges edit function
    const goToEdit = ( item ) => {
        const id = item.id;
        window.location.href = '#/app/stock-exchanges/edit/' + id;
    };

    // delete stockExchanges function
    const onClickDeleteModel = ( isDelete = null ) => {
        setDeleteModel( !deleteModel );
        setIsDelete( isDelete );
    };

    //stockExchanges details function
    const onClickDetailsModel = ( isDetails = null ) => {
        setLgShow( true )
        setIsDetails( isDetails )
    };

    const itemsValue = currencySymbol && stockExchanges.length >= 0 && stockExchanges.map( item => ( {
        reference_code: item.attributes.reference_code,
        date: getFormattedDate( item.attributes.created_at, allConfigData && allConfigData ),
        time: moment( item.attributes.created_at ).format( 'LT' ),
        warehouse_name: item.attributes.warehouse_name,
        sales_reference_code: item.attributes.sales_reference_code,
        return_in_items: item.attributes.return_in_items_name,
        return_out_items: item.attributes.return_out_items_name,
        id: item.id,
        currency: currencySymbol
    } ) );

    const columns = [
        {
            name: getFormattedMessage( 'dashboard.recentSales.reference.label' ),
            sortField: 'reference_code',
            sortable: false,
            cell: row => {
                return <span className='badge bg-light-danger'>
                    <span>{row.reference_code}</span>
                </span>
            }
        },
        {
            name: getFormattedMessage( 'warehouse.title' ),
            selector: row => row.warehouse_name,
            sortField: 'warehouse_name',
            sortable: false,
        },
        {
            name: getFormattedMessage( 'sales.title' ),
            selector: row => row.sales_reference_code,
            sortField: 'sales',
            sortable: false,
        },
        {
            name: getFormattedMessage( 'stock-exchange.table.return-in.label' ),
            selector: row => row.return_in_items,
            sortField: 'return_in_items',
            sortable: false,
        },
        {
            name: getFormattedMessage( 'stock-exchange.table.return-out.label' ),
            selector: row => row.return_out_items,
            sortField: 'return_out_items',
            sortable: false,
        },
        {
            name: getFormattedMessage( 'globally.react-table.column.created-date.label' ),
            selector: row => row.date,
            sortField: 'date',
            sortable: true,
            cell: row => {
                return (
                    <span className='badge bg-light-info'>
                        <div className='mb-1'>{row.time}</div>
                        <div>{row.date}</div>
                    </span>
                )
            }
        },
        {
            name: getFormattedMessage( 'react-data-table.action.column.label' ),
            right: true,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            cell: row => <ActionButton isViewIcon={true} goToDetailScreen={onClickDetailsModel} item={row}
                goToEditProduct={goToEdit} isEditMode={true}
                onClickDeleteModel={onClickDeleteModel} />
        }
    ];

    const array = warehouses
    const newFirstElement = { attributes: { name: getFormattedMessage( 'unit.filter.all.label' ) }, id: "0" }
    const newArray = [ newFirstElement ].concat( array )

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText( 'stock-exchange.title' )} />
            {newArray.length > 1 &&
                <ReactDataTable columns={columns} items={itemsValue} to='#/app/stock-exchanges/create'
                    ButtonValue={getFormattedMessage( 'stock-exchange.create.title' )}
                    onChange={onChange} totalRows={totalRecord} goToEdit={goToEdit} isShowFilterField
                    isLoading={isLoading} isWarehouseType={true} warehouseOptions={newArray} warehouses={warehouses} />}
            <DeleteStockExchange onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel} onDelete={isDelete} />
            <StockExchangeDetail onClickDetailsModel={onClickDetailsModel} detailsModel={detailsModel} onDetails={isDetails} setLgShow={setLgShow} lgShow={lgShow} />
        </MasterLayout>
    )
};


const mapStateToProps = ( state ) => {
    const { stockExchanges, totalRecord, isLoading, frontSetting, warehouses, allConfigData } = state;
    return { stockExchanges, totalRecord, isLoading, frontSetting, warehouses, allConfigData };
};

export default connect( mapStateToProps, { fetchStockExchanges, fetchAllWarehouses, fetchFrontSetting } )( StockExchange );
