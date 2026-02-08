'use server';

import { createClient } from '@/lib/supabase/server';

interface ExpenseByCategory {
  name: string;
  amount: number;
}

interface PLData {
  revenue: number;
  cogs: number;
  totalExpenses: number;
  expensesByCategory: ExpenseByCategory[];
}

const getOrganizationId = async () => {
  return process.env.NEXT_PUBLIC_DEFAULT_ORG_ID || 'your-org-id-here';
};

export async function getPLData(startDate: string, endDate: string): Promise<PLData> {
  const supabase = await createClient();
  const orgId = await getOrganizationId();

  // Get revenue from paid invoices (stub for now - returns 0 if no invoices table)
  let revenue = 0;
  try {
    const { data: invoices } = await supabase
      .from('invoices')
      .select('total')
      .eq('organization_id', orgId)
      .eq('status', 'paid')
      .gte('invoice_date', startDate)
      .lte('invoice_date', endDate);

    if (invoices) {
      revenue = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
    }
  } catch (error) {
    console.log('Invoices table may not exist, using 0 revenue');
  }

  // Get expenses grouped by category
  const { data: expenses, error: expensesError } = await supabase
    .from('expenses')
    .select(`
      amount,
      category:expense_categories(name)
    `)
    .eq('organization_id', orgId)
    .gte('expense_date', startDate)
    .lte('expense_date', endDate);

  if (expensesError) {
    console.error('Error fetching expenses:', expensesError);
    return {
      revenue,
      cogs: 0,
      totalExpenses: 0,
      expensesByCategory: [],
    };
  }

  // Group expenses by category
  const categoryMap = new Map<string, number>();
  let totalExpenses = 0;

  for (const expense of expenses || []) {
    const categoryName = (expense.category as unknown as { name: string } | null)?.name || 'Uncategorized';
    const amount = expense.amount || 0;
    totalExpenses += amount;
    categoryMap.set(categoryName, (categoryMap.get(categoryName) || 0) + amount);
  }

  const expensesByCategory: ExpenseByCategory[] = Array.from(categoryMap.entries())
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount);

  // COGS is stubbed for now
  const cogs = 0;

  return {
    revenue,
    cogs,
    totalExpenses,
    expensesByCategory,
  };
}
