import DropCard from "../components/DropCard";

const DropsGrid = ({ drops, onReserve }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
      {drops.map((drop) => (
        <DropCard key={drop.id} drop={drop} onReserve={() => onReserve(drop)} />
      ))}
    </div>
  );
};

export default DropsGrid;
