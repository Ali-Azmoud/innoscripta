export interface Article {
    id: number;
    title: string;
    description: string;
    content: string;
    author: string;
    source: string;
    url: string;
    image_url: string;
    published_at: string;
    category: string;
    created_at: string;
    updated_at: string;
}

export interface PaginatedArticles {
    current_page: number;
    data: Article[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: { url: string | null; label: string; active: boolean }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}