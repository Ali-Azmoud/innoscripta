import React from "react";
import { Spinner } from "react-bootstrap";

interface LoadingMessageProps {
    message?: string;
}

const LoadingMessage: React.FC<LoadingMessageProps> = ({ message = "Loading..." }) => {
    return (
        <div className="text-center my-4">
            <Spinner animation="border" role="status">
                <span className="visually-hidden">{message}</span>
            </Spinner>
            <p className="mt-2">{message}</p>
        </div>
    );
};

export default LoadingMessage;
