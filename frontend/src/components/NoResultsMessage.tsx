import React from "react";

interface NoResultsMessageProps {
    message?: string;
}

const NoResultsMessage: React.FC<NoResultsMessageProps> = ({ message = "No results found." }) => {
    return (
        <div className="text-center my-4">
            <p className="text-muted">{message}</p>
        </div>
    );
};

export default NoResultsMessage;
