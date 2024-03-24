<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\AppBaseController;
use App\Http\Resources\StockExchangeCollection;
use App\Http\Resources\StockExchangeResource;
use App\Models\Customer;
use App\Models\ManageStock;
use App\Models\Sale;
use App\Models\StockExchange;
use App\Models\StockExchangeReturnInItem;
use App\Models\StockExchangeReturnOutItem;
use App\Models\Warehouse;
use App\Repositories\StockExchangeRepository;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

class StockExchangeAPIController extends AppBaseController
{
    /** @var StockExchangeRepository */
    private $stockExchangeRepository;

    public function __construct(StockExchangeRepository $stockExchangeRepository)
    {
        $this->stockExchangeRepository = $stockExchangeRepository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = getPageSize($request);
        $search = $request->filter['search'] ?? '';

        $customer = (Customer::where('name', 'LIKE', "%$search%")->get()->count() != 0);
        $warehouse = (Warehouse::where('name', 'LIKE', "%$search%")->get()->count() != 0);
        $sales = (Sale::where('reference_code', 'LIKE', "%$search%")->get()->count() != 0);
        $returnInItem = StockExchangeReturnInItem::whereHas('product', function (Builder $q) use ($search) {
            $q->where('name', 'LIKE', "%$search%");
        })->exists();
        $returnOutItem = StockExchangeReturnOutItem::whereHas('product', function (Builder $q) use ($search) {
            $q->where('name', 'LIKE', "%$search%");
        })->exists();

        $stockExchanges = $this->stockExchangeRepository;
        
        if ($warehouse || $sales || $customer || $returnInItem || $returnOutItem) {
            $stockExchanges->whereHas('warehouse', function (Builder $q) use ($search, $warehouse) {
                if ($warehouse) {
                    $q->where('name', 'LIKE', "%$search%");
                }
            })->whereHas('sales', function (Builder $q) use ($search, $sales, $customer) {
                if ($sales) {
                    $q->where('reference_code', 'LIKE', "%$search%");
                }
                if ($customer) {
                    $q->whereHas('customer', function (Builder $q) use ($search) {
                        $q->where('name', 'LIKE', "%$search%");
                    });
                }
            })->whereHas('returnInItems.product', function (Builder $q) use ($search, $returnInItem) {
                if ($returnInItem) {
                    $q->where('name', 'LIKE', "%$search%")
                        ->orWhere('code', 'LIKE', "%$search%");
                }
            })->whereHas('returnOutItems.product', function (Builder $q) use ($search, $returnOutItem) {
                if ($returnOutItem) {
                    $q->where('name', 'LIKE', "%$search%")
                        ->orWhere('code', 'LIKE', "%$search%");
                }
            });
        }

        if ($search !== '') {
            $stockExchanges->orWhere('reference_code', 'LIKE', "%$search%");
        }

        if ($request->get('start_date') && $request->get('end_date')) {
            $stockExchanges->whereBetween('date', [$request->get('start_date'), $request->get('end_date')]);
        }

        if ($request->get('warehouse_id')) {
            $stockExchanges->where('warehouse_id', $request->get('warehouse_id'));
        }

        if ($request->get('payment_status') && $request->get('payment_status') != 'null') {
            $stockExchanges->where('payment_status', $request->get('payment_status'));
        }

        if ($request->get('payment_type') && $request->get('payment_type') != 'null') {
            $stockExchanges->where('payment_type', $request->get('payment_type'));
        }

        $stockExchanges = $stockExchanges->paginate($perPage);

        StockExchangeResource::usingWithCollection();

        return new StockExchangeCollection($stockExchanges);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $input = $request->all();
        $sale = $this->stockExchangeRepository->storeStockExchange($input);

        return new StockExchangeResource($sale);
    }

    /**
     * Display the specified resource.
     */
    public function show(StockExchange $stockExchange)
    {
        $stockExchange = $this->stockExchangeRepository->find($stockExchange->id);

        return new StockExchangeResource($stockExchange);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(StockExchange $stockExchange)
    {
        $stockExchange = $stockExchange->load('returnInItems.product', 'returnOutItems.product', 'warehouse');

        return new StockExchangeResource($stockExchange);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, StockExchange $stockExchange)
    {
        $input = $request->all();
        $stockExchange = $this->stockExchangeRepository->updateStockExchange($input, $stockExchange->id);

        return new StockExchangeResource($stockExchange);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(StockExchange $stockExchange)
    {
        try {
            DB::beginTransaction();
            $stockExchange = $this->stockExchangeRepository->with('returnInItems', 'returnOutItems')
                ->where('id', $stockExchange->id)->first();

            foreach ($stockExchange->returnInItems as $returnItem) {
                $productQuantity = ManageStock::whereWarehouseId($stockExchange->warehouse_id)->whereProductId($returnItem->product_id)->first();
                $productQuantity->update([
                    'quantity' => $productQuantity->quantity - 1
                ]);
            }

            foreach ($stockExchange->returnInItems as $returnItem) {
                $productQuantity->update([
                    'quantity' => $productQuantity->quantity + 1
                ]);
            }

            $this->stockExchangeRepository->delete($stockExchange->id);
            DB::commit();

            return $this->sendSuccess('Stock Exchange Deleted successfully');
        } catch (Exception $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }
    }
}
