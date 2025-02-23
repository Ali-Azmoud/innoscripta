import React from "react";
import { Row, Col, Button, Alert } from "react-bootstrap";
import ArticleCard from "./ArticleCard";
import { v4 as uuidv4 } from "uuid";

interface ArticleListProps {
    articles: any[];
    loading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    boxSize?: string;
    lastArticleRef?: (node: HTMLElement | null) => void;
}

const ArticleList: React.FC<ArticleListProps> = ({
                                                     articles,
                                                     error,
                                                     currentPage,
                                                     totalPages,
                                                     onPageChange,
                                                     boxSize = "col-md-6 col-lg-4",
                                                     lastArticleRef
                                                 }) => {
    return (
        <>
            {error && <Alert variant="danger">{error}</Alert>}

            <Row className="mt-4">
                {articles.length > 0 &&
                    articles.map((article, index) => {
                        const uniqueId = `${article.id ? article.id : `article-${index}`}-${uuidv4()}`;

                        return (
                            <Col
                                key={uniqueId}
                                className={`${boxSize} mb-3`}
                                ref={index === articles.length - 1 ? lastArticleRef : null}
                            >
                                <ArticleCard article={article} />
                            </Col>
                        );
                    })}
            </Row>

            {!lastArticleRef && totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                    <Button
                        variant="secondary"
                        disabled={currentPage <= 1}
                        onClick={() => onPageChange(currentPage - 1)}
                        className="me-2"
                    >
                        Previous
                    </Button>
                    <span className="align-self-center">
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button
                        variant="secondary"
                        disabled={currentPage >= totalPages}
                        onClick={() => onPageChange(currentPage + 1)}
                        className="ms-2"
                    >
                        Next
                    </Button>
                </div>
            )}
        </>
    );
};

export default ArticleList;
