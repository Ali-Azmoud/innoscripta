import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../features/auth/authSlice";
import { RootState, AppDispatch } from "../store";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Alert, Card, Spinner } from "react-bootstrap";

const Register: React.FC = () => {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        document.body.classList.add("no-navbar");
        return () => {
            document.body.classList.remove("no-navbar");
        };
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const res = await dispatch(register(formData));
        if (res.meta.requestStatus === "fulfilled") {
            navigate("/");
        }
        setIsSubmitting(false);
    };

    return (
        <div
            className="d-flex justify-content-center align-items-center vh-100"
            style={{ overflow: "hidden", height: "100vh" }}
        >
            <Card style={{ width: "28rem" }} className="p-4 shadow">
                <h2 className="text-center mb-3">Register</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="name">
                        <Form.Label className="fs-5">Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            placeholder="Enter name"
                            onChange={handleChange}
                            required
                            style={{ height: "50px", fontSize: "1.1rem" }}
                        />
                    </Form.Group>
                    <Form.Group controlId="email" className="mt-3">
                        <Form.Label className="fs-5">Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            placeholder="Enter email"
                            onChange={handleChange}
                            required
                            style={{ height: "50px", fontSize: "1.1rem" }}
                        />
                    </Form.Group>
                    <Form.Group controlId="password" className="mt-3">
                        <Form.Label className="fs-5">Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            placeholder="Enter password"
                            onChange={handleChange}
                            required
                            style={{ height: "50px", fontSize: "1.1rem" }}
                        />
                    </Form.Group>
                    <Button
                        type="submit"
                        className="w-100 mt-4"
                        variant="outline-dark"
                        disabled={loading || isSubmitting}
                        style={{ height: "50px", fontSize: "1.1rem" }}
                    >
                        {loading || isSubmitting ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Registering...
                            </>
                        ) : (
                            "Register"
                        )}
                    </Button>
                </Form>
                <p className="text-center mt-3 fs-5">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </Card>
        </div>
    );
};

export default Register;
