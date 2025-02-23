<?php

use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserPreferenceController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
Route::middleware('auth:sanctum')->get('/user', [AuthController::class, 'user']);

Route::get('/articles', [ArticleController::class, 'index']);
Route::post('/articles/search', [ArticleController::class, 'search']);
Route::get('/articles/filters', [ArticleController::class, 'filters']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/user/preferences', [UserPreferenceController::class, 'updatePreferences']);
    Route::get('/user/preferences', [UserPreferenceController::class, 'getPreferences']);
    Route::get('/user/feed', [UserPreferenceController::class, 'getPersonalizedFeed']);
});
