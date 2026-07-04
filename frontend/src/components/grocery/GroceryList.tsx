import React from 'react';
import GroceryCard, { type GroceryItem } from './GroceryCard';
import EmptyState from './EmptyState';

interface GroceryListProps {
  items: GroceryItem[];
  onToggle: (id: number, isCompleted: boolean) => void;
  onDeleteRequest: (item: GroceryItem) => void;
}

const GroceryList: React.FC<GroceryListProps> = ({ items, onToggle, onDeleteRequest }) => {
  if (items.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map((item) => (
        <GroceryCard
          key={item.id}
          item={item}
          onToggle={onToggle}
          onDeleteRequest={onDeleteRequest}
        />
      ))}
    </div>
  );
};

export default GroceryList;
