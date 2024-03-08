import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {useParams} from 'react-router-dom';
import MasterLayout from '../MasterLayout';
import HeaderTitle from '../header/HeaderTitle';
import {fetchConversion} from '../../store/action/conversionAction';
import {fetchAllWarehouses} from '../../store/action/warehouseAction';
import {getFormattedMessage} from '../../shared/sharedMethod';
import Spinner from "../../shared/components/loaders/Spinner";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import ConversionForm from './ConversionForm';

const EditConversion = (props) => {
    const {warehouses, fetchAllWarehouses, isLoading, fetchConversion, conversions} = props;
    const {id} = useParams();

    useEffect(() => {
        fetchAllWarehouses();
        fetchConversion(id)
    }, []);

    const itemsValue = conversions && conversions.attributes && {
        date: conversions.attributes.date,
        warehouse_id: {
            value: conversions.attributes.warehouse_id,
            label: conversions.attributes.warehouse_name,
        },
        stock_in_items: conversions.attributes.conversion_items.filter((item) => item.type === 'stock_in').map((item) => ({
            code: item.product && item.product.code,
            name: item.product && item.product.name,
            product_unit: item.product.product_unit,
            product_id: item.product_id,
            short_name: item.sale_unit && item.sale_unit,
            stock_alert:  item.product && item.product.stock_alert,
            product_price: item.product && item.product.product_price,
            fix_net_unit: item.product && item.product.product_price,
            net_unit_price: item.product && item.product.product_price,
            tax_type: item.product && item.product.tax_type,
            tax_value: item.tax_value,
            tax_amount: item.tax_amount,
            discount_type: item.discount_type,
            discount_value: item.discount_value,
            discount_amount: item.discount_amount,
            sub_total: item.sub_total,
            sale_unit: item.product && item.product.sale_unit,
            quantity: item.quantity,
            // stock: item.product && item.product.stocks?.filter(items => items.warehouse_id === conversions.attributes.warehouse_id),
            id: item.product_id,
            sale_item_id: item.id,
            newItem: '',
            adjustMethod: item.method_type,
            isEdit: true,
            conversion_item_id: item.id

        })),
        stock_out_items: conversions.attributes.conversion_items.filter((item) => item.type === 'stock_out').map((item) => ({
            code: item.product && item.product.code,
            name: item.product && item.product.name,
            product_unit: item.product.product_unit,
            product_id: item.product_id,
            short_name: item.sale_unit && item.sale_unit,
            stock_alert:  item.product && item.product.stock_alert,
            product_price: item.product && item.product.product_price,
            fix_net_unit: item.product && item.product.product_price,
            net_unit_price: item.product && item.product.product_price,
            tax_type: item.product && item.product.tax_type,
            tax_value: item.tax_value,
            tax_amount: item.tax_amount,
            discount_type: item.discount_type,
            discount_value: item.discount_value,
            discount_amount: item.discount_amount,
            sub_total: item.sub_total,
            sale_unit: item.product && item.product.sale_unit,
            quantity: item.quantity,
            // stock: item.product && item.product.stocks?.filter(items => items.warehouse_id === conversions.attributes.warehouse_id),
            id: item.product_id,
            sale_item_id: item.id,
            newItem: '',
            adjustMethod: item.method_type,
            isEdit: true,
            conversion_item_id: item.id

        })),
        id: conversions.id,
        notes: conversions.attributes.note,
    };

    return (
        <MasterLayout>
            <TopProgressBar />
            <HeaderTitle title={getFormattedMessage('conversions.edit.title')} to='/app/conversions'/>
            {isLoading ? <Spinner /> :
                <ConversionForm singleConversion={itemsValue} id={id} warehouses={warehouses}/>}
        </MasterLayout>
    )
};

const mapStateToProps = (state) => {
    const {warehouses, isLoading, conversions} = state;
    return {warehouses, isLoading, conversions}
};

export default connect(mapStateToProps, {fetchAllWarehouses, fetchConversion})(EditConversion);
