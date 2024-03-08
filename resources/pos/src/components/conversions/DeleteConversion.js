import React from 'react';
import {connect} from 'react-redux';
import DeleteModel from '../../shared/action-buttons/DeleteModel';
import { deleteConversion } from '../../store/action/conversionAction';
import {getFormattedMessage} from '../../shared/sharedMethod';

const DeleteConversion = (props) => {
    const {deleteConversion, onDelete, deleteModel, onClickDeleteModel} = props;

    const deleteItemOnClick = () => {
        deleteConversion(onDelete.id);
        onClickDeleteModel(false);
    };

    return (
        <div>
            {deleteModel && <DeleteModel onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel}
                deleteUserClick={deleteItemOnClick} name={getFormattedMessage('conversions.title')}/>}
        </div>
    )
};

export default connect(null, {deleteConversion})(DeleteConversion);
