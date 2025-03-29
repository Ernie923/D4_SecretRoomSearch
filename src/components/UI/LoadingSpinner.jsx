const LoadingSpinner = () => {
    return (
        <div className="d-flex justify-content-center align-items-center my-5">
            <div
                className="spinner-border text-primary"
                role="status"
                style={{ width: "3rem", height: "3rem" }}
            >
                <span className="visually-hidden">載入中...</span>
            </div>
        </div>
    );
};

export default LoadingSpinner;
