<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use App\Models\Article;

class FetchNewsArticles extends Command
{
    protected $signature = 'news:fetch';
    protected $description = 'Fetch news articles from APIs and store them locally';

    public function handle()
    {
        $this->info('Fetching news articles...');

        $sources = [
            'newsapi' => env('NEWSAPI_KEY'),
            'guardian' => env('GUARDIAN_KEY'),
            'nyt' => env('NYT_KEY')
        ];

        foreach ($sources as $source => $apiKey) {
            $this->fetchArticlesFromSource($source, $apiKey);
        }

        $this->info('News articles fetched successfully.');
    }

    private function fetchArticlesFromSource($source, $apiKey)
    {
        $url = match ($source) {
            'newsapi' => "https://newsapi.org/v2/top-headlines?country=us&apiKey={$apiKey}",
            'guardian' => "https://content.guardianapis.com/search?api-key={$apiKey}&show-fields=all",
            'nyt' => "https://api.nytimes.com/svc/topstories/v2/home.json?api-key={$apiKey}",
            default => null
        };

        if (!$url) return;

        $response = Http::withOptions(['verify' => false])->get($url);

        if ($response->failed()) {
            $this->error("Failed to fetch articles from {$source}");
            return;
        }

        $articles = match ($source) {
            'newsapi' => $response->json('articles'),
            'guardian' => $response->json('response.results'),
            'nyt' => $response->json('results'),
            default => []
        };

        foreach ($articles as $article) {
            $isNYT = ($source === 'nyt');

            Article::updateOrCreate(
                ['url' => $article['url'] ?? $article['webUrl'] ?? $article['link'] ?? ''],
                [
                    'title' => $article['title']
                        ?? $article['webTitle'] // Guardian
                            ?? $article['headline']['main'] // NYT
                            ?? 'No Title',

                    // Description Handling
                    'description' => $article['description']
                        ?? $article['abstract'] // NYT
                            ?? ($article['fields']['trailText'] ?? '') // Guardian
                            ?? 'No description available',

                    // Content Handling
                    'content' => $article['content']
                        ?? ($article['lead_paragraph'] ?? '') // NYT
                            ?? ($article['fields']['bodyText'] ?? '') // Guardian
                            ?? 'Content not available.',

                    // Author Handling
                    'author' => $article['author']
                        ?? $article['fields']['byline']
                        ?? ($article['byline'] ?? 'Unknown'),

                    'source' => ucfirst($source), // Capitalize source name

                    // Image Handling: NYT first multimedia, Guardian fields.thumbnail, NewsAPI urlToImage
                    'image_url' => $isNYT
                        ? ($article['multimedia'][0]['url'] ?? null) // NYT: first multimedia image
                        : ($article['urlToImage'] // NewsAPI: "urlToImage"
                            ?? ($article['fields']['thumbnail'] ?? null)), // Guardian: "fields.thumbnail"

                    // Category Handling
                    'category' => $article['sectionName'] // Guardian
                            ?? $article['section'] // NYT
                            ?? $article['source']["name"]
                            ?? null,

                    // Published Date Handling
                    'published_at' => isset($article['publishedAt'])
                        ? \Carbon\Carbon::parse($article['publishedAt'])->format('Y-m-d H:i:s')
                        : (isset($article['published_date'])
                            ? \Carbon\Carbon::parse($article['published_date'])->format('Y-m-d H:i:s') // NYT
                            : now()),
                ]
            );
        }

    }
}
