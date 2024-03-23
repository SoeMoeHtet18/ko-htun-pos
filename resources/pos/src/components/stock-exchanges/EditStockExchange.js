import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {useParams} from 'react-router-dom';
import MasterLayout from '../MasterLayout';
import HeaderTitle from '../header/HeaderTitle';
import {fetchStockExchange} from '../../store/action/stockExchangeAction';
import {fetchAllWarehouses} from '../../store/action/warehouseAction';
import {getFormattedMessage} from '../../shared/sharedMethod';
import Spinner from "../../shared/components/loaders/Spinner";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import StockExchangeForm from './StockExchangeForm';
import paymentStatus from '../../shared/option-lists/paymentStatus.json';
import paymentType from '../../shared/option-lists/paymentType.json';

const EditStockExchange = (props) => {
    const {warehouses, fetchAllWarehouses, isLoading, fetchStockExchange, stockExchanges} = props;
    const {id} = useParams();

    useEffect(() => {
        fetchAllWarehouses();
        fetchStockExchange(id);
    }, []);

    const selectedPayment = stockExchanges.attributes && stockExchanges.attributes.payment_status && paymentStatus.filter( ( item ) => item.value === stockExchanges.attributes.payment_status )
    const selectedPaymentType = stockExchanges.attributes && stockExchanges.attributes.payment_type && paymentType.filter( ( item ) => item.value === stockExchanges.attributes.payment_type )

    const itemsValue = stockExchanges && stockExchanges.attributes && {
        date: stockExchanges.attributes.date,
        warehouse_id: {
            value: stockExchanges.attributes.warehouse_id,
            label: stockExchanges.attributes.warehouse_name,
        },
        sales_id: {
            value: stockExchanges.attributes.sales_id,
            label: stockExchanges.attributes.sales_reference_code,
        },
        tax_rate: stockExchanges.attributes.tax_rate,
        tax_amount: stockExchanges.attributes.tax_amount,
        discount: stockExchanges.attributes.discount,
        shipping: stockExchanges.attributes.shipping,
        grand_total: stockExchanges.attributes.grand_total,
        amount: stockExchanges.attributes.amount,
        return_in_items: stockExchanges.attributes.return_in_items.map( ( item ) => ( {
            code: item.product && item.product.code,
            name: item.product && item.product.name,
            product_unit: item.product.product_unit,
            product_id: item.product_id,
            short_name: item.sale_unit && item.sale_unit.short_name && item.sale_unit.short_name,
            stock_alert: item.product && item.product.stock_alert,
            product_price: item.product_price,
            fix_net_unit: item.product_price,
            net_unit_price: item.product_price,
            tax_type: item.tax_type,
            tax_value: item.tax_value,
            tax_amount: 0,
            discount_type: item.discount_type,
            discount_value: item.discount_value,
            discount_amount: 0,
            isEdit: true,
            // stock: item.product && item.product.stocks.filter( item => item.warehouse_id === stockExchanges.attributes.warehouse_id ),
            sub_total: item.sub_total,
            sale_unit: item.sale_unit && item.sale_unit.id && item.sale_unit.id,
            quantity: item.quantity,
            id: item.id,
            stock_exchange_item_id: item.id,
            newItem: '',
        } ) ),
        return_out_items: stockExchanges.attributes.return_out_items.map( ( item ) => ( {
            code: item.product && item.product.code,
            name: item.product && item.product.name,
            product_unit: item.product.product_unit,
            product_id: item.product_id,
            short_name: item.sale_unit && item.sale_unit.short_name && item.sale_unit.short_name,
            stock_alert: item.product && item.product.stock_alert,
            product_price: item.product_price,
            fix_net_unit: item.product_price,
            net_unit_price: item.product_price,
            tax_type: item.tax_type,
            tax_value: item.tax_value,
            tax_amount: 0,
            discount_type: item.discount_type,
            discount_value: item.discount_value,
            discount_amount: 0,
            isEdit: true,
            // stock: item.product && item.product.stocks.filter( item => item.warehouse_id === stockExchanges.attributes.warehouse_id ),
            sub_total: item.sub_total,
            sale_unit: item.sale_unit && item.sale_unit.id && item.sale_unit.id,
            quantity: item.quantity,
            id: item.id,
            stock_exchange_item_id: item.id,
            newItem: '',
        } ) ),
        id: stockExchanges.id,
        notes: stockExchanges.attributes.note,
        payment_status: {
            label: selectedPayment && selectedPayment[ 0 ] && selectedPayment[ 0 ].label,
            value: selectedPayment && selectedPayment[ 0 ] && selectedPayment[ 0 ].value
        },
        payment_type: {
            label: selectedPaymentType && selectedPaymentType[ 0 ] && selectedPaymentType[ 0 ].label,
            value: selectedPaymentType && selectedPaymentType[ 0 ] && selectedPaymentType[ 0 ].value
        },
    };

    return (
        <MasterLayout>
            <TopProgressBar />
            <HeaderTitle title={getFormattedMessage('stock-exchange.edit.title')} to='/app/stock-exchanges'/>
            {isLoading ? <Spinner /> :
                <StockExchangeForm singleStockExchange={itemsValue} id={id} warehouses={warehouses}/>}
        </MasterLayout>
    )
};

const mapStateToProps = (state) => {
    const {warehouses, isLoading, stockExchanges} = state;
    return {warehouses, isLoading, stockExchanges}
};

export default connect(mapStateToProps, {fetchAllWarehouses, fetchStockExchange})(EditStockExchange);
