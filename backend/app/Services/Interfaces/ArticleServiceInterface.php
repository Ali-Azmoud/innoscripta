<?php

namespace App\Services\Interfaces;

use App\ViewModels\SearchResponseViewModel;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

interface ArticleServiceInterface
{
    public function getLatestArticles(): LengthAwarePaginator;
    public function searchArticles(Request $request): LengthAwarePaginator;
    public function getDistinctFilters(): SearchResponseViewModel;
}
