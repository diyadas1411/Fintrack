'use client';

import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { UserPlus, X } from 'lucide-react';

type Participant = {
  id: number;
  name: string;
  amount?: number;
  percentage?: number;
};

type SplitType = 'equal' | 'percentage' | 'custom';

export default function SplitBillPage() {
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [participants, setParticipants] = useState<Participant[]>([
    { id: 1, name: 'You' },
    { id: 2, name: 'Friend 1' },
  ]);
  const [splitType, setSplitType] = useState<SplitType>('equal');
  const [nextId, setNextId] = useState(3);

  const handleAddParticipant = () => {
    setParticipants([...participants, { id: nextId, name: `Friend ${participants.length}` }]);
    setNextId(nextId + 1);
  };
  
  const handleRemoveParticipant = (id: number) => {
    if (participants.length > 2) {
      setParticipants(participants.filter(p => p.id !== id));
    }
  };

  const handleParticipantChange = (id: number, field: 'name' | 'amount' | 'percentage', value: string) => {
    setParticipants(
      participants.map(p =>
        p.id === id ? { ...p, [field]: field === 'name' ? value : parseFloat(value) || 0 } : p
      )
    );
  };
  
  const splitResults = useMemo(() => {
    if (!totalAmount || participants.length === 0) return [];

    return participants.map(p => {
      let share = 0;
      switch (splitType) {
        case 'equal':
          share = totalAmount / participants.length;
          break;
        case 'percentage':
          share = totalAmount * ((p.percentage || 0) / 100);
          break;
        case 'custom':
          share = p.amount || 0;
          break;
      }
      return { ...p, share };
    });
  }, [totalAmount, participants, splitType]);

  const sumOfCustomAmounts = participants.reduce((acc, p) => acc + (p.amount || 0), 0);
  const sumOfPercentages = participants.reduce((acc, p) => acc + (p.percentage || 0), 0);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Split a Bill</h1>
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Bill Details</CardTitle>
            <CardDescription>Enter the total amount and who you're splitting with.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="total-amount">Total Bill Amount (₹)</Label>
              <Input id="total-amount" type="number" placeholder="e.g., 3000" onChange={e => setTotalAmount(parseFloat(e.target.value) || 0)} />
            </div>

            <div className="space-y-4">
              <Label>Participants</Label>
              <div className="space-y-2">
                {participants.map(p => (
                  <div key={p.id} className="flex items-center gap-2">
                    <Input value={p.name} onChange={(e) => handleParticipantChange(p.id, 'name', e.target.value)} />
                    {p.id !== 1 && (
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveParticipant(p.id)} disabled={participants.length <= 2}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full" onClick={handleAddParticipant}>
                <UserPlus className="mr-2 h-4 w-4" /> Add Person
              </Button>
            </div>
            
            <Separator />

            <div className="space-y-4">
              <Label>How to split?</Label>
              <RadioGroup value={splitType} onValueChange={(value: SplitType) => setSplitType(value)}>
                <div className="flex items-center space-x-2"><RadioGroupItem value="equal" id="equal" /><Label htmlFor="equal">Equally</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="percentage" id="percentage" /><Label htmlFor="percentage">By Percentage</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="custom" id="custom" /><Label htmlFor="custom">By Custom Amount</Label></div>
              </RadioGroup>
            </div>

            {splitType === 'percentage' && (
              <div className="space-y-2 rounded-md border p-4">
                 <Label>Percentages</Label>
                 {participants.map(p => (
                    <div key={p.id} className="flex items-center gap-2">
                      <Label className="w-24 truncate">{p.name}</Label>
                      <Input type="number" placeholder="%" onChange={e => handleParticipantChange(p.id, 'percentage', e.target.value)}/>
                    </div>
                  ))}
                  {sumOfPercentages !== 100 && <p className="text-xs text-destructive">Percentages must add up to 100%. Current: {sumOfPercentages}%</p>}
              </div>
            )}
            {splitType === 'custom' && (
              <div className="space-y-2 rounded-md border p-4">
                 <Label>Custom Amounts</Label>
                 {participants.map(p => (
                    <div key={p.id} className="flex items-center gap-2">
                      <Label className="w-24 truncate">{p.name}</Label>
                      <Input type="number" placeholder="₹" onChange={e => handleParticipantChange(p.id, 'amount', e.target.value)}/>
                    </div>
                  ))}
                  {sumOfCustomAmounts !== totalAmount && <p className="text-xs text-destructive">Amounts must add up to ₹{totalAmount.toFixed(2)}. Current: ₹{sumOfCustomAmounts.toFixed(2)}</p>}
              </div>
            )}

          </CardContent>
        </Card>

        <Card className="bg-[#CCCCFF]/20 border-accent/20">
          <CardHeader>
            <CardTitle>Split Summary</CardTitle>
            <CardDescription>Review the split details below.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {splitResults.map(p => (
              <div key={p.id} className="flex items-center justify-between rounded-lg bg-background p-3">
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarFallback>{p.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{p.name}</span>
                </div>
                <span className="font-semibold text-lg text-primary">{p.share.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button className="w-full">Confirm & Settle</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
