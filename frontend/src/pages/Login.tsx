import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/auth/authSlice";
import { RootState, AppDispatch } from "../store";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Alert, Card, Spinner} from "react-bootstrap";

const Login: React.FC = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state: RootState) => state.auth);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(login(formData)).then((res) => {
            if (res.meta.requestStatus === "fulfilled") navigate("/");
        });
    };

    return (
        <div
            className="d-flex justify-content-center align-items-center vh-100"
            style={{ overflow: "hidden", height: "100vh" }}
        >
            <Card style={{ width: "26rem" }} className="p-4 shadow">
                <h2 className="text-center mb-3">Login</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="email">
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
                        disabled={loading}
                        style={{ height: "50px", fontSize: "1.1rem" }}
                    >
                        {loading ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Logging in...
                            </>
                        ) : "Login"}
                    </Button>
                </Form>
                <p className="text-center mt-3 fs-5">
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </Card>
        </div>
    );
};

export default Login;
