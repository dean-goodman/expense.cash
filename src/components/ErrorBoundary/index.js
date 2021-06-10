import BaseErrorBoundary from './BaseErrorBoundary';
import Log from '../../libs/Log';

BaseErrorBoundary.defaultProps.logError = (errorMessage, error, errorInfo) => {
    // Log the error to the server
    Log.alert(errorMessage, 10, {error: error.message, errorInfo});
};

export default BaseErrorBoundary;
