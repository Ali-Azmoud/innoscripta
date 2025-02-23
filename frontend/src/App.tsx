import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "./store";
import { logout } from "./features/auth/authSlice";
import AppRoutes from "./routes/AppRoutes";
import { useNavigate, useLocation } from "react-router-dom";
import { Navbar, Container, Button, Nav, Modal, Spinner } from "react-bootstrap";

const App: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useSelector((state: RootState) => state.auth);

    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const hideNavbar = location.pathname === "/login" || location.pathname === "/register";

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await dispatch(logout()).unwrap();
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setLoggingOut(false);
            setShowLogoutModal(false);
        }
    };

    return (
        <div>
            {!hideNavbar && (
                <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
                    <Container>
                        <Navbar.Brand onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
                            News App
                        </Navbar.Brand>

                        <Navbar.Toggle aria-controls="navbar-nav" />
                        <Navbar.Collapse id="navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link onClick={() => navigate("/search")}>Search</Nav.Link>
                                {user && <Nav.Link onClick={() => navigate("/preferences")}>Preferences</Nav.Link>}
                            </Nav>

                            {user ? (
                                <Button variant="danger" className="ms-3" onClick={() => setShowLogoutModal(true)}>
                                    Logout
                                </Button>
                            ) : (
                                <Button variant="light" className="ms-3" onClick={() => navigate("/login")}>
                                    Login
                                </Button>
                            )}
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            )}

            <AppRoutes />

            <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Logout</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to logout?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleLogout} disabled={loggingOut}>
                        {loggingOut ? <Spinner as="span" animation="border" size="sm" /> : "Yes, Logout"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default App;
