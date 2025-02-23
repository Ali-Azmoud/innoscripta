<?php

namespace App\Services;

use App\ViewModels\SearchResponseViewModel;
use App\Repositories\Interfaces\ArticleRepositoryInterface;
use App\Services\Interfaces\ArticleServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class ArticleService implements ArticleServiceInterface
{
    protected $articleRepository;

    public function __construct(ArticleRepositoryInterface $articleRepository)
    {
        $this->articleRepository = $articleRepository;
    }

    public function getLatestArticles(): LengthAwarePaginator
    {
        return $this->articleRepository->getLatestArticles();
    }

    public function searchArticles(Request $request): LengthAwarePaginator
    {
        return $this->articleRepository->searchArticles($request);
    }

    public function getDistinctFilters(): SearchResponseViewModel
    {
        return $this->articleRepository->getDistinctFilters();
    }
}
