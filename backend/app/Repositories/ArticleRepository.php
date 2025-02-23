<?php

namespace App\Repositories;

use App\Models\Article;
use App\ViewModels\SearchResponseViewModel;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Repositories\Interfaces\ArticleRepositoryInterface;
use Illuminate\Support\Collection;

class ArticleRepository implements ArticleRepositoryInterface
{

    public function getLatestArticles(): LengthAwarePaginator
    {
        return Article::latest()->paginate(10);
    }

    public function searchArticles(Request $request): LengthAwarePaginator
    {
        $query = Article::query();
        if ($request->filled('keyword')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->keyword . '%')
                    ->orWhere('description', 'like', '%' . $request->keyword . '%')
                    ->orWhere('content', 'like', '%' . $request->keyword . '%');
            });
        }
        if ($request->filled('date')) {
            $dates = explode(' to ', $request->date); // Split into start & end dates
            $dateFrom = \Carbon\Carbon::parse($dates[0])->startOfDay();
            $dateTo = \Carbon\Carbon::parse($dates[1])->endOfDay();

            $query->whereBetween('published_at', [$dateFrom, $dateTo]);
        }

        if ($request->filled('category') && count($request->category) > 0) {
            $query->whereIn('category', $request->category);
        }

        if ($request->filled('source') && count($request->source) > 0) {
            $query->whereIn('source', $request->source);
        }

        if ($request->filled('author') && count($request->author) > 0) {
            $query->whereIn('author', $request->author);
        }

        return $query->latest()->paginate(10);
    }

    public function searchArticlesByPreferences(Collection $preferences): \Illuminate\Contracts\Pagination\LengthAwarePaginator
    {
        $query = Article::query();

        if (!empty($preferences['source'])) {
            $query->whereIn('source', $preferences['source']);
        }

        if (!empty($preferences['category'])) {
            $query->whereIn('category', $preferences['category']);
        }

        if (!empty($preferences['author'])) {
            $query->whereIn('author', $preferences['author']);
        }

        return $query->latest()->paginate(10);
    }

    public function getDistinctFilters(): SearchResponseViewModel
    {
        $categories = Article::distinct()->pluck('category')->filter()->unique()->toArray();
        $authors = Article::distinct()->pluck('author')->filter()->unique()->toArray();
        $sources = Article::distinct()->pluck('source')->filter()->unique()->toArray();

        return new SearchResponseViewModel($categories, $sources, $authors);
    }

}
