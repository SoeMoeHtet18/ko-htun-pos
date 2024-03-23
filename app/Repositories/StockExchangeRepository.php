<?php

namespace App\Repositories;

use App\Models\ManageStock;
use App\Models\Product;
use App\Models\SaleItem;
use App\Models\StockExchange;
use App\Models\StockExchangeReturnInItem;
use App\Models\StockExchangeReturnOutItem;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

/**
 * Class SaleRepository
 */
class StockExchangeRepository extends BaseRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'date',
        'grand_total',
        'warehouse_id',
        'sales_id',
        'user_id',
        'created_at',
        'reference_code'
    ];

    /**
     * @var string[]
     */
    protected $allowedFields = [
        'date',
        'grand_total',
        'warehouse_id',
        'sales_id',
        'user_id',
        'created_at',
        'reference_code'
    ];

    /**
     * Return searchable fields
     */
    public function getFieldsSearchable(): array
    {
        return $this->fieldSearchable;
    }

    /**
     * Configure the Model
     **/
    public function model(): string
    {
        return StockExchange::class;
    }

    public function storeStockExchange($input): StockExchange
    {
        try {
            DB::beginTransaction();

            $input['date'] = $input['date'] ?? date('Y/m/d');
            $stockExchangeInputArray = Arr::only($input, [
                'date', 'discount', 'warehouse_id', 'tax_rate', 'tax_amount', 'shipping', 'grand_total',
                'payment_type', 'note', 'status', 'payment_status', 'sales_id'
            ]);
            $stockExchangeInputArray['user_id'] = Auth::id();
            /** @var StockExchange $stockExchange */
            $stockExchange = StockExchange::create($stockExchangeInputArray);

            $stockExchange = $this->storeStockExchangeItems($stockExchange, $input);

            $reference_code = 'SE_111' . $stockExchange->id;
            $stockExchange->update(['reference_code' => $reference_code]);

            foreach ($input['return_in_items'] as $returnInItem) {
                ManageStock::whereWarehouseId($input['warehouse_id'])
                    ->whereProductId($returnInItem['product_id'])
                    ->increment('quantity');
            }

            foreach ($input['return_out_items'] as $returnOutItems) {
                $product = ManageStock::whereWarehouseId($input['warehouse_id'])->whereProductId($returnOutItems['product_id'])->first();
                if (isset($returnOutItems['quantity'])) {
                    if ($product && $product->quantity >= $returnOutItems['quantity']) {
                        $totalQuantity = $product->quantity - $returnOutItems['quantity'];
                        $product->update([
                            'quantity' => $totalQuantity,
                        ]);
                    } else {
                        throw new UnprocessableEntityHttpException('Quantity must be less than Available quantity.');
                    }
                } else {
                    if ($product->quantity === 0) {
                        throw new UnprocessableEntityHttpException('Product is stocked out.');
                    }
                    $product->decrement('quantity');
                }
            }

            DB::commit();

            return $stockExchange;
        } catch (Exception $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }
    }

    public function storeStockExchangeItems($stockExchange, $input): StockExchange
    {
        $returnInItems = $input['return_in_items'];
        foreach ($returnInItems as $returnInItem) {
            $product = SaleItem::whereSaleId($input['sales_id'])
                ->whereProductId($returnInItem['product_id'])
                ->first();

            $returnInItemInputArray = [
                'stock_exchange_id' => $stockExchange->id,
                'product_id' => $product->product_id,
                'product_cost' => $product->product_cost,
                'product_price' => $product->product_price
            ];

            $returnIn = new StockExchangeReturnInItem($returnInItemInputArray);
            $stockExchange->returnInItems()->save($returnIn);
        }

        $returnOutItems = $input['return_out_items'];
        foreach ($returnOutItems as $returnOutItem) {
            $product = Product::whereId($returnOutItem['product_id'])->first();

            $returnOutItemInputArray = [
                'stock_exchange_id' => $stockExchange->id,
                'product_id' => $product->id,
                'product_cost' => $product->product_cost,
                'product_price' => $product->product_price
            ];

            $returnOut = new StockExchangeReturnOutItem($returnOutItemInputArray);
            $stockExchange->returnOutItems()->save($returnOut);
        }

        return $stockExchange;
    }

    public function updateStockExchange($input, $id)
    {
        try {
            DB::beginTransaction();

            $input['date'] = $input['date'] ?? date('Y/m/d');
            $stockExchangeInputArray = Arr::only($input, [
                'date', 'discount', 'warehouse_id', 'tax_rate', 'tax_amount', 'shipping', 'grand_total',
                'payment_type', 'note', 'status', 'payment_status', 'sales_id'
            ]);
            $stockExchangeInputArray['user_id'] = Auth::id();

            $stockExchange = StockExchange::findOrFail($id);
            $stockExchange->update($stockExchangeInputArray);

            $returnInIds = StockExchangeReturnInItem::whereStockExchangeId($id)->pluck('id')->toArray();
            $this->updateStockExchangeItems($input, $stockExchange, $returnInIds, 'return_in');
            $returnOutIds = StockExchangeReturnOutItem::whereStockExchangeId($id)->pluck('id')->toArray();
            $this->updateStockExchangeItems($input, $stockExchange, $returnOutIds, 'return_out');

            DB::commit();

            return $stockExchange;
        } catch (Exception $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }
    }

    public function updateStockExchangeItems($input, $stockExchange, $itemIds, $type): bool
    {
        try {
            $oldItemIds = [];
            foreach ($type === 'return_in' ? $input['return_in_items'] : $input['return_out_items'] as $key => $item) {
                $product = Product::whereId($item['product_id'])->first();

                if ($type === 'return_out' && !empty($product) && isset($product->quantity_limit) && isset($returnInItem['quantity']) && $returnInItem['quantity'] > $product->quantity_limit) {
                    throw new UnprocessableEntityHttpException('Please enter less than ' . $product->quantity_limit . ' quantity of ' . $product->name . ' product.');
                }

                //get different ids & update
                $oldItemIds[$key] = $item['stock_exchange_item_id'] ?? null;

                //create new product items
                if (isset($item['stock_exchange_item_id'])) {
                    if ($type === 'return_in') {
                        $product = StockExchangeReturnInItem::whereStockExchangeId($stockExchange->id)
                            ->whereProductId($item['product_id'])
                            ->first();
                    } else {
                        $product = StockExchangeReturnOutItem::whereStockExchangeId($stockExchange->id)
                            ->whereProductId($item['product_id'])
                            ->first();
                    }

                    $itemInputArray = [
                        'stock_exchange_id' => $stockExchange->id,
                        'product_id' => $product->product_id,
                        'product_cost' => $product->product_cost,
                        'product_price' => $product->product_price
                    ];

                    $product->update($itemInputArray);
                } else {
                    if ($type === 'return_in') {
                        $product = SaleItem::whereSaleId($input['sales_id'])
                            ->whereProductId($item['product_id'])
                            ->first();
                    } else {
                        $product = Product::whereId($item['product_id'])->first();
                    }

                    $itemInputArray = [
                        'stock_exchange_id' => $stockExchange->id,
                        'product_id' => $product->id,
                        'product_cost' => $product->product_cost,
                        'product_price' => $product->product_price
                    ];

                    if ($type === 'return_in') {
                        $returnIn = new StockExchangeReturnInItem($itemInputArray);
                        $stockExchange->returnInItems()->save($returnIn);
                    } else {
                        $returnOut = new StockExchangeReturnOutItem($itemInputArray);
                        $stockExchange->returnOutItems()->save($returnOut);
                    }
                }
            }


            $removeItemIds = array_diff($itemIds, $oldItemIds);

            //delete remove product
            if (!empty($removeItemIds)) {
                foreach ($removeItemIds as $removeItemId) {
                    // remove quantity manage storage
                    if ($type === 'return_in') {
                        $oldProduct = StockExchangeReturnInItem::whereId($removeItemId)->first();
                    } else {
                        $oldProduct = StockExchangeReturnOutItem::whereId($removeItemId)->first();
                    }
                    $productQuantity = ManageStock::whereWarehouseId($input['warehouse_id'])->whereProductId($oldProduct->product_id)->first();
                    if ($productQuantity) {
                        if ($oldProduct && $type === 'return_in') {
                            $productQuantity->update([
                                'quantity' => $productQuantity->quantity - ($oldProduct->quantity ?? 1)
                            ]);
                        } else if ($oldProduct && $type === 'return_out') {
                            $productQuantity->update([
                                'quantity' => $productQuantity->quantity + ($oldProduct->quantity ?? 1)
                            ]);
                        }
                    } else {
                        ManageStock::create([
                            'warehouse_id' => $input['warehouse_id'],
                            'product_id' => $oldProduct->product_id,
                            'quantity' => $oldProduct->quantity,
                        ]);
                    }
                }
                if ($type === 'return_in') {
                    StockExchangeReturnInItem::whereIn('id', array_values($removeItemIds))->delete();
                } else {
                    StockExchangeReturnOutItem::whereIn('id', array_values($removeItemIds))->delete();
                }
            }

            return true;
        } catch (Exception $e) {
            throw new UnprocessableEntityHttpException($e->getMessage());
        }
    }
}
