import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import { currencySymbolHandling, getFormattedMessage } from '../../shared/sharedMethod';

const PaymentDetail = ( props ) => {
    const { paymentData, lgShow, setLgShow, frontSetting, allConfigData } = props;

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
                        {getFormattedMessage( "payment.detail.title" )}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='mw-100 overflow-auto'>
                         <div className='mx-2'>
                            <Table bordered hover>
                                <thead>
                                    <tr>
                                        <th>{getFormattedMessage( "pos-sub-total.title" )}</th>
                                        <th>{getFormattedMessage( "globally.detail.discount" )}</th>
                                        <th>{getFormattedMessage(  "globally.detail.tax" )}</th>
                                        <th>{getFormattedMessage(  "globally.detail.shipping" )}</th>
                                        <th>{getFormattedMessage(  "globally.detail.grand.total" )}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paymentData && 
                                    (
                                        <tr>
                                        <td>{currencySymbolHandling(
                                                allConfigData,
                                                frontSetting.value && frontSetting.value.currency_symbol,
                                                paymentData.sub_total)
                                            }
                                        </td>
                                        <td>{currencySymbolHandling(
                                                allConfigData,
                                                frontSetting.value && frontSetting.value.currency_symbol,
                                                Number(paymentData.discount))
                                            }
                                        </td>
                                        <td>{currencySymbolHandling(
                                                allConfigData,
                                                frontSetting.value && frontSetting.value.currency_symbol,
                                                Number(paymentData.tax_amount))
                                            } ({Number(paymentData.tax_rate)}%)
                                        </td>
                                        <td>{currencySymbolHandling(
                                                allConfigData,
                                                frontSetting.value && frontSetting.value.currency_symbol,
                                                Number(paymentData.shipping))
                                            } 
                                        </td>
                                        <td>{currencySymbolHandling(
                                                allConfigData,
                                                frontSetting.value && frontSetting.value.currency_symbol,
                                                paymentData.grand_total)
                                            }
                                        </td>
                                    </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
};

export default PaymentDetail;

