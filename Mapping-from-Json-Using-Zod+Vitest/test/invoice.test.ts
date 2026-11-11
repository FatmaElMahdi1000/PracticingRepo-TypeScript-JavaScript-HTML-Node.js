// ============================================================
// Test Suite: Invoice Import & Storage
// ============================================================
import { describe, it, expect } from 'vitest';
import { importInvoices, invoiceInMemory } from '../src/InvoicesAndTDS';

describe('Testing Mapping an invoice, Storing in Temporary Map', () => {

    // --------------------------------------------------------
    // Test: basic smoke test — function exists
    // --------------------------------------------------------
    it('invoices.json has a content', async () => {
        expect(typeof importInvoices).toBe('function');
    });

    // --------------------------------------------------------
    // Test: import succeeds and stores records in Map
    // --------------------------------------------------------
    it('the function returns success message and stores records', async () => {
        // Reset Map before each test to avoid cross-test contamination
        invoiceInMemory.clear();

        const result = await importInvoices();

        // Verify success message
        expect(result).toContain('successfully imported');

        // Verify records were stored
        expect(invoiceInMemory.size).toBeGreaterThan(0);
    });

    // --------------------------------------------------------
    // Test: imported records have correct structure
    // --------------------------------------------------------
    it('imported records have correct structure', async () => {
        invoiceInMemory.clear();
        await importInvoices();

        const first = invoiceInMemory.values().next().value;
        expect(first).toBeDefined();
        expect(first.invoice.invoice_number).toBe('INV-000050');
        expect(first.invoice.balance).toBe(0);
        expect(first.invoice.tax_amount_withheld).toBe(10);
    });

});
