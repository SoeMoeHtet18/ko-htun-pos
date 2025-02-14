<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('stock_exchanges', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->unsignedBigInteger('warehouse_id');
            $table->foreign('warehouse_id')->references('id')
                ->on('warehouses')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->unsignedBigInteger('sales_id');
            $table->foreign('sales_id')->references('id')
                ->on('sales')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->double('tax_rate')->nullable();
            $table->double('tax_amount')->nullable();
            $table->double('discount')->nullable();
            $table->double('shipping')->nullable();
            $table->double('grand_total')->nullable();
            $table->integer('payment_type')->nullable();
            $table->integer('payment_status')->nullable();
            $table->text('note')->nullable();
            $table->string('reference_code')->nullable();
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')
                ->on('users')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_exchanges');
    }
};
