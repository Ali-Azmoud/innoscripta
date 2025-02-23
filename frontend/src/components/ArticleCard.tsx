import React from "react";
import { Card, Button, Badge, Row, Col } from "react-bootstrap";
import { Article } from "../models/Article";

interface ArticleCardProps {
    article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
    return (
        <Card className="shadow-sm rounded overflow-hidden mb-3" style={{ maxHeight: "350px" }}>
            <Row className="g-0">
                <Col md={4} className="d-flex align-items-stretch">
                    <div className="w-100">
                        <Card.Img
                            src={article.image_url}
                            alt={article.title}
                            className="img-fluid rounded-start w-100 h-100 object-fit-cover"
                        />
                    </div>
                </Col>

                <Col md={8}>
                    <Card.Body className="d-flex flex-column justify-content-between h-100">
                        <div>
                            <Badge bg="secondary" className="mb-2">{article.category}</Badge>
                            <Card.Title className="text-primary">{article.title}</Card.Title>
                            <Card.Text className="text-muted" style={{ fontSize: "0.9rem" }}>
                                {article.description.length > 150 ? article.description.substring(0, 150) + "..." : article.description}
                            </Card.Text>
                        </div>

                        <div>
                            <small className="text-muted d-block">
                                <strong>By:</strong> {article.author || "Unknown"} | <strong>Source:</strong> {article.source}
                            </small>
                            <small className="text-muted">
                                <strong>Published on:</strong> {new Date(article.published_at).toLocaleDateString()}
                            </small>
                            <div className="mt-2">
                                <Button variant="primary" href={article.url} target="_blank" size="sm">
                                    Read More
                                </Button>
                            </div>
                        </div>
                    </Card.Body>
                </Col>
            </Row>
        </Card>
    );
};

export default ArticleCard;
