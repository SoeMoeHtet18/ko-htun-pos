import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import MasterLayout from '../MasterLayout';
import HeaderTitle from '../header/HeaderTitle';
import {fetchAllWarehouses} from '../../store/action/warehouseAction';
import {getFormattedMessage} from '../../shared/sharedMethod';
import ConversionForm from './ConversionForm';
import { addConversion } from '../../store/action/conversionAction';

const CreateConversion = (props) => {
    const {addConversion, warehouses, fetchAllWarehouses} = props;
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllWarehouses();
    }, []);

    const addConversionData = (formValue) => {
        addConversion(formValue, navigate);
    };

    return (
        <MasterLayout>
            <HeaderTitle title={getFormattedMessage('conversions.create.title')} to='/app/conversions'/>
            <ConversionForm addConversionData={addConversionData} warehouses={warehouses}/>
        </MasterLayout>
    )
};

const mapStateToProps = (state) => {
    const {warehouses, totalRecord} = state;
    return {warehouses, totalRecord}
};

export default connect(mapStateToProps, {addConversion, fetchAllWarehouses})(CreateConversion);
