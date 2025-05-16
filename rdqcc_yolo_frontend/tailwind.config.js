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
        },
    },
    plugins: [],
}