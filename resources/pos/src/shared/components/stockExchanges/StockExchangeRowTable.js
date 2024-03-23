import React, {useEffect} from 'react';
import {Table} from 'react-bootstrap-v5';
import {getFormattedMessage} from '../../sharedMethod';
import StockExchangeTableBody from './StockExchangeTableBody';

const StockExchangeRowTable = (props) => {
    const {
        updateProducts, setUpdateProducts,
        frontSetting, updateSubTotal, warehouse, isReturnIn
    } = props;

    useEffect(() => {
        setUpdateProducts(updateProducts);
    }, [updateProducts]);

    return (
        <Table responsive>
            <thead>
            <tr>
                <th>{getFormattedMessage('product.title')}</th>
                <th>{getFormattedMessage('product.product-details.code-product.label')}</th>
                {/* <th className={isReturnIn && 'd-none'}>{getFormattedMessage('purchase.order-item.table.stock.column.label')}</th>
                <th className='d-none'>{getFormattedMessage('purchase.order-item.table.qty.column.label')}</th>
                <th>{getFormattedMessage("product.input.product-cost.label")}</th> */}
                <th>{getFormattedMessage("product.input.product-price.label")}</th>
                {/* <th className='d-none'>{getFormattedMessage("expense.input.amount.label")}</th> */}
                <th className="text-center">{getFormattedMessage('react-data-table.action.column.label')}</th>
            </tr>
            </thead>
            <tbody>
            {updateProducts && updateProducts.length ? updateProducts.map((singleProduct, index) => {
                return <StockExchangeTableBody singleProduct={singleProduct} key={index} index={index} updateProducts={updateProducts} warehouse={warehouse}
                            setUpdateProducts={setUpdateProducts} frontSetting={frontSetting} updateSubTotal={updateSubTotal}
                        />
                }): <tr>
                <td colSpan={6} className='fs-5 px-3 py-6 custom-text-center'>
                    {getFormattedMessage('sale.product.table.no-data.label')}
                </td>
            </tr>}
            </tbody>
        </Table>
    )
};

export default StockExchangeRowTable;
