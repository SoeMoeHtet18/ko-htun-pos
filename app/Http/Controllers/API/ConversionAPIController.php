<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\AppBaseController;
use App\Http\Resources\ConversionCollection;
use App\Http\Resources\ConversionResource;
use App\Models\Conversion;
use App\Models\ConversionItem;
use App\Models\ManageStock;
use Illuminate\Http\Request;
use App\Repositories\ConversionRepository;
use Illuminate\Support\Facades\DB;

class ConversionAPIController extends AppBaseController
{
    /** @var ConversionRepository */
    private $conversionRepository;

    public function __construct(ConversionRepository $conversionRepository)
    {
        $this->conversionRepository = $conversionRepository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): ConversionCollection
    {
        $perPage = getPageSize($request);

        $conversions = $this->conversionRepository;

        if ($request->get('warehouse_id')) {
            $conversions->where('warehouse_id', $request->get('warehouse_id'));
        }

        $conversions = $conversions->paginate($perPage);

        ConversionResource::usingWithCollection();

        return new ConversionCollection($conversions);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $input = $request->all();
        $conversion = $this->conversionRepository->storeConversion($input);

        return new ConversionResource($conversion);
    }

    /**
     * Display the specified resource.
     */
    public function show(Conversion $conversion): ConversionResource
    {
        $conversion = $conversion->load('conversionItems.product');

        return new ConversionResource($conversion);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Conversion $conversion): ConversionResource
    {
        $conversion = $conversion->load('conversionItems.product', 'warehouse');

        return new ConversionResource($conversion);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Conversion $conversion)
    {
        $input = $request->all();
        $conversion = $this->conversionRepository->updateConversion($input, $conversion->id);

        return new ConversionResource($conversion);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Conversion $conversion)
    {
        try {
            DB::beginTransaction();

            $conversion = $this->conversionRepository->with('conversionItems')->where('id', $conversion->id)->firstOrFail();

            foreach ($conversion->conversionItems as $conversionItem) {
                $oldItem = ConversionItem::whereId($conversionItem->id)->firstOrFail();
                $existProductStock = ManageStock::whereWarehouseId($conversion->warehouse_id)
                    ->whereProductId($oldItem->product_id)->first();

                if ($oldItem->type === 'stock_out') {
                    $totalQuantity = $existProductStock->quantity - $oldItem['quantity'];
                } else {
                    $totalQuantity = $existProductStock->quantity + $oldItem['quantity'];
                }

                $existProductStock->update([
                    'quantity' => $totalQuantity,
                ]);
            }

            $this->conversionRepository->delete($conversion->id);

            DB::commit();

            return $this->sendSuccess('Conversion deleted successfully');
        } catch (Exception $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }
    }
}
