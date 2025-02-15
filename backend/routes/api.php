<?php

use App\Http\Controllers\ScreenshotController;
use Illuminate\Support\Facades\Route;

Route::resource('screenshots', ScreenshotController::class);
//    ->middleware('auth:sanctum');
