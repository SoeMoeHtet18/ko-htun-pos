import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import MasterLayout from '../MasterLayout';
import HeaderTitle from '../header/HeaderTitle';
import {fetchAllWarehouses} from '../../store/action/warehouseAction';
import {getFormattedMessage} from '../../shared/sharedMethod';
import StockExchangeForm from './StockExchangeForm';
import { addStockExchange } from '../../store/action/stockExchangeAction';

const CreateStockExchange = (props) => {
    const {addStockExchange, warehouses, fetchAllWarehouses} = props;
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllWarehouses();
    }, []);

    const addStockExchangeData = (formValue) => {
        addStockExchange(formValue, navigate);
    };

    return (
        <MasterLayout>
            <HeaderTitle title={getFormattedMessage('stock-exchange.create.title')} to='/app/stock-exchanges'/>
            <StockExchangeForm addStockExchangeData={addStockExchangeData} warehouses={warehouses}/>
        </MasterLayout>
    )
};

const mapStateToProps = (state) => {
    const {warehouses, totalRecord} = state;
    return {warehouses, totalRecord}
};

export default connect(mapStateToProps, {addStockExchange, fetchAllWarehouses})(CreateStockExchange);
