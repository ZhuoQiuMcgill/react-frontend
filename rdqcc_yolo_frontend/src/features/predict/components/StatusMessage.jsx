const StatusMessage = ({type, message}) => {
    // Map type to styles with modern design
    const typeStyles = {
        success: "bg-gradient-to-r from-green-50 to-emerald-50 text-emerald-800 border-emerald-200 shadow-emerald-100",
        error: "bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border-red-200 shadow-red-100",
        info: "bg-gradient-to-r from-blue-50 to-sky-50 text-blue-800 border-blue-200 shadow-blue-100"
    };

    // Get the right styles based on type, fallback to info
    const styles = typeStyles[type] || typeStyles.info;

    return (
        <div
            className={`${styles} w-full sm:max-w-fit py-4 px-6 rounded-2xl font-semibold text-center border shadow-lg backdrop-blur-sm text-sm transition-all duration-300 animate-pulse-slow`}
        >
            <div className="flex items-center justify-center gap-2">
                {type === 'success' && (
                    <div className="p-1 bg-emerald-200 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-700" fill="none"
                             viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                                  d="M5 13l4 4L19 7"/>
                        </svg>
                    </div>
                )}
                {type === 'error' && (
                    <div className="p-1 bg-red-200 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-700" fill="none"
                             viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                )}
                {type === 'info' && (
                    <div className="p-1 bg-blue-200 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-700" fill="none"
                             viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                )}
                <span className="font-medium">{message}</span>
            </div>
        </div>
    );
};

export default StatusMessage;