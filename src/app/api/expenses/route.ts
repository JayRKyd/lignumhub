import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const orgId = process.env.NEXT_PUBLIC_DEFAULT_ORG_ID;

    if (!orgId) {
      return NextResponse.json(
        { error: 'Organization not configured' },
        { status: 400 }
      );
    }

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
      return NextResponse.json(
        { error: 'Failed to fetch expenses' },
        { status: 500 }
      );
    }

    return NextResponse.json({ expenses: data });
  } catch (error) {
    console.error('Expenses GET error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const orgId = process.env.NEXT_PUBLIC_DEFAULT_ORG_ID;

    if (!orgId) {
      return NextResponse.json(
        { error: 'Organization not configured' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      receipt_id,
      expense_date,
      category_id,
      vendor_name,
      amount,
      tax_amount,
      receipt_url,
      notes,
      payment_method,
      is_tax_deductible,
      description,
    } = body;

    // Validate required fields
    if (!expense_date || !vendor_name || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: expense_date, vendor_name, amount' },
        { status: 400 }
      );
    }

    // Create expense
    const { data: expense, error: expenseError } = await supabase
      .from('expenses')
      .insert({
        organization_id: orgId,
        expense_date,
        category_id: category_id || null,
        vendor_name,
        description: description || null,
        amount,
        tax_amount: tax_amount || 0,
        currency: 'BSD',
        payment_method: payment_method || null,
        receipt_url: receipt_url || null,
        receipt_id: receipt_id || null,
        is_tax_deductible: is_tax_deductible ?? true,
        notes: notes || null,
      })
      .select()
      .single();

    if (expenseError) {
      console.error('Error creating expense:', expenseError);
      return NextResponse.json(
        { error: 'Failed to create expense' },
        { status: 500 }
      );
    }

    // If this expense came from a receipt, update the receipt
    if (receipt_id) {
      const { error: receiptError } = await supabase
        .from('receipts')
        .update({
          expense_id: expense.id,
          status: 'completed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', receipt_id)
        .eq('organization_id', orgId);

      if (receiptError) {
        console.error('Error updating receipt:', receiptError);
        // Don't fail the request, just log the error
      }
    }

    return NextResponse.json({ success: true, expense });
  } catch (error) {
    console.error('Expenses POST error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
