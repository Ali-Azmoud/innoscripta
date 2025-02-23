import React from "react";

interface PageHeaderProps {
    title: string;
    subtitle: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => {
    return (
        <div className="text-center py-4 px-3 d-flex flex-column flex-md-row justify-content-start align-items-center text-md-start">
            <h3 className="mb-2 mb-md-0">{title}</h3>
            <p className="text-muted m-0 ms-md-2 mt-1">{subtitle}</p>
        </div>
    );
};

export default PageHeader;
