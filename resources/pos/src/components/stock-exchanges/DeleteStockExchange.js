import React from 'react';
import {connect} from 'react-redux';
import DeleteModel from '../../shared/action-buttons/DeleteModel';
import {getFormattedMessage} from '../../shared/sharedMethod';
import { deleteStockExchange } from '../../store/action/stockExchangeAction';

const DeleteStockExchange = (props) => {
    const {deleteStockExchange, onDelete, deleteModel, onClickDeleteModel} = props;

    const deleteItemOnClick = () => {
        deleteStockExchange(onDelete.id);
        onClickDeleteModel(false);
    };

    return (
        <div>
            {deleteModel && <DeleteModel onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel}
                deleteUserClick={deleteItemOnClick} name={getFormattedMessage('stock-exchange.title')}/>}
        </div>
    )
};

export default connect(null, {deleteStockExchange})(DeleteStockExchange);
