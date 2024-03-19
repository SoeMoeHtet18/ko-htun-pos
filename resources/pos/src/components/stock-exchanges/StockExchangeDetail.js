import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import { fetchFrontSetting } from '../../store/action/frontSettingAction';
import { getStockExchangeDetail } from '../../store/action/stockExchangeDetailAction';
import Table from 'react-bootstrap/Table';
import moment from 'moment';
import { 
    currencySymbolHandling, getFormattedMessage } from '../../shared/sharedMethod';
import { paymentMethodOptions } from '../../constants';

const StockExchangeDetail = ( props ) => {
    const { onDetails, lgShow, setLgShow, fetchFrontSetting, stockExchangeDetail, getStockExchangeDetail, frontSetting, allConfigData } = props;
    const [ updateReturnInProducts, setUpdateReturnInProducts ] = useState( [] );
    const [ updateReturnOutProducts, setUpdateReturnOutProducts ] = useState( [] );  
    const [ stockExchangeValue, setStockExchangeValue ] = useState( {
        tax_rate: "0.00",
        tax_amount: 0.00,
        discount: "0.00",
        shipping: "0.00",
        grand_total: 0.00,
    } );

    useEffect( () => {
        fetchFrontSetting()
    }, [] )

    useEffect( () => {
        if ( onDetails !== null ) {
            getStockExchangeDetail( onDetails )
        }
    }, [ onDetails ] )

    const onsetLgShow = () => {
        setLgShow( false )
    }

    useEffect( () => {
        console.log(stockExchangeDetail && stockExchangeDetail.attributes);
        if(stockExchangeDetail && stockExchangeDetail.attributes) {
            setUpdateReturnInProducts( stockExchangeDetail.attributes.return_in_items );
            setUpdateReturnOutProducts( stockExchangeDetail.attributes.return_out_items );
            setStockExchangeValue({
                tax_rate: stockExchangeDetail.attributes.tax_rate,
                tax_amount: stockExchangeDetail.attributes.tax_amount,
                discount: stockExchangeDetail.attributes.discount,
                shipping: stockExchangeDetail.attributes.shipping,
                grand_total: stockExchangeDetail.attributes.grand_total
            })
        }
    }, [stockExchangeDetail] );

    return (
        <div>
            <Modal
                size="lg"
                aria-labelledby="example-custom-modal-styling-title"
                show={lgShow}
                onHide={() => onsetLgShow()}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                        {getFormattedMessage( "stock-exchange.detail.title" )}
                    </Modal.Title>
                    {stockExchangeDetail && stockExchangeDetail.attributes && (
                        <span className={stockExchangeDetail.attributes.payment_status === 1 ? 'ms-2 badge bg-light-info' : 'ms-2 badge bg-danger' }>
                            <div className='mb-1'>{stockExchangeDetail.attributes.payment_status === 1 ? 'Paid By' : 'Unpaid'}</div>
                            {stockExchangeDetail.attributes.payment_status === 1 && (
                                <div>
                                    {
                                        getFormattedMessage(paymentMethodOptions
                                            .filter(option => stockExchangeDetail.attributes.payment_type === option.id)
                                            .map(filteredOption => filteredOption.name)[0])
                                    }
                                </div>
                            )}
                        </span>
                    )}
                </Modal.Header>
                <Modal.Body>
                    <div className='mw-100 overflow-auto'>
                        <div className='mx-2'>
                            <Table bordered hover>
                                <thead>
                                    <tr>
                                        <th>{getFormattedMessage( "react-data-table.date.column.label" )}</th>
                                        <th>{getFormattedMessage( "globally.detail.reference" )}</th>
                                        <th>{getFormattedMessage( "globally.detail.warehouse" )}</th>
                                        <th>{getFormattedMessage("sale.select.customer.label")}</th>
                                        <th>{getFormattedMessage("sale-reference.title")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{stockExchangeDetail && stockExchangeDetail.attributes && moment( stockExchangeDetail.attributes.date ).format( 'YYYY-MM-DD' )}</td>
                                        <td>{stockExchangeDetail && stockExchangeDetail.attributes && stockExchangeDetail.attributes.reference_code}</td>
                                        <td>{stockExchangeDetail && stockExchangeDetail.attributes && stockExchangeDetail.attributes.warehouse_name}</td>
                                        <td>{stockExchangeDetail && stockExchangeDetail.attributes && stockExchangeDetail.attributes.customer_name}</td>
                                        <td>{stockExchangeDetail && stockExchangeDetail.attributes && stockExchangeDetail.attributes.sales_reference_code}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                         <div className='mx-2'>
                            <h5>
                                {getFormattedMessage( "stock-exchange.table.return-in.label" )}:
                            </h5>
                            <Table bordered hover>
                                <thead>
                                    <tr>
                                        <th>{getFormattedMessage( "globally.detail.product" )}</th>
                                        <th>{getFormattedMessage( "product.product-details.code-product.label" )}</th>
                                        <th>{getFormattedMessage(  "product.product-details.cost.label" )}</th>
                                        <th>{getFormattedMessage(  "product.table.price.column.label" )}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stockExchangeDetail && stockExchangeDetail.attributes && stockExchangeDetail.attributes.return_in_items.map( ( item, index ) => {
                                        return (
                                            <tr key={index}>
                                                  <td>{item.product.name}</td>
                                                <td>{item.product.code}</td>
                                                <td>{item.product_cost}</td>
                                                <td>{item.product_price}</td>
                                            </tr>
                                        )
                                    } )}
                                </tbody>
                            </Table>
                        </div>
                        <div className='mx-2'>
                            <h5>
                                {getFormattedMessage( "stock-exchange.table.return-out.label" )}:
                            </h5>
                           <Table bordered hover>
                                <thead>
                                    <tr>
                                        <th>{getFormattedMessage( "globally.detail.product" )}</th>
                                        <th>{getFormattedMessage( "product.product-details.code-product.label" )}</th>
                                        <th>{getFormattedMessage(  "product.product-details.cost.label" )}</th>
                                        <th>{getFormattedMessage(  "product.table.price.column.label" )}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stockExchangeDetail && stockExchangeDetail.attributes && stockExchangeDetail.attributes.return_out_items.map( ( item, index ) => {
                                        return (
                                            <tr key={index}>
                                                <td>{item.product.name}</td>
                                                <td>{item.product.code}</td>
                                                <td>{item.product_cost}</td>
                                                <td>{item.product_price}</td>
                                            </tr>
                                        )
                                    } )}
                                </tbody>
                            </Table>
                        </div>
                       <div className='mx-2'>
                            <h5>
                                {getFormattedMessage( "globally.payment.info.label" )}:
                            </h5>
                            <Table bordered hover>
                                <thead>
                                    <tr>
                                        <th>{getFormattedMessage(
                                            "purchase.input.order-tax.label"
                                        )}</th>
                                        <th> {getFormattedMessage(
                                            "purchase.order-item.table.discount.column.label"
                                        )}</th>
                                        <th> {getFormattedMessage(
                                            "purchase.input.shipping.label"
                                        )}</th>
                                        <th>  {getFormattedMessage(
                                            "purchase.grant-total.label"
                                        )}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stockExchangeDetail && stockExchangeDetail.attributes  &&
                                        (
                                            <tr>
                                                <td>
                                                    {currencySymbolHandling(
                                                        allConfigData,
                                                        frontSetting.value && frontSetting.value.currency_symbol,
                                                        `${stockExchangeDetail.attributes.tax_amount} (${stockExchangeDetail.attributes.taxrate}%)`
                                                    )}
                                                </td>
                                                <td>
                                                    {currencySymbolHandling(
                                                        allConfigData,
                                                        frontSetting.value && frontSetting.value.currency_symbol,
                                                        stockExchangeDetail.attributes.discount
                                                    )}
                                                </td>
                                                <td>
                                                    {currencySymbolHandling(
                                                        allConfigData,
                                                        frontSetting.value && frontSetting.value.currency_symbol,
                                                        stockExchangeDetail.attributes.shipping
                                                    )}
                                                </td>
                                                <td> 
                                                    {currencySymbolHandling(
                                                        allConfigData,
                                                        frontSetting.value && frontSetting.value.currency_symbol,
                                                        stockExchangeDetail.attributes.grand_total
                                                    )}    
                                                </td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </Table>
                        </div>
                        <div className='mx-2'>
                            <h5>
                                {getFormattedMessage( "globally.input.notes.label")}:
                            </h5>
                            {
                                stockExchangeDetail.attributes && (
                                    <p className="border p-3" style={{backgroundColor: "#f4f8fc"}}>
                                        {stockExchangeDetail.attributes.note}
                                    </p>
                                )
                            }
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
};


const mapStateToProps = ( state ) => {
    const { stockExchanges, stockExchangeDetail, isLoading, frontSetting, allConfigData } = state;
    return { stockExchanges, stockExchangeDetail, isLoading, frontSetting, allConfigData };
};

export default connect( mapStateToProps, { fetchFrontSetting, getStockExchangeDetail } )( StockExchangeDetail );

