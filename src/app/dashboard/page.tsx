'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart"
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer
} from "recharts"
import {
  IndianRupee,
  ArrowUpRight,
  ArrowDownLeft
} from "lucide-react"
import { useFinancials } from "@/context/financial-context"
import { useMemo } from "react"

type Income = {
  id: string;
  amount: number;
  source: string;
  date: string;
}

type Expense = {
  id: string;
  amount: number;
  item: string;
  category: string;
  date: string;
}

type Transaction = {
  id: string;
  amount: number;
  description: string;
  type: 'income' | 'expense';
  date: string;
  source?: string;
  category?: string;
}


export default function DashboardPage() {
  const { incomes, expenses } = useFinancials()

  const totalIncome = useMemo(
    () => incomes.reduce((sum, inc) => sum + inc.amount, 0),
    [incomes]
  )
  const totalExpenses = useMemo(
    () => expenses.reduce((sum, exp) => sum + exp.amount, 0),
    [expenses]
  )
  const balance = totalIncome - totalExpenses

  const chartData = useMemo(() => {
    const dataByMonth: {
      [key: string]: { month: string; income: number; expenses: number }
    } = {}
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    ;[...incomes, ...expenses].forEach(transaction => {
      const date = new Date(transaction.date)
      const monthIndex = date.getMonth()
      const year = date.getFullYear()
      const monthKey = `${year}-${monthIndex}`
      const monthLabel = `${monthNames[monthIndex]}`

      if (!dataByMonth[monthKey]) {
        dataByMonth[monthKey] = { month: monthLabel, income: 0, expenses: 0 }
      }

      if ("source" in transaction) {
        dataByMonth[monthKey].income += transaction.amount
      } else {
        dataByMonth[monthKey].expenses += transaction.amount
      }
    })

    return Object.values(dataByMonth)
  }, [incomes, expenses])

  const recentTransactions: Transaction[] = useMemo(() => {
    const all: Transaction[] = [
      ...incomes.map(i => ({
        ...i,
        type: "income" as const,
        description: i.source
      })),
      ...expenses.map(e => ({
        ...e,
        type: "expense" as const,
        description: e.item,
        amount: -e.amount
      }))
    ]

    return all
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
  }, [incomes, expenses])

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      {/* Balance Cards */}
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-[#ADD8E6]/20 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{balance.toLocaleString("en-IN")}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Income</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              +₹{totalIncome.toLocaleString("en-IN")}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
            <ArrowDownLeft className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              -₹{totalExpenses.toLocaleString("en-IN")}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overview and Recent Transactions */}
      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>Income vs. Expenses</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={{}} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {chartData.length > 0 ? (
                  <BarChart data={chartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="month"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={value => `₹${value / 1000}k`}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="income" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenses" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    No data to display
                  </div>
                )}
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your last 5 transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((transaction, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="font-medium">{transaction.description}</div>
                        <div className="text-sm text-muted-foreground">
                        {transaction.category ?? transaction.source ?? "—"}
                        </div>

                      </TableCell>
                      <TableCell
                        className={`text-right font-medium ${
                          transaction.type === "income" ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {transaction.amount.toLocaleString("en-IN", {
                          style: "currency",
                          currency: "INR"
                        })}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="h-24 text-center">
                      No recent transactions.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
