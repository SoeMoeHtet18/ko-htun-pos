import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import MasterLayout from '../MasterLayout';
import TabTitle from '../../shared/tab-title/TabTitle';
import ReactDataTable from '../../shared/table/ReactDataTable';
import { getFormattedDate, getFormattedMessage, placeholderText } from '../../shared/sharedMethod';
import { fetchFrontSetting } from '../../store/action/frontSettingAction';
import { fetchConversions } from '../../store/action/conversionAction';
import ActionButton from '../../shared/action-buttons/ActionButton';
import { fetchAllWarehouses } from '../../store/action/warehouseAction';
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import ConversionDetail from './ConversionDetail';
import DeleteConversion from './DeleteConversion';

const Conversions = ( props ) => {
    const { conversions, fetchConversions, totalRecord, isLoading, fetchFrontSetting, frontSetting, warehouses, fetchAllWarehouses, allConfigData } = props;
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
        fetchConversions( filter, true );
    };

    //conversions edit function
    const goToEdit = ( item ) => {
        const id = item.id;
        window.location.href = '#/app/conversions/' + id;
    };

    // delete conversions function
    const onClickDeleteModel = ( isDelete = null ) => {
        setDeleteModel( !deleteModel );
        setIsDelete( isDelete );
    };

    //conversions details function
    const onClickDetailsModel = ( isDetails = null ) => {
        setLgShow( true )
        setIsDetails( isDetails )
    };

    const itemsValue = currencySymbol && conversions.length >= 0 && conversions.map( item => ( {
        reference_code: item.attributes.reference_code,
        total_stock_in_products: item.attributes.total_stock_in_products,
        total_stock_out_products: item.attributes.total_stock_out_products,
        date: getFormattedDate( item.attributes.created_at, allConfigData && allConfigData ),
        time: moment( item.attributes.created_at ).format( 'LT' ),
        warehouse_name: item.attributes.warehouse_name,
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
            name: getFormattedMessage( 'conversions.table.stock-in-item.label' ),
            sortField: 'total_stock_in_products',
            sortable: false,
            cell: row => {
                return <span className='badge bg-light-danger'>
                    <span>{row.total_stock_in_products}</span>
                </span>
            }
        },
         {
            name: getFormattedMessage( 'conversions.table.stock-out-item.label' ),
            sortField: 'total_stock_out_products',
            sortable: false,
            cell: row => {
                return <span className='badge bg-light-danger'>
                    <span>{row.total_stock_out_products}</span>
                </span>
            }
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
            <TabTitle title={placeholderText( 'conversions.title' )} />
            {newArray.length > 1 &&
                <ReactDataTable columns={columns} items={itemsValue} to='#/app/conversions/create'
                    ButtonValue={getFormattedMessage( 'conversions.create.title' )}
                    onChange={onChange} totalRows={totalRecord} goToEdit={goToEdit} isShowFilterField
                    isLoading={isLoading} isWarehouseType={true} warehouseOptions={newArray} warehouses={warehouses} />}
            <DeleteConversion onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel} onDelete={isDelete} />
            <ConversionDetail onClickDetailsModel={onClickDetailsModel} detailsModel={detailsModel} onDetails={isDetails} setLgShow={setLgShow} lgShow={lgShow} />
        </MasterLayout>
    )
};


const mapStateToProps = ( state ) => {
    const { conversions, totalRecord, isLoading, frontSetting, warehouses, allConfigData } = state;
    return { conversions, totalRecord, isLoading, frontSetting, warehouses, allConfigData };
};

export default connect( mapStateToProps, { fetchConversions, fetchAllWarehouses, fetchFrontSetting } )( Conversions );
