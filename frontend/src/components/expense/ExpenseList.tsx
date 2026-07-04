import React from 'react';
import ExpenseCard from './ExpenseCard';
import EmptyState from './EmptyState';
import { type ExpenseItem } from '../../services/api/expenseService';

interface ExpenseListProps {
  items: ExpenseItem[];
  onDeleteRequest: (item: ExpenseItem) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ items, onDeleteRequest }) => {
  if (items.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <ExpenseCard
          key={item.id}
          item={item}
          onDeleteRequest={onDeleteRequest}
        />
      ))}
    </div>
  );
};

export default ExpenseList;
