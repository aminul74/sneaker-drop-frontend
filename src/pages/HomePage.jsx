import { useToast } from "../hooks/useToast";
import { useRealTimeDrops } from "../hooks/useRealTimeDrops";
import Header from "../components/Header";
import Toast from "../components/Toast";
import EmptyState from "../components/EmptyState";
import DropsGrid from "../components/DropsGrid";

/**
 * HomePage
 * Main page displaying sneaker drops with real-time updates
 */
const HomePage = () => {
  const { drops, loading, error, refetch } = useRealTimeDrops();
  const { message, showMessage } = useToast();

  const handleSuccess = (msg) => {
    showMessage(msg);
    refetch(); // Refresh drops after successful purchase
  };

  const handleRetry = () => {
    refetch();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-white text-xl">Loading drops...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 p-4 sm:p-8">
        <Header />
        <main className="max-w-7xl mx-auto">
          <div className="bg-red-900/50 border border-red-600 rounded-lg p-8 text-center">
            <p className="text-red-200 text-lg mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
            >
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-8">
      <Header />
      <Toast message={message} />

      <main className="max-w-7xl mx-auto">
        {drops.length === 0 ? (
          <EmptyState />
        ) : (
          <DropsGrid drops={drops} onSuccess={handleSuccess} />
        )}
      </main>
    </div>
  );
};

export default HomePage;
