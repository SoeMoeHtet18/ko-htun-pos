import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { connect, useDispatch } from 'react-redux';
import { fetchProductsByWarehouse } from '../../store/action/productAction';
import ProductSearch from '../../shared/components/product-cart/search/ProductSearch';
import { placeholderText, getFormattedMessage } from '../../shared/sharedMethod';
import ReactDatePicker from '../../shared/datepicker/ReactDatePicker';
import { prepareSaleProductArray } from '../../shared/prepareArray/prepareSaleArray';
import ModelFooter from '../../shared/components/modelFooter';
import { addToast } from '../../store/action/toastAction';
import { toastType } from '../../constants';
import { fetchFrontSetting } from '../../store/action/frontSettingAction';
import ReactSelect from '../../shared/select/reactSelect';
import ConversionRowTable from '../../shared/components/conversions/ConversionRowTable';
import { editConversion } from '../../store/action/conversionAction';

const ConversionForm = ( props ) => {
    const {
        addConversionData,
        editConversion,
        id,
        warehouses,
        singleConversion,
        customProducts,
        products,
        fetchProductsByWarehouse,
        fetchFrontSetting,
        frontSetting,
    } = props;

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [ updateStockInProducts, setUpdateStockInProducts ] = useState( [] );
    const [ updateStockOutProducts, setUpdateStockOutProducts ] = useState( [] );
    const [ quantity, setQuantity ] = useState( 0 );
    const [ conversionValue, setConversionValue ] = useState( {
        date: new Date(),
        warehouse_id: '',
        notes: singleConversion ? singleConversion.notes : '',
    } );
    const [ errors, setErrors ] = useState( {
        date: '',
        warehouse_id: '',
    } );

    useEffect( () => {
        setUpdateStockInProducts( updateStockInProducts )
    }, [ updateStockInProducts, quantity ] );

    useEffect( () => {
        setUpdateStockOutProducts( updateStockOutProducts )
    }, [ updateStockOutProducts, quantity ] );

    // useEffect( () => {
    //     updateStockInProducts.length >= 1 ? dispatch( { type: 'DISABLE_OPTION', payload: true } ) : dispatch( { type: 'DISABLE_OPTION', payload: false } )
    //     console.log('stocked in');
    // }, [ updateStockInProducts ] )

    // useEffect( () => {
    //     updateStockOutProducts.length >= 1 ? dispatch( { type: 'DISABLE_OPTION', payload: true } ) : dispatch( { type: 'DISABLE_OPTION', payload: false } )
    //         console.log('stocked out');
    // }, [ updateStockOutProducts ] )

    useEffect( () => {
        fetchFrontSetting();
    }, [] )

    useEffect( () => {
        conversionValue.warehouse_id.value && fetchProductsByWarehouse( conversionValue?.warehouse_id?.value )
    }, [ conversionValue.warehouse_id.value ] )

    useEffect( () => {
        if ( singleConversion ) {
            setConversionValue( {
                date: singleConversion ? moment( singleConversion.date ).toDate() : '',
                warehouse_id: singleConversion ? singleConversion.warehouse_id : '',
            } )
        }
    }, [ singleConversion ] );

    useEffect( () => {
        if ( singleConversion ) {
            setUpdateStockInProducts( singleConversion.stock_in_items );
            setUpdateStockOutProducts( singleConversion.stock_out_items );
        }
    }, [] );

    const handleValidation = () => {
        let error = {};
        let isValid = false;
        const stockInQtyCart = updateStockInProducts.filter( ( product ) => product.quantity === 0 );
        const stockOutQtyCart = updateStockOutProducts.filter( ( product ) => product.quantity === 0 );
        if ( !conversionValue.date ) {
            error[ 'date' ] = getFormattedMessage( 'globally.date.validate.label' );
        } else if ( !conversionValue.warehouse_id ) {
            error[ 'warehouse_id' ] = getFormattedMessage( 'product.input.warehouse.validate.label' );
        } else if ( stockInQtyCart.length > 0 || stockOutQtyCart.length > 0) {
            dispatch( addToast( { text: getFormattedMessage( 'globally.product-quantity.validate.message' ), type: toastType.ERROR } ) )
        } else if ( updateStockInProducts.length < 1 || updateStockOutProducts.length < 1) {
            dispatch( addToast( { text: getFormattedMessage( 'purchase.product-list.validate.message' ), type: toastType.ERROR } ) )
        } else {
            isValid = true;
        }
        setErrors( error );
        return isValid;
    };

    const onWarehouseChange = ( obj ) => {
        setConversionValue( inputs => ( { ...inputs, warehouse_id: obj } ) );
        setErrors( '' );
    };

    const updatedQty = ( qty ) => {
        setQuantity( qty );
    };

    const handleCallback = ( date ) => {
        setConversionValue( previousState => {
            return { ...previousState, date: date }
        } );
        setErrors( '' );
    };

    const prepareFormData = ( prepareData ) => {
        const formValue = {
            date: moment( prepareData.date ).toDate(),
            warehouse_id: prepareData.warehouse_id.value ? prepareData.warehouse_id.value : prepareData.warehouse_id,
            note: prepareData.notes,
            stock_in_items: updateStockInProducts.map( ( item ) => {
                return {
                    product_id: item.product_id,
                    quantity: item.quantity,
                    conversion_item_id: item.conversion_item_id
                }
            } ),
            stock_out_items: updateStockOutProducts.map( ( item ) => {
                return {
                    product_id: item.product_id,
                    quantity: item.quantity,
                    conversion_item_id: item.conversion_item_id
                }
            } ),
        }
        return formValue
    };

    const onSubmit = ( event ) => {
        event.preventDefault();
        const valid = handleValidation();
        if ( valid ) {
            if ( singleConversion ) {
                editConversion( id, prepareFormData( conversionValue ), navigate );
            } else {
                addConversionData( prepareFormData( conversionValue ) );
                setConversionValue( conversionValue );
            }
        }
    };

    return (
        <div className='card'>
            <div className='card-body'>
                {/*<Form>*/}
                <div className='row'>
                    <div className='col-md-4'>
                        <ReactSelect name='warehouse_id' data={warehouses} onChange={onWarehouseChange}
                            title={getFormattedMessage( 'warehouse.title' )} errors={errors[ 'warehouse_id' ]}
                            defaultValue={conversionValue.warehouse_id} value={conversionValue.warehouse_id} addSearchItems={singleConversion}
                            isWarehouseDisable={true}
                            placeholder={placeholderText( 'purchase.select.warehouse.placeholder.label' )} />
                    </div>
                    <div className='col-md-4'>
                        <label className='form-label fs-6 text-gray-700 mb-3'>
                            {getFormattedMessage( 'react-data-table.date.column.label' )}:
                        </label>
                        <span className='required' />
                        <div className='position-relative'>
                            <ReactDatePicker onChangeDate={handleCallback} newStartDate={conversionValue.date} />
                        </div>
                        <span className='text-danger d-block fw-400 fs-small mt-2'>{errors[ 'date' ] ? errors[ 'date' ] : null}</span>
                    </div>
                    <div className='mb-10'>
                        <label className='form-label'>
                            {getFormattedMessage( 'product.title' )}:
                        </label>
                        <ProductSearch values={conversionValue} products={products} handleValidation={handleValidation}
                            updateProducts={updateStockInProducts} isAllProducts={true}
                            setUpdateProducts={setUpdateStockInProducts} customProducts={customProducts} />
                    </div>
                    <div className="custom-responsive">
                        <label className='form-label'>
                            {getFormattedMessage( 'conversions.stock-in-item.table.label' )}:
                        </label>
                        <span className='required' />
                        <ConversionRowTable updateProducts={updateStockInProducts} setUpdateProducts={setUpdateStockInProducts}
                            updatedQty={updatedQty} frontSetting={frontSetting} warehouse={conversionValue.warehouse_id}
                        />
                    </div>
                    <div className='mb-10'>
                        <label className='form-label'>
                            {getFormattedMessage( 'product.title' )}:
                        </label>
                        <ProductSearch values={conversionValue} products={products} handleValidation={handleValidation}
                            updateProducts={updateStockOutProducts} isAllProducts={true}
                            setUpdateProducts={setUpdateStockOutProducts} customProducts={customProducts} />
                    </div>
                     <div className="custom-responsive">
                        <label className='form-label'>
                            {getFormattedMessage( 'conversions.stock-out-item.table.label' )}:
                        </label>
                        <span className='required' />
                        <ConversionRowTable updateProducts={updateStockOutProducts} setUpdateProducts={setUpdateStockOutProducts}
                            updatedQty={updatedQty} frontSetting={frontSetting} warehouse={conversionValue.warehouse_id}
                        />
                    </div>
                    <ModelFooter onEditRecord={singleConversion} onSubmit={onSubmit} link='/app/conversions' />
                </div>
                {/*</Form>*/}
            </div>
        </div>
    )
}

const mapStateToProps = ( state ) => {
    const { purchaseProducts, products, frontSetting } = state;
    return { customProducts: prepareSaleProductArray( products ), purchaseProducts, products, frontSetting }
}

export default connect( mapStateToProps, { editConversion, fetchProductsByWarehouse, fetchFrontSetting } )( ConversionForm )

