const Background = ({ children }) => (
    // Remove transition-all to disable the background color transition.
    <body className="min-h-screen bg-white transition-all dark:bg-gray-900">{children}</body>
);
export default Background;
