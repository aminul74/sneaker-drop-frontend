import DropCard from "../components/DropCard";

/**
 * DropsGrid Component
 * Renders a responsive grid of drop cards
 */
const DropsGrid = ({ drops, onSuccess }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
      {drops.map((drop) => (
        <DropCard key={drop.id} drop={drop} onSuccess={onSuccess} />
      ))}
    </div>
  );
};

export default DropsGrid;
