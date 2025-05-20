const StatusMessage = ({type, message}) => {
    // Map type to styles
    const typeStyles = {
        success: "bg-[#e4f1e4] text-[#1b5e20] border-[#a5d6a7]",
        error: "bg-[#fce4e4] text-[#b71c1c] border-[#ef9a9a]",
        info: "bg-[#e1f5fe] text-[#01579b] border-primary-light-blue"
    };

    // Get the right styles based on type, fallback to info
    const styles = typeStyles[type] || typeStyles.info;

    return (
        <div
            className={`${styles} w-full sm:max-w-fit py-2 px-4 rounded-lg font-medium text-center border shadow-card text-sm`}
        >
            <div className="flex items-center justify-center">
                {type === 'success' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none"
                         viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M5 13l4 4L19 7"/>
                    </svg>
                )}
                {type === 'error' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none"
                         viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                )}
                {message}
            </div>
        </div>
    );
};

export default StatusMessage;