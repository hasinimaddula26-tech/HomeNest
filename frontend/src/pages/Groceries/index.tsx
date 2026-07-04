import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import GroceryForm, { GroceryFormValues } from '../../components/grocery/GroceryForm';
import GroceryList from '../../components/grocery/GroceryList';
import CategoryFilter from '../../components/grocery/CategoryFilter';
import DeleteConfirmationModal from '../../components/grocery/DeleteConfirmationModal';
import { GroceryItem } from '../../components/grocery/GroceryCard';
import * as groceryService from '../../services/api/groceryService';

const Groceries: React.FC = () => {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteItem, setDeleteItem] = useState<GroceryItem | null>(null);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await groceryService.getGroceries();
      if (res.success && res.data) {
        setItems(res.data);
      } else {
        setError(res.message || 'Failed to fetch grocery items');
      }
    } catch (err: any) {
      console.error(err);
      setError('Connection to backend failed. Please make sure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAddItem = async (values: GroceryFormValues) => {
    try {
      setIsSubmitLoading(true);
      const res = await groceryService.createGrocery(values);
      if (res.success && res.data) {
        setItems([res.data, ...items]);
        toast.success('Item added successfully!');
      } else {
        toast.error(res.message || 'Failed to add item');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to add item due to connection error');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleToggleItem = async (id: number, isCompleted: boolean) => {
    try {
      const res = await groceryService.updateGrocery(id, { is_completed: isCompleted });
      if (res.success && res.data) {
        setItems(items.map((item) => (item.id === id ? res.data! : item)));
        toast.success(isCompleted ? 'Item marked as completed!' : 'Item marked as active');
      } else {
        toast.error(res.message || 'Failed to update item');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to update item due to connection error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteItem) return;
    try {
      const res = await groceryService.deleteGrocery(deleteItem.id);
      if (res.success) {
        setItems(items.filter((item) => item.id !== deleteItem.id));
        toast.success('Item deleted successfully!');
      } else {
        toast.error(res.message || 'Failed to delete item');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete item due to connection error');
    } finally {
      setDeleteItem(null);
    }
  };

  const filteredItems = items.filter((item) => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Toaster position="top-right" />
      <Navbar />

      <main className="flex-grow pt-28 pb-16 px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="border-b border-slate-200/60 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-secondary tracking-tight">🛒 Grocery List</h1>
              <p className="text-slate-500 text-sm mt-1">Manage your family shopping list in real-time.</p>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5 flex items-center gap-3">
              <span className="text-xl">🥛</span>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Remaining Items</p>
                <p className="text-base font-extrabold text-secondary">
                  {items.filter((i) => !i.is_completed).length} items
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <GroceryForm onSubmit={handleAddItem} isLoading={isSubmitLoading} />

          {/* Error State */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-4 text-sm font-medium">
              ⚠️ {error}
            </div>
          )}

          {/* List Section */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Your Items
            </h3>
            
            <CategoryFilter
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-3">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-medium">Loading groceries...</p>
              </div>
            ) : (
              <GroceryList
                items={filteredItems}
                onToggle={handleToggleItem}
                onDeleteRequest={setDeleteItem}
              />
            )}
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        item={deleteItem}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteItem(null)}
      />

      <Footer />
    </div>
  );
};

export default Groceries;
