import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchArticles } from "../features/articles/articleSlice";
import { RootState, AppDispatch } from "../store";
import { PaginatedArticles } from "../models/Article";
import FilterList from "../components/FilterList";
import ArticleList from "../components/ArticleList";
import {Container, Button, Form, Row, Col, Spinner} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PageHeader from "../components/PageHeader";
import NoResultsMessage from "../components/NoResultsMessage";

const Search: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    const paginatedArticles: PaginatedArticles | null = useSelector((state: RootState) => state.articles.articles);
    const loading = useSelector((state: RootState) => state.articles.loading);
    const error = useSelector((state: RootState) => state.articles.error);

    const [keyword, setKeyword] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedSources, setSelectedSources] = useState<string[]>([]);
    const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [startDate, endDate] = dateRange;

    const isArticlesFetched = useRef(false);

    useEffect(() => {
        if (!isArticlesFetched.current) {
            isArticlesFetched.current = true;
            dispatch(fetchArticles({ category: [], source: [], author: [], page: 1 }));
        }
    }, [dispatch]);

    const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setKeyword(e.target.value);
    };

    const handleFilterChange = (categories: string[], sources: string[], authors: string[]) => {
        setSelectedCategories(categories);
        setSelectedSources(sources);
        setSelectedAuthors(authors);
    };

    const handleApplyFilters = (page = 1) => {
        dispatch(fetchArticles({
            keyword,
            date: startDate && endDate
                ? `${startDate.toISOString().split("T")[0]} to ${endDate.toISOString().split("T")[0]}`
                : null,
            category: selectedCategories,
            source: selectedSources,
            author: selectedAuthors,
            page,
        }));
    };

    return (
        <Container className="my-4">
            <PageHeader
                title="Search News"
                subtitle="Find articles and news by keyword, date, category, source, and author."
            />

            <Row className="align-items-start g-3">
                <Col xs={12} md={4} lg={3}>
                    <FilterList
                        showLabels={false}
                        onSelectionChange={handleFilterChange}
                        preloadedCategories={[]}
                        preloadedAuthors={[]}
                        preloadedSources={[]}
                    />
                </Col>

                <Col xs={12} md={8} lg={9}>
                    <Form className="mb-4">
                        <Row className="g-2 align-items-center">
                            <Col xs={12} md={5}>
                                <Form.Group controlId="keyword">
                                    <Form.Control
                                        type="text"
                                        placeholder="Type to search..."
                                        value={keyword}
                                        onChange={handleKeywordChange}
                                    />
                                </Form.Group>
                            </Col>

                            <Col xs={12} md={5}>
                                <Form.Group controlId="date-range">
                                    <DatePicker
                                        selected={startDate}
                                        onChange={(update) => setDateRange(update)}
                                        startDate={startDate}
                                        endDate={endDate}
                                        selectsRange
                                        className="form-control"
                                        placeholderText="Select date range"
                                    />
                                </Form.Group>
                            </Col>

                            <Col xs={12} md={2} className="text-center">
                                <Button variant="primary" onClick={() => handleApplyFilters(1)} className="w-100">
                                    GO
                                </Button>
                            </Col>
                        </Row>
                    </Form>

                    {loading ? (
                        <div className="text-center my-4">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading news...</span>
                            </Spinner>
                            <p className="mt-2">Fetching news...</p>
                        </div>
                    ) : paginatedArticles?.data && paginatedArticles.data.length > 0 ? (
                        <ArticleList
                            articles={paginatedArticles?.data || []}
                            loading={loading}
                            error={error}
                            currentPage={paginatedArticles?.current_page || 1}
                            totalPages={paginatedArticles?.last_page || 1}
                            onPageChange={handleApplyFilters}
                            boxSize="col-12"
                        />
                    ) : (
                        <NoResultsMessage message="No news found. Try adjusting your search or filters." />
                    )}

                </Col>
            </Row>
        </Container>
    );
};

export default Search;
