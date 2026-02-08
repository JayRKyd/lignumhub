'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { Receipt, Expense, ExpenseCategory } from '@/types/receipts';

const getOrganizationId = async () => {
  return process.env.NEXT_PUBLIC_DEFAULT_ORG_ID || 'your-org-id-here';
};

export async function getReceipts(): Promise<Receipt[]> {
  const supabase = await createClient();
  const orgId = await getOrganizationId();

  const { data, error } = await supabase
    .from('receipts')
    .select('*')
    .eq('organization_id', orgId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching receipts:', error);
    return [];
  }

  return data || [];
}

export async function getReceipt(id: string): Promise<Receipt | null> {
  const supabase = await createClient();
  const orgId = await getOrganizationId();

  const { data, error } = await supabase
    .from('receipts')
    .select('*')
    .eq('id', id)
    .eq('organization_id', orgId)
    .single();

  if (error) {
    console.error('Error fetching receipt:', error);
    return null;
  }

  return data;
}

export async function getExpenseCategories(): Promise<ExpenseCategory[]> {
  const supabase = await createClient();
  const orgId = await getOrganizationId();

  const { data, error } = await supabase
    .from('expense_categories')
    .select('*')
    .eq('organization_id', orgId)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data || [];
}

export async function updateReceipt(
  id: string,
  updates: Partial<Receipt>
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const orgId = await getOrganizationId();

  const { error } = await supabase
    .from('receipts')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('organization_id', orgId);

  if (error) {
    console.error('Error updating receipt:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/receipts');
  revalidatePath(`/receipts/${id}/review`);
  return { success: true };
}

export async function getReceiptStats() {
  const supabase = await createClient();
  const orgId = await getOrganizationId();

  // Get all receipts
  const { data: receipts, error } = await supabase
    .from('receipts')
    .select('*')
    .eq('organization_id', orgId);

  if (error) {
    console.error('Error fetching receipt stats:', error);
    return {
      total: 0,
      pending: 0,
      thisMonth: 0,
      totalAmount: 0,
    };
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  return {
    total: receipts.length,
    pending: receipts.filter((r) => r.status === 'pending_review').length,
    thisMonth: receipts.filter(
      (r) => new Date(r.created_at) >= startOfMonth
    ).length,
    totalAmount: receipts.reduce((sum, r) => sum + (r.total_amount || 0), 0),
  };
}

export async function getExpenses(): Promise<Expense[]> {
  const supabase = await createClient();
  const orgId = await getOrganizationId();

  const { data, error } = await supabase
    .from('expenses')
    .select(`
      *,
      category:expense_categories(*)
    `)
    .eq('organization_id', orgId)
    .order('expense_date', { ascending: false });

  if (error) {
    console.error('Error fetching expenses:', error);
    return [];
  }

  return data || [];
}

export async function getExpenseStats() {
  const supabase = await createClient();
  const orgId = await getOrganizationId();

  const { data: expenses, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('organization_id', orgId);

  if (error) {
    console.error('Error fetching expense stats:', error);
    return {
      total: 0,
      taxDeductible: 0,
      withReceipts: 0,
      thisMonthTotal: 0,
    };
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  return {
    total: expenses.reduce((sum, e) => sum + (e.amount || 0), 0),
    taxDeductible: expenses
      .filter((e) => e.is_tax_deductible)
      .reduce((sum, e) => sum + (e.amount || 0), 0),
    withReceipts: expenses.filter((e) => e.receipt_url).length,
    thisMonthTotal: expenses
      .filter((e) => new Date(e.expense_date) >= startOfMonth)
      .reduce((sum, e) => sum + (e.amount || 0), 0),
  };
}
