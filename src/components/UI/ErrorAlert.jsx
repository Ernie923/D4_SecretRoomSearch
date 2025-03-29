import PropTypes from "prop-types";

const ErrorAlert = ({ message, onRetry }) => {
    return (
        <div
            className="alert alert-danger d-flex align-items-center justify-content-between"
            role="alert"
        >
            <div>
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {message || "發生錯誤，請稍後再試"}
            </div>
            {onRetry && (
                <button className="btn btn-sm btn-outline-danger" onClick={onRetry}>
                    重試
                </button>
            )}
        </div>
    );
};

ErrorAlert.propTypes = {
    message: PropTypes.string,
    onRetry: PropTypes.func,
};

export default ErrorAlert;
