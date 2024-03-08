import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import { fetchFrontSetting } from '../../store/action/frontSettingAction';
import { getConversionDetails } from '../../store/action/conversionDetailsAction';
import Table from 'react-bootstrap/Table';
import moment from 'moment';
import { getFormattedMessage } from '../../shared/sharedMethod';

const ConversionDetail = ( props ) => {
    const { onDetails, lgShow, setLgShow, fetchFrontSetting, conversionDetails, getConversionDetails } = props;

    useEffect( () => {
        fetchFrontSetting()
    }, [] )

    useEffect( () => {
        if ( onDetails !== null ) {
            getConversionDetails( onDetails )
        }
    }, [ onDetails ] )

    const onsetLgShow = () => {
        setLgShow( false )
    }

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
                        {getFormattedMessage( "conversions.detail.title" )}
                    </Modal.Title>
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
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{conversionDetails && conversionDetails.attributes && moment( conversionDetails.attributes.date ).format( 'YYYY-MM-DD' )}</td>
                                        <td>{conversionDetails && conversionDetails.attributes && conversionDetails.attributes.reference_code}</td>
                                        <td>{conversionDetails && conversionDetails.attributes && conversionDetails.attributes.warehouse_name}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                         <div className='mx-2'>
                            <h5>
                                {getFormattedMessage( 'conversions.stock-out-item.table.label' )}:
                            </h5>
                            <Table bordered hover>
                                <thead>
                                    <tr>
                                        <th>{getFormattedMessage( "globally.detail.product" )}</th>
                                        <th>{getFormattedMessage( "product.product-details.code-product.label" )}</th>
                                        <th>{getFormattedMessage( "dashboard.stockAlert.quantity.label" )}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {conversionDetails && conversionDetails.attributes && conversionDetails.attributes.conversion_items.filter((item) => {
                                        return item.type === 'stock_in'
                                    }).map( ( item, index ) => {
                                        return (
                                            <tr key={index}>
                                                <td>{item.product.name}</td>
                                                <td>{item.product.code}</td>
                                                <td>{item.quantity}</td>
                                            </tr>
                                        )
                                    } )}
                                </tbody>
                            </Table>
                        </div>
                        <div className='mx-2'>
                            <h5>
                                {getFormattedMessage( 'conversions.stock-out-item.table.label' )}:
                            </h5>
                           <Table bordered hover>
                                <thead>
                                    <tr>
                                        <th>{getFormattedMessage( "globally.detail.product" )}</th>
                                        <th>{getFormattedMessage( "product.product-details.code-product.label" )}</th>
                                        <th>{getFormattedMessage( "dashboard.stockAlert.quantity.label" )}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {conversionDetails && conversionDetails.attributes && conversionDetails.attributes.conversion_items.filter((item) => {
                                        return item.type === 'stock_out'
                                    }).map( ( item, index ) => {
                                        return (
                                            <tr key={index}>
                                                <td>{item.product.name}</td>
                                                <td>{item.product.code}</td>
                                                <td>{item.quantity}</td>
                                            </tr>
                                        )
                                    } )}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
};


const mapStateToProps = ( state ) => {
    const { conversions, conversionDetails, isLoading, frontSetting } = state;
    return { conversions, conversionDetails, isLoading, frontSetting };
};

export default connect( mapStateToProps, { fetchFrontSetting, getConversionDetails } )( ConversionDetail );

