<?php

namespace App\ViewModels;

class SearchResponseViewModel
{
    public array $categories;
    public array $sources;
    public array $authors;

    public function __construct(array $categories, array $sources, array $authors)
    {
        $this->categories = array_values($categories);
        $this->sources = array_values($sources);
        $this->authors = array_values($authors);
    }

    public function toArray(): array
    {
        return [
            'categories' => $this->categories,
            'sources' => $this->sources,
            'authors' => $this->authors,
        ];
    }
}
