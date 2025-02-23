<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SearchArticlesRequest;
use App\Services\Interfaces\ArticleServiceInterface;
use Illuminate\Http\JsonResponse;

class ArticleController extends Controller
{
    protected $articleService;

    public function __construct(ArticleServiceInterface $articleService)
    {
        $this->articleService = $articleService;
    }

    public function index()
    {
        $articles = $this->articleService->getLatestArticles();
        return response()->json($articles);
    }

    public function search(SearchArticlesRequest $request)
    {
        $articles = $this->articleService->searchArticles($request);
        return response()->json($articles);
    }

    public function filters(): JsonResponse
    {
        $response = $this->articleService->getDistinctFilters();
        return response()->json($response->toArray());
    }
}
