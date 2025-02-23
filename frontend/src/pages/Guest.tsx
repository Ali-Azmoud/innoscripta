import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchArticles } from "../features/articles/articleSlice";
import { RootState, AppDispatch } from "../store";
import { PaginatedArticles } from "../models/Article";
import ArticleList from "../components/ArticleList";
import { Container, Alert, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import LoadingMessage from "../components/LoadingMessage";

const Guest: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const paginatedArticles: PaginatedArticles | null = useSelector((state: RootState) => state.articles.articles);
    const loading = useSelector((state: RootState) => state.articles.loading);
    const error = useSelector((state: RootState) => state.articles.error);

    const [allArticles, setAllArticles] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);

    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        setLoadingMore(true);
        dispatch(fetchArticles({ page }))
            .unwrap()
            .then((data) => {
                if (data?.data) {
                    setAllArticles((prev) => [...prev, ...data.data]);
                }
            })
            .finally(() => setLoadingMore(false));
    }, [page]);

    const observer = useRef<IntersectionObserver | null>(null);
    const lastArticleRef = useCallback(
        (node: HTMLElement | null) => {
            if (loadingMore) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && paginatedArticles?.next_page_url) {
                    setLoadingMore(true);
                    setPage((prevPage) => prevPage + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [loadingMore, paginatedArticles?.next_page_url]
    );

    return (
        <Container className="mt-4">
            <h2 className="text-center">Latest Articles</h2>

            <Card className="text-center shadow-lg my-4 p-4">
                <Card.Body>
                    <h3>Unlock Your Personalized News Feed</h3>
                    <p className="text-muted">
                        Stay up to date with the latest news tailored to your interests!
                        By logging in, you can customize your news feed by selecting your
                        favorite topics, sources, and authors in the <strong>Preferences</strong> page.
                        Create a truly unique reading experience with content that matters to you!
                    </p>
                    <Button variant="outline-dark" size="lg" onClick={() => navigate("/login")}>
                        Login to Personalize
                    </Button>
                </Card.Body>
            </Card>

            {error && (
                <Alert variant="danger" className="text-center">
                    Failed to load articles. Please try again later.
                </Alert>
            )}

            <ArticleList
                articles={allArticles}
                loading={loading}
                error={error}
                currentPage={paginatedArticles?.current_page || 1}
                totalPages={paginatedArticles?.last_page || 1}
                onPageChange={() => {}}
                boxSize="col-12"
                lastArticleRef={lastArticleRef}
            />

            {loadingMore && <LoadingMessage message="Loading articles..." />}
        </Container>
    );
};

export default Guest;
