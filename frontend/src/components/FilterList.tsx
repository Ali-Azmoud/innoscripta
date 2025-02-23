import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFilters } from "../features/filters/filterSlice";
import { RootState, AppDispatch } from "../store";
import { Container, Alert, ListGroup, Button, Row, Col } from "react-bootstrap";
import LoadingMessage from "./LoadingMessage";

interface FilterListProps {
    onSelectionChange: (selectedCategories: string[], selectedSources: string[], selectedAuthors: string[]) => void;
    layoutMode?: "column" | "row";
    preloadedCategories?: string[];
    preloadedSources?: string[];
    preloadedAuthors?: string[];
    showLabels?: boolean;
}

const FilterList: React.FC<FilterListProps> = ({
                                                   onSelectionChange,
                                                   layoutMode = "column",
                                                   preloadedCategories = [],
                                                   preloadedSources = [],
                                                   preloadedAuthors = [],
                                                   showLabels = true,
                                               }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { categories, sources, authors, loading, error } = useSelector((state: RootState) => state.filters);

    const [selectedFilters, setSelectedFilters] = useState({
        categories: preloadedCategories,
        sources: preloadedSources,
        authors: preloadedAuthors,
    });

    const [expanded, setExpanded] = useState({
        categories: false,
        sources: false,
        authors: false,
    });

    const isFiltersFetched = useRef(false);

    useEffect(() => {
        if (!isFiltersFetched.current) {
            isFiltersFetched.current = true;
            dispatch(fetchFilters());
        }
    }, [dispatch]);

    useEffect(() => {
        setSelectedFilters((prev) => ({
            categories: preloadedCategories?.length > 0 ? Array.from(new Set([...preloadedCategories])) : prev.categories,
            sources: preloadedSources?.length > 0 ? Array.from(new Set([...preloadedSources])) : prev.sources,
            authors: preloadedAuthors?.length > 0 ? Array.from(new Set([...preloadedAuthors])) : prev.authors,
        }));
    }, [preloadedCategories, preloadedSources, preloadedAuthors]);

    useEffect(() => {
        onSelectionChange(selectedFilters.categories, selectedFilters.sources, selectedFilters.authors);
    }, [selectedFilters, onSelectionChange]);

    const handleSelect = (type: "categories" | "sources" | "authors", value: string) => {
        setSelectedFilters((prev) => ({
            ...prev,
            [type]: prev[type].includes(value)
                ? prev[type].filter((item) => item !== value)
                : [...prev[type], value],
        }));
    };

    const toggleExpand = (type: "categories" | "sources" | "authors") => {
        setExpanded((prev) => ({ ...prev, [type]: !prev[type] }));
    };

    const renderFilterList = (type: "categories" | "sources" | "authors", data: string[]) => (
        <>
            {showLabels && <h4 className="mb-3">{type.charAt(0).toUpperCase() + type.slice(1)}</h4>}
            <ListGroup>
                {data.length > 0 ? (
                    (expanded[type] ? data : data.slice(0, 10)).map((item) => {
                        const isSelected = selectedFilters[type].includes(item);
                        return (
                            <ListGroup.Item
                                key={item}
                                action
                                onClick={() => handleSelect(type, item)}
                                style={{
                                    backgroundColor: isSelected ? "#e0e0e0" : "transparent",
                                    borderColor: isSelected ? "#999" : "#bbb",
                                    cursor: "pointer",
                                }}
                                className="d-flex align-items-center"
                            >
                                {isSelected ? "✔️" : "⬜"} {item}
                            </ListGroup.Item>
                        );
                    })
                ) : (
                    <ListGroup.Item>No {type} available</ListGroup.Item>
                )}
            </ListGroup>
            {data.length > 10 && (
                <div className="text-center mt-2">
                    <Button variant="link" onClick={() => toggleExpand(type)}>
                        {expanded[type] ? "View Less" : "View More"}
                    </Button>
                </div>
            )}
        </>
    );

    return (
        <Container>
            {loading && <LoadingMessage message="Loading filters..." />}

            {error && <Alert variant="danger">{error}</Alert>}

            {!loading && !error && (
                layoutMode === "column" ? (
                    <>
                        {renderFilterList("categories", categories)}
                        <div className="mb-4" />
                        {renderFilterList("sources", sources)}
                        <div className="mb-4" />
                        {renderFilterList("authors", authors)}
                    </>
                ) : (
                    <Row className="g-3">
                        <Col md={4} style={{ overflowY: "auto", height: "100%" }}>
                            {renderFilterList("categories", categories)}
                        </Col>
                        <Col md={4} style={{ overflowY: "auto", height: "100%" }}>
                            {renderFilterList("sources", sources)}
                        </Col>
                        <Col md={4} style={{ overflowY: "auto", height: "100%" }}>
                            {renderFilterList("authors", authors)}
                        </Col>
                    </Row>
                )
            )}
        </Container>
    );
};

export default FilterList;
