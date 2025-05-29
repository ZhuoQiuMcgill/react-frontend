/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Core Palette
                'm7': {
                    'light-purple': '#dfbee8',
                    'light-blue': '#7ec3ed',
                    'dark-blue': '#616ca8',
                    'medium-blue': '#8180b4',
                    'off-white': '#f6f9f6',
                },
                // Mapped Variables
                'primary': {
                    'light-blue': '#7ec3ed',
                    'blue': '#8180b4',
                    'dark-blue': '#616ca8',
                },
                'accent': {
                    'light-pink': '#e6cceb',
                    'pink': '#dfbee8',
                    'dark-pink': '#c8a2c8',
                },
                'neutral': {
                    'white': '#ffffff',
                    'light-gray': '#f6f9f6',
                    'gray': '#e9ecef',
                    'dark-gray': '#6c757d',
                },
                'text': {
                    'default': '#343a40',
                    'light': '#495057',
                },
                'success': '#4cae4c',
                'error': '#d43f3a',
                'info': '#7ec3ed',
            },
            boxShadow: {
                'header': '0 4px 8px rgba(0, 0, 0, 0.1)',
                'main': '0 5px 15px rgba(0, 0, 0, 0.08)',
                'button': '0 3px 6px rgba(223, 190, 232, 0.4)',
                'button-hover': '0 5px 10px rgba(223, 190, 232, 0.5)',
                'button-active': '0 2px 4px rgba(223, 190, 232, 0.4)',
                'error-button': '0 3px 6px rgba(212, 63, 58, 0.4)',
                'error-button-hover': '0 5px 10px rgba(212, 63, 58, 0.5)',
                'card': '0 2px 5px rgba(0, 0, 0, 0.05)',
            },
            backgroundImage: {
                'gradient-primary': 'linear-gradient(135deg, #8180b4, #616ca8)',
                'gradient-accent': 'linear-gradient(135deg, #dfbee8, #c8a2c8)',
                'gradient-background': 'linear-gradient(135deg, #eaf4fa 0%, #fbf5fc 100%)',
                'gradient-danger': 'linear-gradient(135deg, #ff8a9e, #d43f3a)',
            },
            borderWidth: {
                '3': '3px',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'bounce-slow': 'bounce 2s infinite',
                'spin-slow': 'spin 3s linear infinite',
                'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'zoom-in': 'zoomIn 0.3s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                zoomIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
}