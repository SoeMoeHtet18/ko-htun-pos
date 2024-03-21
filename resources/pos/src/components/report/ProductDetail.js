import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import { getFormattedMessage } from '../../shared/sharedMethod';

const ProductDetail = ( props ) => {
    const { onDetails, lgShow, setLgShow } = props;

    const [ products, setProducts ] = useState([]);

    useEffect( () => {
        if ( onDetails !== null ) {
            const prepareArray = onDetails.map((item) => {
                return {
                    product_id: item.product.id,
                    product_name: item.product.name,
                    product_code: item.product.code,
                    product_cost: item.product_cost,
                    product_price: item.product_price
                };
            })
            setProducts(prepareArray);
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
                        {getFormattedMessage( "product.product-details.title" )}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='mw-100 overflow-auto'>
                         <div className='mx-2'>
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
                                    {products && products.length > 0 && products.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{item.product_name}</td>
                                                <td>{item.product_code}</td>
                                                <td>{item.product_cost}</td>
                                                <td>{item.product_price}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
};

export default ProductDetail;

