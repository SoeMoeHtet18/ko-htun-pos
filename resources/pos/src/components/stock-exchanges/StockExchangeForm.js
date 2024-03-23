import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { connect, useDispatch } from 'react-redux';
import { fetchProductsByWarehouse , fetchProductsBySale} from '../../store/action/productAction';
import ProductSearch from '../../shared/components/product-cart/search/ProductSearch';
import { placeholderText, getFormattedMessage, getFormattedOptions, onFocusInput, decimalValidate } from '../../shared/sharedMethod';
import ReactDatePicker from '../../shared/datepicker/ReactDatePicker';
import { prepareSaleProductArray } from '../../shared/prepareArray/prepareSaleArray';
import ModelFooter from '../../shared/components/modelFooter';
import { addToast } from '../../store/action/toastAction';
import { toastType, paymentMethodOptions, salePaymentStatusOptions } from '../../constants';
import { fetchFrontSetting } from '../../store/action/frontSettingAction';
import ReactSelect from '../../shared/select/reactSelect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowDown
} from "@fortawesome/free-solid-svg-icons";
import { fetchSalesByWarehouse } from '../../store/action/salesAction';
import StockExchangeRowTable from '../../shared/components/stockExchanges/StockExchangeRowTable';
import ProductMainCalculation from './ProductMainCalculation';
import { Form, InputGroup } from 'react-bootstrap-v5';
import { calculateCartTotalAmount, calculateCartTotalTaxAmount } from '../../shared/calculation/calculation';
import { editStockExchange } from '../../store/action/stockExchangeAction';

const StockExchangeForm = ( props ) => {
    const {
        addStockExchangeData,
        editStockExchange,
        id,
        warehouses,
        singleStockExchange,
        customProducts,
        customSalesProducts,
        products,
        fetchProductsByWarehouse,
        fetchProductsBySale,
        fetchSalesByWarehouse,
        fetchFrontSetting,
        frontSetting,
        saleProducts,
        sales,
        allConfigData
    } = props;

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [ updateReturnInProducts, setUpdateReturnInProducts ] = useState( [] );
    const [ updateReturnOutProducts, setUpdateReturnOutProducts ] = useState( [] );
    const [ quantity, setQuantity ] = useState( 0 );
    const [ isPaymentType, setIsPaymentType ] = useState( false )
    const [ stockExchangeValue, setStockExchangeValue ] = useState( {
        date: new Date(),
        warehouse_id: '',
        sales_id: '',
        tax_rate: "0.00",
        tax_amount: 0.00,
        discount: "0.00",
        shipping: "0.00",
        grand_total: 0.00,
        status_id: { label: getFormattedMessage( "status.filter.received.label" ), value: 1 },
        payment_status: { label: getFormattedMessage( "payment-status.filter.unpaid.label" ), value: 2 },
        payment_type: { label: getFormattedMessage( "payment-type.filter.cash.label" ), value: 1 },
        notes: singleStockExchange ? singleStockExchange.notes : '',
    } );
    const [customSales, setCustomSales] = useState([]);
    const [ errors, setErrors ] = useState( {
        date: '',
        warehouse_id: '',
        sales_id: ''
    } );

    useEffect( () => {
        setUpdateReturnInProducts( updateReturnInProducts )
    }, [ updateReturnInProducts, quantity ] );

    useEffect( () => {
        setUpdateReturnOutProducts( updateReturnOutProducts );
    }, [ updateReturnOutProducts, quantity ] );

    useEffect( () => {
        fetchFrontSetting();
    }, [] )

    useEffect( () => {
        stockExchangeValue.warehouse_id.value && fetchProductsByWarehouse( stockExchangeValue?.warehouse_id?.value )
    }, [ stockExchangeValue.warehouse_id.value ] )

    useEffect(() => {
        stockExchangeValue.sales_id.value && fetchProductsBySale(stockExchangeValue?.sales_id?.value);
    },[stockExchangeValue.sales_id.value])

    useEffect( () => {
        if ( singleStockExchange ) {
            setStockExchangeValue( {
                date: singleStockExchange ? moment( singleStockExchange.date ).toDate() : '',
                warehouse_id: singleStockExchange ? singleStockExchange.warehouse_id : '',
                sales_id: singleStockExchange? singleStockExchange.sales_id : '',
                tax_rate: singleStockExchange ? singleStockExchange.tax_rate.toFixed( 2 ) : '0.00',
                tax_amount: singleStockExchange ? singleStockExchange.tax_amount.toFixed( 2 ) : '0.00',
                discount: singleStockExchange ? singleStockExchange.discount.toFixed( 2 ) : '0.00',
                shipping: singleStockExchange ? singleStockExchange.shipping.toFixed( 2 ) : '0.00',
                grand_total: singleStockExchange ? singleStockExchange.grand_total : '0.00',
                payment_status: singleStockExchange ? singleStockExchange.payment_status : '',
                payment_type: singleStockExchange ? singleStockExchange.payment_type : ''
            } )
        }
    }, [ singleStockExchange ] );
    
    useEffect( () => {
        if ( singleStockExchange ) {
            setUpdateReturnInProducts( singleStockExchange.return_in_items );
            setUpdateReturnOutProducts( singleStockExchange.return_out_items );
        }
    }, [] );

    useEffect(()=> {
        sales.length > 0 && setCustomSales(sales.map((sale) => {
            return {
                value: sale.id,
                label: sale.attributes.reference_code
            }
        }));
    }, [ sales ]);

    const paymentStatusFilterOptions = getFormattedOptions( salePaymentStatusOptions )
    const paymentStatusDefaultValue = paymentStatusFilterOptions.map( ( option ) => {
        return {
            value: option.id,
            label: option.name
        }
    } )

    const paymentMethodOption = getFormattedOptions( paymentMethodOptions )
    const paymentTypeDefaultValue = paymentMethodOption.map( ( option ) => {
        return {
            value: option.id,
            label: option.name
        }
    } )

    const handleValidation = () => {
        let error = {};
        let isValid = false;
        const stockInQtyCart = updateReturnInProducts.filter( ( product ) => product.quantity === 0 );
        const stockOutQtyCart = updateReturnOutProducts.filter( ( product ) => product.quantity === 0 );

        if ( !stockExchangeValue.date ) {
            error[ 'date' ] = getFormattedMessage( 'globally.date.validate.label' );
        } else if ( !stockExchangeValue.warehouse_id ) {
            error[ 'warehouse_id' ] = getFormattedMessage( 'product.input.warehouse.validate.label' );
        } else if ( !stockExchangeValue.sales_id ) {
            error[ 'sales_id' ] = getFormattedMessage( 'stock-exchange.input.sales.validate.label' );
        } else if ( stockInQtyCart.length > 0 || stockOutQtyCart.length > 0) {
            dispatch( addToast( { text: getFormattedMessage( 'globally.product-quantity.validate.message' ), type: toastType.ERROR } ) )
        } else if ( updateReturnInProducts.length < 1 || updateReturnOutProducts.length < 1) {
            dispatch( addToast( { text: getFormattedMessage( 'purchase.product-list.validate.message' ), type: toastType.ERROR } ) )
        } else {
            isValid = true;
        }
        setErrors( error );
        return isValid;
    };

    const onBlurInput = ( el ) => {
        if ( el.target.value === '' ) {
            if ( el.target.name === "shipping" ) {
                setStockExchangeValue( { ...stockExchangeValue, shipping: "0.00" } );
            }
            if ( el.target.name === "discount" ) {
                setStockExchangeValue( { ...stockExchangeValue, discount: "0.00" } );
            }
            if ( el.target.name === "tax_rate" ) {
                setStockExchangeValue( { ...stockExchangeValue, tax_rate: "0.00" } );
            }
        }
    }

    const onChangeInput = ( e ) => {
        e.preventDefault();
        const { value } = e.target;
        // check if value includes a decimal point
        if ( value.match( /\./g ) ) {
            const [ , decimal ] = value.split( '.' );
            // restrict value to only 2 decimal places
            if ( decimal?.length > 2 ) {
                // do nothing
                return;
            }
        }
        setStockExchangeValue( inputs => ( { ...inputs, [ e.target.name ]: value && value } ) );
    };

    const onWarehouseChange = ( obj ) => {
        setStockExchangeValue( inputs => ( { ...inputs, warehouse_id: obj } ) );
        fetchSalesByWarehouse(obj.value);
        setErrors( '' );
    };

    const onSalesChange = (obj) => {
        setStockExchangeValue(inputs => ({...inputs, sales_id: obj}));
        setErrors('');
    }

    const onPaymentStatusChange = ( obj ) => {
        setStockExchangeValue( inputs => ( { ...inputs, payment_status: obj } ) );
        obj.value !== 2 ? setIsPaymentType( true ) : setIsPaymentType( false )
        setStockExchangeValue( input => ( { ...input, payment_type: { label: getFormattedMessage( "payment-type.filter.cash.label" ), value: 1 } } ) )
    };
    
    const onPaymentTypeChange = ( obj ) => {
        setStockExchangeValue( inputs => ( { ...inputs, payment_type: obj } ) );
    };
    
    const onNotesChangeInput = ( e ) => {
        e.preventDefault();
        setStockExchangeValue( inputs => ( { ...inputs, notes: e.target.value } ) );
    };

    const updatedQty = ( qty ) => {
        setQuantity( qty );
    };

    const handleCallback = ( date ) => {
        setStockExchangeValue(previousState => {
            return { ...previousState, date: date }
        });
        setErrors( '' );
    };

    const prepareFormData = ( prepareData ) => {
        const formValue = {
            date: moment( prepareData.date ).toDate(),
            warehouse_id: prepareData.warehouse_id.value ?? prepareData.warehouse_id,
            note: prepareData.notes,
            sales_id: prepareData.sales_id.value ?? prepareData.sales_id,
            tax_rate: prepareData.tax_rate,
            tax_amount: calculateCartTotalTaxAmount( updateReturnOutProducts, stockExchangeValue ),
            discount: prepareData.discount,
            shipping: prepareData.shipping,
            grand_total: calculateCartTotalAmount( updateReturnOutProducts, stockExchangeValue ) - calculateCartTotalAmount( updateReturnInProducts),
            payment_status: prepareData.payment_status.value ? prepareData.payment_status.value : prepareData.payment_status,
            payment_type: prepareData.payment_status.value === 2 ? 0 : prepareData.payment_type.value ? prepareData.payment_type.value : prepareData.payment_type,
            return_in_items: updateReturnInProducts.map((item) => {
                return {
                    product_id: item.product_id,
                    stock_exchange_item_id: item.stock_exchange_item_id
                }
            }),
            return_out_items: updateReturnOutProducts.map( ( item ) => {
                return {
                    product_id: item.product_id,
                    stock_exchange_item_id: item.stock_exchange_item_id
                }
            } ),
        }
        return formValue;
    };

    const onSubmit = ( event ) => {
        event.preventDefault();
        const valid = handleValidation();
        
        if ( valid ) {
            if ( singleStockExchange ) {
                editStockExchange( id, prepareFormData( stockExchangeValue ), navigate );
            } else {
                addStockExchangeData( prepareFormData( stockExchangeValue ) );
                setStockExchangeValue( stockExchangeValue );
            }
        }
    };
    
    return (
        <div className='card'>
            <div className='card-body'>
                {/*<Form>*/}
                <div className='row'>
                    <div className='col-md-4'>
                        <label className='form-label fs-6 text-gray-700 mb-3'>
                            {getFormattedMessage( 'react-data-table.date.column.label' )}:
                        </label>
                        <span className='required' />
                        <div className='position-relative'>
                            <ReactDatePicker onChangeDate={handleCallback} newStartDate={stockExchangeValue.date} />
                        </div>
                        <span className='text-danger d-block fw-400 fs-small mt-2'>{errors[ 'date' ] ? errors[ 'date' ] : null}</span>
                    </div>
                    <div className='col-md-4'>
                        <ReactSelect name='warehouse_id' data={warehouses} onChange={onWarehouseChange}
                            title={getFormattedMessage( 'warehouse.title' )} errors={errors[ 'warehouse_id' ]}
                            defaultValue={stockExchangeValue.warehouse_id} value={stockExchangeValue.warehouse_id} addSearchItems={singleStockExchange}
                            isWarehouseDisable={true}
                            placeholder={placeholderText( 'purchase.select.warehouse.placeholder.label' )} />
                    </div>
                    <div className='col-md-4'>
                        <ReactSelect name='sales_id' data={customSales} onChange={onSalesChange}
                            title={getFormattedMessage( 'sales.title' )} errors={errors[ 'sales_id' ]}
                            defaultValue={stockExchangeValue.sales_id} value={stockExchangeValue.sales_id} addSearchItems={singleStockExchange}
                            isWarehouseDisable={true}
                            placeholder={placeholderText( 'stock-exchange.select.sale.placeholder.label' )} />
                    </div>
                    <div className='col-md-6'>
                         <div className='mb-10'>
                            <label className='form-label'>
                                {getFormattedMessage( 'stock-exchange.select.return-in.label' )}:
                            </label>
                            <ProductSearch values={stockExchangeValue} products={saleProducts} handleValidation={handleValidation}
                                updateProducts={updateReturnInProducts} isAllProducts={true}
                                setUpdateProducts={setUpdateReturnInProducts} customProducts={customSalesProducts}  validations={['sales_id']}/>
                        </div>
                    </div>
                    <div className="custom-responsive">
                        <label className='form-label'>
                            {getFormattedMessage( 'stock-exchange.table.return-in.label' )}:
                        </label>
                        <span className='required' />
                        <StockExchangeRowTable updateProducts={updateReturnInProducts} setUpdateProducts={setUpdateReturnInProducts}
                            updatedQty={updatedQty} frontSetting={frontSetting} warehouse={stockExchangeValue.warehouse_id} isReturnIn={true}
                        />
                    </div>
                    <div className='d-flex justify-content-center align-items-center my-2'>
                        <FontAwesomeIcon icon={faArrowDown} style={{ fontSize: "32px" }}/>
                    </div>
                    <div className='col-md-6'>
                        <div className='mb-10'>
                            <label className='form-label'>
                                {getFormattedMessage( 'stock-exchange.select.return-out.label' )}:
                            </label>
                            <ProductSearch values={stockExchangeValue} products={products} handleValidation={handleValidation}
                                updateProducts={updateReturnOutProducts} isAllProducts={true}
                                setUpdateProducts={setUpdateReturnOutProducts} customProducts={customProducts} />
                        </div>
                    </div>
                    <div className="custom-responsive">
                        <label className='form-label'>
                            {getFormattedMessage( 'stock-exchange.table.return-out.label' )}:
                        </label>
                        <span className='required' />
                        <StockExchangeRowTable updateProducts={updateReturnOutProducts} setUpdateProducts={setUpdateReturnOutProducts}
                            updatedQty={updatedQty} frontSetting={frontSetting} warehouse={stockExchangeValue.warehouse_id} isReturnIn={false}
                        />
                    </div>
                    <div className='col-12'>
                        <ProductMainCalculation inputValues={stockExchangeValue} allConfigData={allConfigData} updateReturnInProducts={updateReturnInProducts} updateReturnOutProducts={updateReturnOutProducts} frontSetting={frontSetting} />
                    </div>
                    <div className='col-md-4 mb-3'>
                        <label
                            className='form-label'>{getFormattedMessage( 'purchase.input.order-tax.label' )}: </label>
                        <InputGroup>
                            <input aria-label='Dollar amount (with dot and two decimal places)'
                                className='form-control'
                                type='text' name='tax_rate' value={stockExchangeValue.tax_rate}
                                onBlur={( event ) => onBlurInput( event )} onFocus={( event ) => onFocusInput( event )}
                                onKeyPress={( event ) => decimalValidate( event )}
                                onChange={( e ) => {
                                    onChangeInput( e )
                                }} />
                            <InputGroup.Text>%</InputGroup.Text>
                        </InputGroup>
                    </div>
                    <div className='col-md-4 mb-3'>
                        <Form.Label
                            className='form-label'>{getFormattedMessage( 'purchase.order-item.table.discount.column.label' )}: </Form.Label>
                        <InputGroup>
                            <input aria-label='Dollar amount (with dot and two decimal places)'
                                className='form-control'
                                type='text' name='discount' value={stockExchangeValue.discount}
                                onBlur={( event ) => onBlurInput( event )} onFocus={( event ) => onFocusInput( event )}
                                onKeyPress={( event ) => decimalValidate( event )}
                                onChange={( e ) => onChangeInput( e )}
                            />
                            <InputGroup.Text>{frontSetting.value && frontSetting.value.currency_symbol}</InputGroup.Text>
                        </InputGroup>
                    </div>
                    <div className='col-md-4 mb-3'>
                        <label
                            className='form-label'>{getFormattedMessage( 'purchase.input.shipping.label' )}: </label>
                        <InputGroup>
                            <input aria-label='Dollar amount (with dot and two decimal places)' type='text'
                                className='form-control'
                                name='shipping' value={stockExchangeValue.shipping}
                                onBlur={( event ) => onBlurInput( event )} onFocus={( event ) => onFocusInput( event )}
                                onKeyPress={( event ) => decimalValidate( event )}
                                onChange={( e ) => onChangeInput( e )}
                            />
                            <InputGroup.Text>{frontSetting.value && frontSetting.value.currency_symbol}</InputGroup.Text>
                        </InputGroup>
                    </div>
                     {!singleStockExchange && <div className='col-md-4'>
                        <ReactSelect multiLanguageOption={paymentStatusFilterOptions} onChange={onPaymentStatusChange} name='payment_status'
                            title={getFormattedMessage( 'dashboard.recentSales.paymentStatus.label' )}
                            value={stockExchangeValue.payment_status} errors={errors[ 'payment_status' ]}
                            defaultValue={paymentStatusDefaultValue[ 0 ]}
                            placeholder={placeholderText( 'sale.select.payment-status.placeholder' )} />
                    </div>}
                    {!singleStockExchange && stockExchangeValue.payment_status.value !== 2 && <div className='col-md-4'>
                        <ReactSelect title={getFormattedMessage( 'select.payment-type.label' )}
                            name='payment_type'
                            value={stockExchangeValue.payment_type} errors={errors[ 'payment_type' ]}
                            placeholder={placeholderText( 'sale.select.payment-type.placeholder' )}
                            defaultValue={paymentTypeDefaultValue[ 0 ]}
                            multiLanguageOption={paymentMethodOption}
                            onChange={onPaymentTypeChange}
                        />
                    </div>}
                    <div className='my-3'>
                        <label className='form-label'>
                            {getFormattedMessage( 'globally.input.notes.label' )}: </label>
                        <textarea name='notes' className='form-control' value={stockExchangeValue.notes}
                            placeholder={placeholderText( 'globally.input.notes.placeholder.label' )}
                            onChange={( e ) => onNotesChangeInput( e )}
                        />
                    </div>
                    <ModelFooter onEditRecord={singleStockExchange} onSubmit={onSubmit} link='/app/conversions' />
                </div>
                {/*</Form>*/}
            </div>
        </div>
    )
}

const mapStateToProps = ( state ) => {
    const { purchaseProducts, products, frontSetting, saleProducts, sales, allConfigData } = state;
    return { customProducts: prepareSaleProductArray( products ), customSalesProducts: prepareSaleProductArray( saleProducts ), purchaseProducts, products, frontSetting, saleProducts, sales, allConfigData }
}

export default connect( mapStateToProps, { editStockExchange, fetchProductsByWarehouse, fetchFrontSetting, fetchProductsBySale, fetchSalesByWarehouse } )( StockExchangeForm )

