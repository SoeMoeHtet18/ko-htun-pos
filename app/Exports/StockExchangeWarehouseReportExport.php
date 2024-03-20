<?php

namespace App\Exports;

use App\Models\Sale;
use App\Models\StockExchange;
use Maatwebsite\Excel\Concerns\FromView;

class StockExchangeWarehouseReportExport implements FromView
{
    public function view(): \Illuminate\Contracts\View\View
    {
        $warehouseId = request()->get('warehouse_id');
        if (isset($warehouseId) && $warehouseId != 'null') {
            $stockExchanges = StockExchange::whereWarehouseId($warehouseId)->with('warehouse', 'sales.customer', 'returnInItems.product', 'returnOutProduct.product')->get();
        } else {
            $stockExchanges = StockExchange::with('warehouse', 'sales.customer', 'returnInItems.product', 'returnOutItems.product')->get();
        }

        return view('excel.stock-exchange-report-excel', ['stockExchanges' => $stockExchanges]);
    }
}
