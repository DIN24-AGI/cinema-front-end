import { useState, useEffect } from "react";

interface ApiStatusProps {
    endpoint: string;
    title?: string;
}

interface ApiResponse {
    [key: string]: string | number | boolean | null;
}

const ApiStatus = ({ endpoint, title }: ApiStatusProps) => {
    const [data, setData] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(endpoint);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                setData(result);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [endpoint]);

    if (loading) {
        return (
            <div className="card">
                <div className="card-body">
                    <div className="d-flex align-items-center">
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <span>Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card border-danger">
                <div className="card-body">
                    <h5 className="card-title text-danger">Error</h5>
                    <p className="card-text">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="card-body">
                {title && <h5 className="card-title">{title}</h5>}
                {data && (
                    <dl className="row mb-0">
                        {Object.entries(data).map(([key, value]) => (
                            <div key={key} className="row mb-2">
                                <dt className="col-sm-4 text-capitalize">{key}</dt>
                                <dd className="col-sm-8 mb-0">
                                    {value === "healthy" ? (
                                        <span className="badge bg-success">{String(value)}</span>
                                    ) : (
                                        <span className="text-muted">{String(value)}</span>
                                    )}
                                </dd>
                            </div>
                        ))}
                    </dl>
                )}
            </div>
        </div>
    );
};

export default ApiStatus;