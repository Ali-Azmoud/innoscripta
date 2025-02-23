<?php

namespace App\Repositories\Interfaces;

use App\ViewModels\SearchResponseViewModel;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface ArticleRepositoryInterface
{
    public function searchArticles(Request $request): LengthAwarePaginator;
    public function searchArticlesByPreferences(Collection $preferences);
    public function getDistinctFilters(): SearchResponseViewModel;
}
