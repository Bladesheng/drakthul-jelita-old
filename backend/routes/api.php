<?php

use App\Http\Controllers\ScreenshotController;
use App\Http\Middleware\LoginAuth;
use Illuminate\Support\Facades\Route;

Route::get('screenshots', [ScreenshotController::class, 'index']);
Route::post('screenshots/search', [ScreenshotController::class, 'search']);

Route::middleware([LoginAuth::class])->group(function () {
    Route::post('screenshots', [ScreenshotController::class, 'store']);
    Route::patch('screenshots/{id}', [ScreenshotController::class, 'update']);
    Route::delete('screenshots/{id}', [ScreenshotController::class, 'destroy']);
});
