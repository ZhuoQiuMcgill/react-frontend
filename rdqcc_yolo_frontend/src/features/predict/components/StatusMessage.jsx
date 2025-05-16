const StatusMessage = ({ type, message }) => {
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
            className={`${styles} py-4 px-6 rounded-lg font-medium text-center border shadow-card text-base`}
        >
            {message}
        </div>
    );
};

export default StatusMessage;