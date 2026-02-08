import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Azure Computer Vision configuration
const AZURE_CV_ENDPOINT = process.env.AZURE_CV_ENDPOINT;
const AZURE_CV_KEY = process.env.AZURE_CV_KEY;

interface OCRResult {
  vendor: string;
  date: string;
  total: number;
  tax: number;
  category: string;
  confidence: number;
}

async function performOCR(imageUrl: string): Promise<string> {
  if (!AZURE_CV_ENDPOINT || !AZURE_CV_KEY) {
    // Fallback: Return empty string if Azure CV not configured
    console.warn('Azure Computer Vision not configured, skipping OCR');
    return '';
  }

  try {
    // Call Azure Computer Vision Read API
    const analyzeResponse = await fetch(
      `${AZURE_CV_ENDPOINT}/vision/v3.2/read/analyze`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': AZURE_CV_KEY,
        },
        body: JSON.stringify({ url: imageUrl }),
      }
    );

    if (!analyzeResponse.ok) {
      throw new Error(`Azure CV analyze failed: ${analyzeResponse.statusText}`);
    }

    // Get the operation location for polling
    const operationLocation = analyzeResponse.headers.get('Operation-Location');
    if (!operationLocation) {
      throw new Error('No operation location returned');
    }

    // Poll for results
    let result = null;
    for (let i = 0; i < 10; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const pollResponse = await fetch(operationLocation, {
        headers: {
          'Ocp-Apim-Subscription-Key': AZURE_CV_KEY,
        },
      });

      const pollResult = await pollResponse.json();

      if (pollResult.status === 'succeeded') {
        result = pollResult;
        break;
      } else if (pollResult.status === 'failed') {
        throw new Error('OCR processing failed');
      }
    }

    if (!result) {
      throw new Error('OCR processing timed out');
    }

    // Extract text from result
    const lines: string[] = [];
    for (const readResult of result.analyzeResult?.readResults || []) {
      for (const line of readResult.lines || []) {
        lines.push(line.text);
      }
    }

    return lines.join('\n');
  } catch (error) {
    console.error('OCR error:', error);
    return '';
  }
}

async function extractReceiptData(ocrText: string, imageUrl: string): Promise<OCRResult> {
  const systemPrompt = `You are an expert at extracting structured data from receipt text.
Extract the following information from the receipt text provided:
- vendor: The name of the store or business
- date: The date of the transaction in YYYY-MM-DD format
- total: The total amount paid (just the number, no currency symbol)
- tax: The tax/VAT amount if visible (just the number, no currency symbol). Use 0 if not found.
- category: Best guess category from: Office Supplies, Travel & Transportation, Meals & Entertainment, Utilities, Rent & Lease, Professional Services, Marketing & Advertising, Insurance, Equipment & Maintenance, Inventory & Supplies, Bank Fees & Charges, Telecommunications, Subscriptions & Software, Training & Education, Customs & Import Duties, Government Fees & Licenses, Miscellaneous
- confidence: Your confidence in the extraction from 0 to 1 (1 being very confident)

Return ONLY a valid JSON object with these exact fields. If you cannot find a value, make your best guess or use reasonable defaults.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: ocrText
            ? `Extract receipt data from this text:\n\n${ocrText}`
            : 'I could not extract text from the receipt. Please analyze the image directly if possible and provide reasonable defaults.',
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const parsed = JSON.parse(content);
    return {
      vendor: parsed.vendor || 'Unknown Vendor',
      date: parsed.date || new Date().toISOString().split('T')[0],
      total: parseFloat(parsed.total) || 0,
      tax: parseFloat(parsed.tax) || 0,
      category: parsed.category || 'Miscellaneous',
      confidence: parseFloat(parsed.confidence) || 0.5,
    };
  } catch (error) {
    console.error('OpenAI extraction error:', error);
    return {
      vendor: 'Unknown Vendor',
      date: new Date().toISOString().split('T')[0],
      total: 0,
      tax: 0,
      category: 'Miscellaneous',
      confidence: 0.3,
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get organization ID (using env var for now, should come from auth)
    const orgId = process.env.NEXT_PUBLIC_DEFAULT_ORG_ID;
    if (!orgId) {
      return NextResponse.json(
        { error: 'Organization not configured' },
        { status: 400 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload an image.' },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop() || 'jpg';
    const filename = `${orgId}/${timestamp}.${extension}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('receipts')
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload image' },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('receipts')
      .getPublicUrl(filename);

    const imageUrl = urlData.publicUrl;

    // Perform OCR
    const ocrText = await performOCR(imageUrl);

    // Extract structured data using OpenAI
    const extractedData = await extractReceiptData(ocrText, imageUrl);

    // Save to receipts table
    const { data: receipt, error: insertError } = await supabase
      .from('receipts')
      .insert({
        organization_id: orgId,
        image_url: imageUrl,
        vendor_name: extractedData.vendor,
        receipt_date: extractedData.date,
        total_amount: extractedData.total,
        tax_amount: extractedData.tax,
        raw_ocr_text: ocrText,
        extracted_data: extractedData,
        confidence_score: extractedData.confidence,
        status: 'pending_review',
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to save receipt' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      receipt_id: receipt.id,
      extracted_data: extractedData,
    });
  } catch (error) {
    console.error('Receipt upload error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
