import React from "react";
import {
    calculateCartTotalAmount,
    calculateSubTotal,
} from "../../shared/calculation/calculation";
import {
    currencySymbolHandling,
    getFormattedMessage,
} from "../../shared/sharedMethod";

const ProductMainCalculation = (props) => {
    const { inputValues, updateReturnInProducts, updateReturnOutProducts, frontSetting, allConfigData } = props;
    
    console.log((updateReturnOutProducts));
    let totalAmountAfterDiscount =
        calculateSubTotal(updateReturnOutProducts) - inputValues.discount;
    let taxCal = (
        (totalAmountAfterDiscount * inputValues.tax_rate) /
        100
    ).toFixed(2);

    return (
        <div className="col-xxl-5 col-lg-6 col-md-6 col-12 float-end">
            <div className="card">
                <div className="card-body pt-7 pb-2">
                    <div className="table-responsive">
                        <table className="table border">
                            <tbody>
                                <tr>
                                    <td className="py-3">
                                        {getFormattedMessage(
                                            "purchase.input.order-tax.label"
                                        )}
                                    </td>
                                    <td className="py-3">
                                        {currencySymbolHandling(
                                            allConfigData,
                                            frontSetting.value &&
                                                frontSetting.value
                                                    .currency_symbol,
                                            taxCal
                                        )}{" "}
                                        (
                                        {parseFloat(
                                            inputValues.tax_rate
                                                ? inputValues.tax_rate
                                                : 0
                                        ).toFixed(2)}
                                        ) %
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-3">
                                        {getFormattedMessage(
                                            "purchase.order-item.table.discount.column.label"
                                        )}
                                    </td>
                                    <td className="py-3">
                                        {currencySymbolHandling(
                                            allConfigData,
                                            frontSetting.value &&
                                                frontSetting.value
                                                    .currency_symbol,
                                            inputValues.discount
                                                ? inputValues.discount
                                                : 0
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-3">
                                        {getFormattedMessage(
                                            "purchase.input.shipping.label"
                                        )}
                                    </td>
                                    <td className="py-3">
                                        {currencySymbolHandling(
                                            allConfigData,
                                            frontSetting.value &&
                                                frontSetting.value
                                                    .currency_symbol,
                                            inputValues.shipping
                                                ? inputValues.shipping
                                                : 0
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-3">
                                        {getFormattedMessage(
                                            "stock-exchange.return-in-price.label"
                                        )}
                                    </td>
                                    <td className="py-3 text-primary">
                                        {currencySymbolHandling(
                                            allConfigData,
                                            frontSetting.value &&
                                                frontSetting.value
                                                    .currency_symbol,
                                            calculateCartTotalAmount(updateReturnInProducts)
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-3">
                                        {getFormattedMessage(
                                            "stock-exchange.return-out-price.label"
                                        )}
                                    </td>
                                    <td className="py-3 text-primary">
                                        {currencySymbolHandling(
                                            allConfigData,
                                            frontSetting.value &&
                                                frontSetting.value
                                                    .currency_symbol,
                                            calculateCartTotalAmount(
                                                updateReturnOutProducts,
                                                inputValues
                                            )
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-3 text-primary">
                                        {getFormattedMessage(
                                            "purchase.grant-total.label"
                                        )}
                                    </td>
                                    <td className="py-3 text-primary">
                                        {currencySymbolHandling(
                                            allConfigData,
                                            frontSetting.value &&
                                                frontSetting.value
                                                    .currency_symbol,
                                            calculateCartTotalAmount(
                                                updateReturnOutProducts,
                                                inputValues
                                            ) - calculateCartTotalAmount(updateReturnInProducts)
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductMainCalculation;
