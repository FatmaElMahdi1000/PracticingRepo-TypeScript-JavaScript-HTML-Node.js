// ============================================================
// Imports
// ============================================================
import { z } from 'zod';
import * as fs from 'fs/promises';

// ============================================================
// Schema Helpers (reusable Zod building blocks)
// ============================================================
// Helper: creates a trimmed string validator with min/max length
const text = (max: number) => z.string().trim().min(1).max(max);

// Helper: validates Zoho IDs (digits only, max 30 chars)
const zohoId = z.string().regex(/^\d{1,30}$/, "Zoho's id, digits only: an ID Excel rounded (2.3E+18) is not one.");

// Helper: validates finite numbers (no NaN, no Infinity)
const amount = z.number().finite();

// Helper: validates date strings in YYYY-MM-DD format
const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD');

// ============================================================
// Invoice Schema (mimics original document-import.ts)
// ============================================================
// strictObject rejects unknown keys — catches schema mismatches
const importedInvoiceFields = z.strictObject({
    invoice_id: text(70),
    invoice_number: text(50),
    customer_name: text(100),
    status: text(50),
    date: day,
    due_date: day,
    last_payment_date: day,
    total: amount.optional(),
    tax_amount_withheld: amount.optional(),   // real TDS — keep it, never zero
    balance: amount.optional()                 // 0 = paid/settled
});

// Auto-generate TypeScript type from Zod schema (single source of truth)
export type ImportedInvoiceFields = z.infer<typeof importedInvoiceFields>

const importedInvoiceSchema = z.strictObject({
    invoiceId: zohoId,
    lastModified: day.nullable(),               // handles null from JSON
    invoice: importedInvoiceFields
});

export type ImportedInvoiceRecord = z.infer<typeof importedInvoiceSchema>

// ============================================================
// Temporary In-Memory Storage (Map)
// ============================================================
export const invoiceInMemory = new Map<string, ImportedInvoiceRecord>();

// ============================================================
// Import Function: reads JSON file, validates, stores in Map
// ============================================================
export async function importInvoices(): Promise<string> {
    const validatedRecords: ImportedInvoiceRecord[] = [];

    // 1. Read the JSON file
    const invoiceToString = await fs.readFile('src/BugCaseInvoice.json', 'utf-8');
    const rawArray = JSON.parse(invoiceToString);

    // 2. Validate each record through Zod schema
    for (const rawInvoice of rawArray) {
        const mappedInvoice = importedInvoiceSchema.parse(rawInvoice);
        validatedRecords.push(mappedInvoice);
    }

    // 3. Store validated records in Map (keyed by invoiceId)
    for (const validatedRecord of validatedRecords) {
        invoiceInMemory.set(validatedRecord.invoiceId, validatedRecord);
    }

    return `successfully imported ${validatedRecords.length} invoice/invoices`;
}

// ============================================================
// Helper: check if invoice is paid (balance === 0)
// ============================================================
// === checks both value AND type (5 === 5 → true, 5 === "5" → false)
export const invoicePaid = (invoice: ImportedInvoiceFields): boolean => {
    return invoice.balance === 0;
}

// ============================================================
// Unused variable (kept for reference)
// ============================================================
const BuggyInvoice = fs.readFile('src/BugCaseInvoice.json')
