<?php

namespace App\Exports;

use App\Models\Customer;
use App\Models\Sale;
use App\Models\SaleReturn;
use App\Models\StockExchange;
use App\Models\SaleItem;
use App\Models\SaleReturnItem;
use App\Models\Product;
use Maatwebsite\Excel\Concerns\FromView;
use Illuminate\Database\Eloquent\Builder;

class GrossProfitReportExport implements FromView
{
    public function view(): \Illuminate\Contracts\View\View
    {
        $search = request()->get('filter') ?? '';

        $startDate = request()->get('start_date');
        $endDate = request()->get('start_date');

        $sales = Sale::query();
        $stockExchanges = StockExchange::query();
        $saleReturns = SaleReturn::query();

        if ($startDate != 'null' && $endDate != 'null' && $startDate && $endDate) {
            $sales = $sales->whereDate('created_at', '>=', $startDate)
                ->whereDate('created_at', '<=', $endDate);

            $stockExchanges = $stockExchanges->whereDate('created_at', '>=', $startDate)
                ->whereDate('created_at', '<=', $endDate)->get();

            $saleReturns = $saleReturns->whereDate('created_at', '>=', $startDate)
                ->whereDate('created_at', '<=', $endDate)->get();
        }
        
        $sales = $sales->pluck('id')->toArray();
        $stockExchanges = $stockExchanges->with('returnInItems.product', 'returnOutItems.product')->get();
        $saleReturns = $saleReturns->pluck('id')->toArray();

        $salesItemIds = SaleItem::whereIn('sale_id', $sales)->pluck('id')->toArray();
        $saleProducts = Product::whereHas('saleItems', function($q) use ($salesItemIds) {
            if($salesItemIds) {
                $q->whereIn('id', $salesItemIds);
            }
        })->with(['saleItems' => function ($query) use ($salesItemIds) {
            $query->whereIn('id', $salesItemIds);
        }])->get();

        $saleReturnItemIds = SaleReturnItem::whereIn('sale_return_id', $saleReturns)->pluck('id')->toArray();
        $saleReturnProducts = Product::whereHas('saleReturnItems', function($q) use ($saleReturnItemIds) {
            if($saleReturnItemIds) {
                $q->whereIn('id', $saleReturnItemIds);
            }
        })->with(['saleReturnItems' => function ($query) use ($saleReturnItemIds) {
            $query->whereIn('id', $saleReturnItemIds);
        }])->get();

        $data = array(
            'sales' => $saleProducts,
            'stockExchanges' => $stockExchanges,
            'saleReturns' => $saleReturnProducts
        );
        
        return view('excel.gross-profit-report-excel', ['data' => $data]);
    }
}
