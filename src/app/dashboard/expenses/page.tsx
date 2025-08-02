'use client'
import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, MoreHorizontal, Trash2, Edit } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useFinancials } from '@/context/financial-context';
import type { Expense } from '@/context/financial-context';

const categories = ["Food & Dining", "Transportation", "Shopping", "Utilities", "Healthcare", "Entertainment", "Education", "Other"];

export default function ExpensesPage() {
  const { expenses, addExpense, updateExpense, deleteExpense } = useFinancials();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingExpenseId, setDeletingExpenseId] = useState<string | null>(null);
  
  const [currentItem, setCurrentItem] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [currentCategory, setCurrentCategory] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  const openAddDialog = () => {
    setEditingExpense(null);
    setCurrentItem('');
    setCurrentAmount('');
    setCurrentCategory('');
    setCurrentDate('');
    setIsDialogOpen(true);
  };
  
  const openEditDialog = (expense: Expense) => {
    setEditingExpense(expense);
    setCurrentItem(expense.item);
    setCurrentAmount(String(expense.amount));
    setCurrentCategory(expense.category);
    setCurrentDate(expense.date);
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (id: string) => {
    setDeletingExpenseId(id);
    setIsDeleteDialogOpen(true);
  };
  
  const handleSaveExpense = () => {
    if (!currentItem || !currentAmount || !currentCategory || !currentDate) {
      // Basic validation
      return;
    }
    
    if (editingExpense) {
      // Update existing expense
      updateExpense({ ...editingExpense, item: currentItem, amount: parseFloat(currentAmount), category: currentCategory, date: currentDate });
    } else {
      // Add new expense
      addExpense({
        item: currentItem,
        amount: parseFloat(currentAmount),
        category: currentCategory,
        date: currentDate
      });
    }
    
    setIsDialogOpen(false);
  };

  const handleDeleteExpense = () => {
    if (deletingExpenseId !== null) {
      deleteExpense(deletingExpenseId);
      setIsDeleteDialogOpen(false);
      setDeletingExpenseId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
              <DialogDescription>
                {editingExpense ? 'Update the details of your expense.' : 'Enter the details of your new expense here.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="item" className="text-right">
                  Item
                </Label>
                <Input id="item" value={currentItem} onChange={(e) => setCurrentItem(e.target.value)} placeholder="e.g., Coffee" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount (₹)
                </Label>
                <Input id="amount" type="number" value={currentAmount} onChange={(e) => setCurrentAmount(e.target.value)} placeholder="e.g., 250" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select value={currentCategory} onValueChange={setCurrentCategory}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Date
                </Label>
                <Input id="date" type="date" value={currentDate} onChange={(e) => setCurrentDate(e.target.value)} className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSaveExpense} type="submit">{editingExpense ? 'Save Changes' : 'Save Expense'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.length > 0 ? (
              expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.item}</TableCell>
                  <TableCell><Badge variant="outline">{expense.category}</Badge></TableCell>
                  <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right font-medium text-red-500">
                    {expense.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(expense)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => openDeleteDialog(expense.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No expenses added yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this expense record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteExpense} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
