/**
 * Toast Component
 * Displays success/error notifications at the top-right
 */
const Toast = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-in">
      {message}
    </div>
  );
};

export default Toast;
