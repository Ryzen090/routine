'use client';

import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CreditCard, Plus, Calendar, DollarSign, TrendingUp, Trash2, Pencil } from 'lucide-react';

const categoryColors = {
  food: 'bg-orange-100 text-orange-800 border-orange-200',
  gas: 'bg-blue-100 text-blue-800 border-blue-200',
  family: 'bg-pink-100 text-pink-800 border-pink-200',
  utilities: 'bg-green-100 text-green-800 border-green-200',
  entertainment: 'bg-purple-100 text-purple-800 border-purple-200',
  rent: 'bg-red-100 text-red-800 border-red-200',
  salary: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  other: 'bg-gray-100 text-gray-800 border-gray-200',
};

const paymentIcons = [
  '💰', '🍛', '⛽', '🎬', '💡', '🏠', '🛒', '☕', '🎮', '🚗',
  '👕', '🎵', '📚', '💲', '🍕', '🎯', '💳', '🎪', '🏡', '⚡'
];

export function Payments() {
  const { state, dispatch } = useApp();
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [editingPayment, setEditingPayment] = useState<any>(null);
  const [newPayment, setNewPayment] = useState({
    title: '',
    amount: '',
    category: 'food' as const,
    type: 'expense' as const,
    icon: '💰',
  });

  const handleAddPayment = () => {
    if (!newPayment.title || !newPayment.amount) return;

    const payment = {
      id: Date.now().toString(),
      title: newPayment.title,
      amount: parseFloat(newPayment.amount),
      category: newPayment.category,
      type: newPayment.type,
      date: new Date().toISOString().split('T')[0],
      icon: newPayment.icon,
    };

    dispatch({ type: 'ADD_PAYMENT', payload: payment });
    setNewPayment({
      title: '',
      amount: '',
      category: 'food',
      type: 'expense',
      icon: '💰',
    });
    setIsAddingPayment(false);
  };

  const handleEditPayment = () => {
    if (!editingPayment) return;
    dispatch({ type: 'UPDATE_PAYMENT', payload: editingPayment });
    setEditingPayment(null);
  };

  const handleDeletePayment = (paymentId: string) => {
    dispatch({ type: 'DELETE_PAYMENT', payload: paymentId });
  };

  const today = new Date().toISOString().split('T')[0];
  const todaysPayments = state.payments.filter(payment => payment.date === today);
  const todaysExpenses = todaysPayments.filter(p => p.type === 'expense').reduce((sum, p) => sum + p.amount, 0);
  const todaysIncome = todaysPayments.filter(p => p.type === 'income').reduce((sum, p) => sum + p.amount, 0);
  const todaysBalance = todaysIncome - todaysExpenses;

  return (
    <div className="space-y-4 lg:space-y-6 bg-white min-h-screen pt-5 lg:pt-0 pb-20 lg:pb-0 px-4 lg:px-0">
      <h1 className="text-center text-2xl lg:text-3xl font-bold mb-2">Daily Payments</h1>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold flex items-center gap-2 text-black">
            <CreditCard className="h-5 w-5 lg:h-6 lg:w-6" />
            Payments
          </h2>
          <p className="text-sm lg:text-base text-gray-600">Track your daily income and expenses</p>
        </div>
        <Dialog open={isAddingPayment} onOpenChange={setIsAddingPayment}>
          <DialogTrigger asChild>
              <Plus className="h-4 w-4 mr-2" />
          </DialogTrigger>
          <DialogContent className="max-w-md bg-white rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-black">Add Payment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 lg:space-y-6 py-4">
              <div className="text-center">
                <div className="text-4xl lg:text-6xl mb-2">{newPayment.icon}</div>
              </div>
              <input
                className="w-full h-[2.5em] pl-[0.8em] border-2 border-transparent rounded-[10px] outline-none overflow-hidden bg-[#F3F3F3] transition-all duration-500 
                         hover:border-[#4A9DEC] focus:border-[#4A9DEC] 
                         hover:bg-white focus:bg-white 
                         hover:shadow-[0_0_0_7px_rgba(74,157,236,0.2)] focus:shadow-[0_0_0_7px_rgba(74,157,236,0.2)]"
                placeholder="Payment"
                value={newPayment.title}
                onChange={(e) => setNewPayment({ ...newPayment, title: e.target.value })}
              />
             <input
                className="w-full h-[2.5em] pl-[0.8em] border-2 border-transparent rounded-[10px] outline-none overflow-hidden bg-[#F3F3F3] transition-all duration-500 
                         hover:border-[#4A9DEC] focus:border-[#4A9DEC] 
                         hover:bg-white focus:bg-white 
                         hover:shadow-[0_0_0_7px_rgba(74,157,236,0.2)] focus:shadow-[0_0_0_7px_rgba(74,157,236,0.2)]"
                type="number"
                placeholder="Amount"
                value={newPayment.amount}
                onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
              />
              <select
                value={newPayment.category}
                onChange={(e) => setNewPayment({ ...newPayment, category: e.target.value as any })}
                className="w-full h-[2.5em] pl-[0.8em] border-2 border-transparent rounded-[10px] outline-none overflow-hidden bg-[#F3F3F3] transition-all duration-500 
                         hover:border-[#4A9DEC] focus:border-[#4A9DEC] 
                         hover:bg-white focus:bg-white 
                         hover:shadow-[0_0_0_7px_rgba(74,157,236,0.2)] focus:shadow-[0_0_0_7px_rgba(74,157,236,0.2)]"
              >
                <option value="food">Food</option>
                <option value="gas">Gas</option>
                <option value="family">Family</option>
                <option value="utilities">Utilities</option>
                <option value="entertainment">Entertainment</option>
                <option value="rent">Rent</option>
                <option value="salary">Salary</option>
                <option value="other">Other</option>
              </select>
              <div className="grid grid-cols-5 lg:grid-cols-7 gap-2">
                {paymentIcons.map((icon) => (
                  <button
                    key={icon}
                    onClick={() => setNewPayment({ ...newPayment, icon })}
                    className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full text-lg lg:text-xl flex items-center justify-center transition-all ${
                      newPayment.icon === icon
                        ? 'bg-green-100 ring-2 ring-green-500'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
              <Button onClick={handleAddPayment} className="w-full bg-green-600 hover:bg-green-700">
                Add Payment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Daily Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <Card className="bg-green-50 border border-green-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs lg:text-sm font-medium text-green-800">Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-base lg:text-2xl font-bold text-green-900">${todaysIncome.toFixed(2)}</div>
            <p className="text-xs text-green-600">Today</p>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border border-red-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs lg:text-sm font-medium text-red-800">Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-base lg:text-2xl font-bold text-red-900">${todaysExpenses.toFixed(2)}</div>
            <p className="text-xs text-red-600">Today</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border border-blue-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs lg:text-sm font-medium text-blue-800">Balance</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-base lg:text-2xl font-bold ${todaysBalance >= 0 ? 'text-green-900' : 'text-red-900'}`}>
              ${todaysBalance.toFixed(2)}
            </div>
            <p className="text-xs text-blue-600">Net</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border border-purple-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs lg:text-sm font-medium text-purple-800">Count</CardTitle>
            <CreditCard className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-base lg:text-2xl font-bold text-purple-900">{todaysPayments.length}</div>
            <p className="text-xs text-purple-600">Today</p>
          </CardContent>
        </Card>
      </div>

      {/* Payments List */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-black">Today's Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {todaysPayments.length === 0 ? (
            <div className="text-center py-8 lg:py-12 text-gray-500">
              <CreditCard className="h-8 w-8 lg:h-12 lg:w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm lg:text-base">No transactions recorded today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todaysPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 lg:p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="text-xl lg:text-2xl flex-shrink-0">{payment.icon}</span>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-black text-sm lg:text-base truncate">{payment.title}</h4>
                      <div className="flex items-center gap-2">
                        <Badge className={`${categoryColors[payment.category]} text-xs`}>
                          {payment.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
                    <span className={`text-sm lg:text-lg font-bold ${
                      payment.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {payment.type === 'income' ? '+' : '-'}${payment.amount.toFixed(2)}
                    </span>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => setEditingPayment(payment)}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Payment Dialog */}
      <Dialog open={!!editingPayment} onOpenChange={() => setEditingPayment(null)}>
        <DialogContent className="max-w-md bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-black">Edit Payment</DialogTitle>
          </DialogHeader>
          {editingPayment && (
            <div className="space-y-4 lg:space-y-6 py-4">
              <div className="text-center">
                <div className="text-4xl lg:text-6xl mb-2">{editingPayment.icon}</div>
              </div>
              <input
                className="w-full h-[2.5em] pl-[0.8em] border-2 border-transparent rounded-[10px] outline-none overflow-hidden bg-[#F3F3F3] transition-all duration-500 
                         hover:border-[#4A9DEC] focus:border-[#4A9DEC] 
                         hover:bg-white focus:bg-white 
                         hover:shadow-[0_0_0_7px_rgba(74,157,236,0.2)] focus:shadow-[0_0_0_7px_rgba(74,157,236,0.2)]"
                placeholder="Payment"
                value={editingPayment.title}
                onChange={(e) => setEditingPayment({ ...editingPayment, title: e.target.value })}
              />
              <input
                className="w-full h-[2.5em] pl-[0.8em] border-2 border-transparent rounded-[10px] outline-none overflow-hidden bg-[#F3F3F3] transition-all duration-500 
                         hover:border-[#4A9DEC] focus:border-[#4A9DEC] 
                         hover:bg-white focus:bg-white 
                         hover:shadow-[0_0_0_7px_rgba(74,157,236,0.2)] focus:shadow-[0_0_0_7px_rgba(74,157,236,0.2)]"
                type="number"
                placeholder="Amount"
                value={editingPayment.amount.toString()}
                onChange={(e) => setEditingPayment({ ...editingPayment, amount:parseFloat(e.target.value) || 0 })}
              />
              <select
                value={editingPayment.category}
                onChange={(e) => setEditingPayment({ ...editingPayment, category: e.target.value as any })}
                className="w-full h-[2.5em] pl-[0.8em] border-2 border-transparent rounded-[10px] outline-none overflow-hidden bg-[#F3F3F3] transition-all duration-500 
                         hover:border-[#4A9DEC] focus:border-[#4A9DEC] 
                         hover:bg-white focus:bg-white 
                         hover:shadow-[0_0_0_7px_rgba(74,157,236,0.2)] focus:shadow-[0_0_0_7px_rgba(74,157,236,0.2)]"
              >
                <option value="food">Food</option>
                <option value="gas">Gas</option>
                <option value="family">Family</option>
                <option value="utilities">Utilities</option>
                <option value="entertainment">Entertainment</option>
                <option value="rent">Rent</option>
                <option value="salary">Salary</option>
                <option value="other">Other</option>
              </select>
              <div className="grid grid-cols-5 lg:grid-cols-7 gap-2">
                {paymentIcons.map((icon) => (
                  <button
                    key={icon}
                    onClick={() => setEditingPayment({ ...editingPayment, icon })}
                    className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full text-lg lg:text-xl flex items-center justify-center transition-all ${
                      editingPayment.icon === icon
                        ? 'bg-green-100 ring-2 ring-green-500'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
              <Button onClick={handleEditPayment} className="w-full bg-green-600 hover:bg-green-700">
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}