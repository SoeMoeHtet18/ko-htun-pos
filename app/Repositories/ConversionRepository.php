<?php

namespace App\Repositories;

use App\Models\Conversion;
use App\Models\ConversionItem;
use App\Models\ManageStock;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

/**
 * Class SaleRepository
 */
class ConversionRepository extends BaseRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'reference_code',
        'date',
        'warehouse_id',
        'total_stock_in_products',
        'total_stock_out_products',
        'remark',
        'created_at'
    ];

    /**
     * @var string[]
     */
    protected $allowedFields = [
        'date',
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
        return Conversion::class;
    }

    public function storeConversion($input): Conversion
    {
        try {
            DB::beginTransaction();

            $input['total_stock_in_products'] = count($input['stock_in_items']);
            $input['total_stock_out_products'] = count($input['stock_out_items']);
            $input['date'] = $input['date'] ?? date('Y/m/d');

            $conversionInputArray = Arr::only($input, [
                'date', 'warehouse_id', 'total_stock_in_products', 'total_stock_out_products', 'remark'
            ]);
            $conversion = Conversion::create($conversionInputArray);
            $reference_code = 'CV_111' . $conversion->id;
            $conversion->update(['reference_code' => $reference_code]);

            $conversion = $this->storeConversionItems($conversion, $input);

            DB::commit();

            return $conversion;
        } catch (Exception $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }
    }

    public function storeConversionItems($conversion, $input)
    {
        foreach ($input['stock_in_items'] as $item) {
            $item['conversion_id'] = $conversion->id;
            $item['type'] = 'stock_in';
            ConversionItem::create($item);

            $product = ManageStock::whereWarehouseId($conversion->warehouse_id)->whereProductId($item['product_id'])->first();
            if ($product) {
                $totalQuantity = $product->quantity - $item['quantity'];
                if ($totalQuantity < 0) {
                    throw new UnprocessableEntityHttpException('Quantity exceeds quantity available in stock.');
                }
                $product->update([
                    'quantity' => $totalQuantity
                ]);
            }
        }

        foreach ($input['stock_out_items'] as $item) {
            $item['conversion_id'] = $conversion->id;
            $item['type'] = 'stock_out';
            ConversionItem::create($item);

            $product = ManageStock::whereWarehouseId($conversion->warehouse_id)->whereProductId($item['product_id'])->first();
            if ($product) {
                $totalQuantity = $product->quantity + $item['quantity'];
                $product->update([
                    'quantity' => $totalQuantity,
                ]);
            } else {
                ManageStock::create([
                    'warehouse_id' => $conversion->warehouse_id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                ]);
            }
        }

        return $conversion;
    }

    public function updateConversion($input, $id)
    {
        try {
            DB::beginTransaction();

            $conversion = Conversion::findOrFail($id);

            $input['total_stock_in_products'] = count($input['stock_in_items']);
            $input['total_stock_out_products'] = count($input['stock_out_items']);
            $input['date'] = $input['date'] ?? date('Y/m/d');

            $conversionInputArray = Arr::only($input, [
                'date', 'warehouse_id', 'total_stock_in_products', 'total_stock_out_products', 'remark'
            ]);
            $conversion->update($conversionInputArray);

            $conversion = $this->updateConversionItems($conversion, $input);

            DB::commit();

            return $conversion;
        } catch (Exception $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }
    }

    public function updateConversionItems($conversion, $input)
    {
        $conversionOldStockInItemIds = ConversionItem::whereConversionId($conversion->id)
            ->whereType('stock_in')
            ->pluck('id')->toArray();
        $this->updateItemsBasedOnType($input['stock_in_items'], $conversionOldStockInItemIds, 'stock_in', $conversion);

        $conversionOldStockOutItemIds = ConversionItem::whereConversionId($conversion->id)
            ->whereType('stock_out')
            ->pluck('id')->toArray();
        $this->updateItemsBasedOnType($input['stock_out_items'], $conversionOldStockOutItemIds, 'stock_out', $conversion);

        return $conversion;
    }

    public function updateItemsBasedOnType($inputItems, $items, $type, $conversion)
    {
        $conversionItemIds = [];

        foreach ($inputItems as $key => $item) {
            if (isset($item['conversion_item_id'])) {
                $conversionItemIds[$key] = $item['conversion_item_id'];
            }

            $product = ManageStock::whereWarehouseId($conversion->warehouse_id)
                ->whereProductId($item['product_id'])->first();

            if (!isset($item['conversion_item_id']) || is_null($item['conversion_item_id'])) {
                $item['conversion_id'] = $conversion->id;
                $item['type'] = $type;

                ConversionItem::create($item);

                if ($product) {
                    if ($type === 'stock_in') {
                        $totalQuantity = $product->quantity - $item['quantity'];
                        if ($totalQuantity < 0) {
                            throw new UnprocessableEntityHttpException('Quantity exceeds quantity available in stock.');
                        }
                    } else {
                        $totalQuantity = $product->quantity + $item['quantity'];
                    }
                    $product->update([
                        'quantity' => $totalQuantity
                    ]);
                }
            } else {
                $existedItem = ConversionItem::whereId($item['conversion_item_id'])->firstOrFail();

                if ($type === 'stock_in') {
                    $existedQuantity = $product->quantity + $existedItem->quantity;
                    $totalQuantity = $existedQuantity - $item['quantity'];
                    if ($totalQuantity < 0) {
                        throw new UnprocessableEntityHttpException('Quantity exceeds quantity available in stock.');
                    }
                } else {
                    $existedQuantity = $product->quantity - $existedItem->quantity;
                    $totalQuantity = $existedQuantity + $item['quantity'];
                }
                $product->update([
                    'quantity' => $totalQuantity,
                ]);

                $existedItem->update([
                    'quantity' => $item['quantity'],
                ]);
            }
        }

        $removeItemIds = array_diff($items, $conversionItemIds);

        if (!empty(array_values($removeItemIds))) {
            foreach ($removeItemIds as $removeItemId) {
                $oldItem = ConversionItem::whereId($removeItemId)->firstOrFail();
                $existProductStock = ManageStock::whereWarehouseId($conversion->warehouse_id)
                    ->whereProductId($oldItem->product_id)->first();

                if ($type === 'stock_in') {
                    $totalQuantity = $existProductStock->quantity + $oldItem['quantity'];
                } else {
                    $totalQuantity = $existProductStock->quantity - $oldItem['quantity'];
                }

                $existProductStock->update([
                    'quantity' => $totalQuantity,
                ]);
            }
            ConversionItem::whereIn('id', array_values($removeItemIds))->delete();
        }
    }
}
