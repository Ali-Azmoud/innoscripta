import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { getFeeds } from "../features/feeds/feedSlice";
import { Container, Card, Button } from "react-bootstrap";
import ArticleList from "../components/ArticleList";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import NoResultsMessage from "../components/NoResultsMessage";
import LoadingMessage from "../components/LoadingMessage";

const Feeds: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { feeds, loading, error } = useSelector((state: RootState) => state.feeds);
    const [page, setPage] = useState(1);
    const [allArticles, setAllArticles] = useState<any[]>([]);
    const [loadingMore, setLoadingMore] = useState(false);
    const hasFetched = useRef(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!hasFetched.current) {
            hasFetched.current = true;
            dispatch(getFeeds(page));
        }
    }, [dispatch]);

    useEffect(() => {
        if (page > 1) {
            setLoadingMore(true);
            dispatch(getFeeds(page));
        }
    }, [dispatch, page]);

    useEffect(() => {
        if (feeds?.data) {
            setAllArticles((prev) => [...prev, ...feeds.data]);
            setLoadingMore(false);
        }
    }, [feeds]);

    const observer = useRef<IntersectionObserver | null>(null);
    const lastArticleRef = useCallback(
        (node: HTMLElement | null) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && feeds?.next_page_url) {
                    setPage((prevPage) => prevPage + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, feeds?.next_page_url]
    );

    return (
        <Container className="mt-4">
            <PageHeader
                title="User Feed"
                subtitle="Stay updated with a personalized news feed based on your preferences."
            />

            <Card className="text-center shadow-lg mb-4 mt-2 p-4 bg-light border-0">
                <Card.Body>
                    <h4>Customize Your Feed</h4>
                    <p className="text-muted">
                        Take control of your news experience! By selecting your preferred topics, sources,
                        and authors, you can tailor your news feed to match your interests.
                        Visit the <strong>Preferences</strong> page to personalize your feed.
                    </p>
                    <Button variant="outline-dark" size="lg" onClick={() => navigate("/preferences")}>
                        Go to Preferences
                    </Button>
                </Card.Body>
            </Card>

            {loading && page === 1 ?
                <LoadingMessage message="Fetching your personalized news feed..." />
                : allArticles.length > 0 ? (
                <>
                    <ArticleList
                        articles={allArticles}
                        loading={loading}
                        error={error}
                        currentPage={feeds?.current_page || 1}
                        totalPages={feeds?.last_page || 1}
                        onPageChange={() => {}}
                        boxSize="col-12 fixed-height"
                        lastArticleRef={lastArticleRef}
                    />

                    {loadingMore && <LoadingMessage message="Loading more articles..." />}
                </>
            ) : (
                <NoResultsMessage message="Your feed is empty. Try updating your preferences to see more news!" />
            )}

        </Container>
    );
};

export default Feeds;
