/**
 * EmptyState Component
 * Displayed when there are no active drops
 */
const EmptyState = () => {
  return (
    <div className="bg-gray-800 rounded-lg p-12 text-center">
      <div className="text-6xl mb-4">👟</div>
      <p className="text-xl text-gray-400">No drops available</p>
    </div>
  );
};

export default EmptyState;
