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
import type { Income } from '@/context/financial-context';

export default function IncomePage() {
  const { incomes, addIncome, updateIncome, deleteIncome } = useFinancials();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingIncomeId, setDeletingIncomeId] = useState<string | null>(null);

  const [currentSource, setCurrentSource] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  const openAddDialog = () => {
    setEditingIncome(null);
    setCurrentSource('');
    setCurrentAmount('');
    setCurrentDate('');
    setIsDialogOpen(true);
  };
  
  const openEditDialog = (income: Income) => {
    setEditingIncome(income);
    setCurrentSource(income.source);
    setCurrentAmount(String(income.amount));
    setCurrentDate(income.date);
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (id: string) => {
    setDeletingIncomeId(id);
    setIsDeleteDialogOpen(true);
  };
  
  const handleSaveIncome = () => {
    if (!currentSource || !currentAmount || !currentDate) {
      // Basic validation
      return;
    }
    
    if (editingIncome) {
      // Update existing income
      updateIncome({ ...editingIncome, source: currentSource, amount: parseFloat(currentAmount), date: currentDate });
    } else {
      // Add new income
      addIncome({
        source: currentSource,
        amount: parseFloat(currentAmount),
        date: currentDate
      });
    }
    
    setIsDialogOpen(false);
  };

  const handleDeleteIncome = () => {
    if (deletingIncomeId !== null) {
      deleteIncome(deletingIncomeId);
      setIsDeleteDialogOpen(false);
      setDeletingIncomeId(null);
    }
  };


  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Income</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Income
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingIncome ? 'Edit Income' : 'Add New Income'}</DialogTitle>
              <DialogDescription>
                {editingIncome ? 'Update the details of your income source.' : 'Enter the details of your new income source here.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="source" className="text-right">
                  Source
                </Label>
                <Input id="source" value={currentSource} onChange={(e) => setCurrentSource(e.target.value)} placeholder="e.g., Salary" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount (₹)
                </Label>
                <Input id="amount" type="number" value={currentAmount} onChange={(e) => setCurrentAmount(e.target.value)} placeholder="e.g., 50000" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Date
                </Label>
                <Input id="date" type="date" value={currentDate} onChange={(e) => setCurrentDate(e.target.value)} className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSaveIncome} type="submit">{editingIncome ? 'Save Changes' : 'Save Income'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Source</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {incomes.length > 0 ? (
              incomes.map((income) => (
                <TableRow key={income.id}>
                  <TableCell className="font-medium">{income.source}</TableCell>
                  <TableCell>{new Date(income.date).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right font-medium text-green-600">
                    {income.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
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
                        <DropdownMenuItem onClick={() => openEditDialog(income)}>
                           <Edit className="mr-2 h-4 w-4" />
                           <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => openDeleteDialog(income.id)}>
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
                    <TableCell colSpan={4} className="h-24 text-center">
                        No income added yet.
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
              This action cannot be undone. This will permanently delete this income record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteIncome} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
