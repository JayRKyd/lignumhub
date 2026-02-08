// Receipt and Expense Types for LignumHub Accounting

export type ReceiptStatus = 'pending_review' | 'completed' | 'failed';

export type PaymentMethod =
  | 'cash'
  | 'bank_transfer'
  | 'credit_card'
  | 'debit_card'
  | 'cheque'
  | 'mobile_payment'
  | 'other';

export interface Receipt {
  id: string;
  organization_id: string;
  image_url: string;
  vendor_name?: string | null;
  receipt_date?: string | null;
  total_amount?: number | null;
  tax_amount?: number | null;
  category_id?: string | null;
  raw_ocr_text?: string | null;
  extracted_data?: Record<string, unknown> | null;
  confidence_score?: number | null;
  status: ReceiptStatus;
  expense_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ExpenseCategory {
  id: string;
  organization_id: string;
  name: string;
  description?: string | null;
  color?: string | null;
  is_tax_deductible: boolean;
  parent_category_id?: string | null;
  created_at?: string;
}

export interface Expense {
  id: string;
  organization_id: string;
  expense_date: string;
  category_id?: string | null;
  category?: ExpenseCategory | null;
  vendor_name: string;
  description?: string | null;
  amount: number;
  tax_amount?: number | null;
  currency: string;
  payment_method?: PaymentMethod | null;
  receipt_url?: string | null;
  receipt_id?: string | null;
  is_tax_deductible: boolean;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ReceiptFormData {
  vendor_name: string;
  receipt_date: string;
  total_amount: number;
  tax_amount?: number;
  category_id: string;
  payment_method: PaymentMethod;
  is_tax_deductible: boolean;
  notes?: string;
}

export interface OCRExtractionResult {
  vendor: string;
  date: string;
  total: number;
  tax: number;
  category: string;
  confidence: number;
}

export interface ReceiptUploadResponse {
  success: boolean;
  receipt_id?: string;
  extracted_data?: OCRExtractionResult;
  error?: string;
}

// Default expense categories for Caribbean businesses
export const DEFAULT_EXPENSE_CATEGORIES = [
  { name: 'Office Supplies', is_tax_deductible: true },
  { name: 'Travel & Transportation', is_tax_deductible: true },
  { name: 'Meals & Entertainment', is_tax_deductible: true },
  { name: 'Utilities', is_tax_deductible: true },
  { name: 'Rent & Lease', is_tax_deductible: true },
  { name: 'Professional Services', is_tax_deductible: true },
  { name: 'Marketing & Advertising', is_tax_deductible: true },
  { name: 'Insurance', is_tax_deductible: true },
  { name: 'Equipment & Maintenance', is_tax_deductible: true },
  { name: 'Inventory & Supplies', is_tax_deductible: true },
  { name: 'Bank Fees & Charges', is_tax_deductible: true },
  { name: 'Telecommunications', is_tax_deductible: true },
  { name: 'Subscriptions & Software', is_tax_deductible: true },
  { name: 'Training & Education', is_tax_deductible: true },
  { name: 'Customs & Import Duties', is_tax_deductible: true },
  { name: 'Government Fees & Licenses', is_tax_deductible: true },
  { name: 'Miscellaneous', is_tax_deductible: false },
] as const;

export const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: 'cash', label: 'Cash' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'debit_card', label: 'Debit Card' },
  { value: 'cheque', label: 'Cheque' },
  { value: 'mobile_payment', label: 'Mobile Payment' },
  { value: 'other', label: 'Other' },
];
