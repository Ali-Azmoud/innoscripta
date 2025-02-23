import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { fetchFilters } from "../features/filters/filterSlice";
import {
    getUserPreferences,
    updateUserPreferences
} from "../features/preferences/userPreferencesSlice";
import { Container, Button, Row, Col, Alert, Modal, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import FilterList from "../components/FilterList";
import PageHeader from "../components/PageHeader";
import LoadingMessage from "../components/LoadingMessage";

const Preferences: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { user } = useSelector((state: RootState) => state.auth);
    const { error: filtersError } = useSelector((state: RootState) => state.filters);
    const { selectedCategories, selectedSources, selectedAuthors, error: preferencesError } = useSelector((state: RootState) => state.preferences);

    const [localCategories, setLocalCategories] = useState<string[]>([]);
    const [localSources, setLocalSources] = useState<string[]>([]);
    const [localAuthors, setLocalAuthors] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [modalShow, setModalShow] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalVariant, setModalVariant] = useState<"success" | "danger">("success");

    const isPreferencesFetched = useRef(false);

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    useEffect(() => {
        if (user && !isPreferencesFetched.current) {
            isPreferencesFetched.current = true;
            setIsLoading(true);
            Promise.all([dispatch(fetchFilters()), dispatch(getUserPreferences())])
                .then(() => setIsLoading(false))
                .catch(() => setIsLoading(false));
        }
    }, [dispatch, user]);

    useEffect(() => {
        if (!isLoading) {
            setLocalCategories(selectedCategories);
            setLocalSources(selectedSources);
            setLocalAuthors(selectedAuthors);
        }
    }, [selectedCategories, selectedSources, selectedAuthors, isLoading]);

    const handleFilterChange = (categories: string[], sources: string[], authors: string[]) => {
        setLocalCategories(categories);
        setLocalSources(sources);
        setLocalAuthors(authors);
    };

    const handleSavePreferences = async () => {
        setIsSaving(true);
        try {
            await dispatch(updateUserPreferences({
                category: localCategories,
                source: localSources,
                author: localAuthors
            })).unwrap();
            setModalMessage("Preferences saved successfully!");
            setModalVariant("success");
        } catch (error) {
            setModalMessage("Failed to save preferences. Please try again.");
            setModalVariant("danger");
        }
        setModalShow(true);
        setIsSaving(false);
    };

    return (
        <Container className="position-relative" style={{ paddingBottom: "80px" }}>
            <PageHeader
                title="Preferences"
                subtitle="Customize your news feed by selecting your favorite topics, sources, and authors."
            />

            {filtersError && <Alert variant="danger">{filtersError}</Alert>}
            {preferencesError && <Alert variant="danger">{preferencesError}</Alert>}

            {isLoading ? <LoadingMessage message="Loading preferences..." /> : (
                <>
                    <Row>
                        <Col xs={12}>
                            <FilterList
                                onSelectionChange={handleFilterChange}
                                layoutMode="row"
                                showLabels={true}
                                preloadedCategories={selectedCategories}
                                preloadedSources={selectedSources}
                                preloadedAuthors={selectedAuthors}
                            />
                        </Col>
                    </Row>

                    {!isLoading && (
                        <div
                            className="fixed-bottom bg-light p-3 shadow"
                            style={{ textAlign: "center", borderTop: "1px solid #ddd" }}
                        >
                            <Container>
                                <Button variant="outline-dark" size="lg" onClick={handleSavePreferences} disabled={isSaving}>
                                    {isSaving ? (
                                        <>
                                            <Spinner animation="border" size="sm" className="me-2" />
                                            Saving...
                                        </>
                                    ) : (
                                        "Save Preferences"
                                    )}
                                </Button>
                            </Container>
                        </div>
                    )}
                </>
            )}

            <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
                <Modal.Body className={`text-${modalVariant} text-center`}>
                    <h5>{modalMessage}</h5>
                </Modal.Body>
                <Modal.Footer className="justify-content-center">
                    <Button variant="dark" onClick={() => setModalShow(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Preferences;
