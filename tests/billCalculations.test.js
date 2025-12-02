const BillCalculationService = require('../src/services/billCalculationService');

describe('BillCalculationService', () => {
  
  describe('calculateItemAmount', () => {
    test('should calculate item amount correctly', () => {
      const result = BillCalculationService.calculateItemAmount(10, 100);
      expect(result).toBe(1000);
    });

    test('should handle decimal quantities', () => {
      const result = BillCalculationService.calculateItemAmount(2.5, 100);
      expect(result).toBe(250);
    });

    test('should handle decimal rates', () => {
      const result = BillCalculationService.calculateItemAmount(10, 99.99);
      expect(result).toBe(999.90);
    });
  });

  describe('calculateDiscountAmount', () => {
    test('should calculate discount correctly', () => {
      const result = BillCalculationService.calculateDiscountAmount(1000, 10);
      expect(result).toBe(100);
    });

    test('should handle zero discount', () => {
      const result = BillCalculationService.calculateDiscountAmount(1000, 0);
      expect(result).toBe(0);
    });

    test('should handle decimal discount percentages', () => {
      const result = BillCalculationService.calculateDiscountAmount(1000, 5.5);
      expect(result).toBe(55);
    });
  });

  describe('calculateTaxAmount', () => {
    test('should calculate tax correctly', () => {
      const result = BillCalculationService.calculateTaxAmount(1000, 18);
      expect(result).toBe(180);
    });

    test('should handle zero tax', () => {
      const result = BillCalculationService.calculateTaxAmount(1000, 0);
      expect(result).toBe(0);
    });

    test('should handle decimal tax percentages', () => {
      const result = BillCalculationService.calculateTaxAmount(1000, 5.5);
      expect(result).toBe(55);
    });
  });

  describe('processBillItem', () => {
    test('should process item with all taxes', () => {
      const item = {
        quantity: 10,
        rate: 100,
        mrp: 120,
        discountPercent: 10,
      };

      const taxRates = {
        igstPercent: 0,
        cgstPercent: 9,
        sgstPercent: 9,
        cessPercent: 0,
      };

      const result = BillCalculationService.processBillItem(item, taxRates);

      expect(result.quantity).toBe(10);
      expect(result.rate).toBe(100);
      expect(result.discountAmount).toBe(100); // 10% of 1000
      expect(result.cgstAmount).toBe(81); // 9% of 900
      expect(result.sgstAmount).toBe(81); // 9% of 900
      expect(result.amount).toBe(1062); // 900 + 81 + 81
    });

    test('should process item with IGST only', () => {
      const item = {
        quantity: 10,
        rate: 100,
        mrp: 120,
        discountPercent: 0,
      };

      const taxRates = {
        igstPercent: 18,
        cgstPercent: 0,
        sgstPercent: 0,
        cessPercent: 0,
      };

      const result = BillCalculationService.processBillItem(item, taxRates);

      expect(result.igstAmount).toBe(180); // 18% of 1000
      expect(result.amount).toBe(1180); // 1000 + 180
    });

    test('should use item-level taxes if provided', () => {
      const item = {
        quantity: 10,
        rate: 100,
        mrp: 120,
        discountPercent: 0,
        igstPercent: 5,
        cgstPercent: 0,
        sgstPercent: 0,
        cessPercent: 0,
      };

      const taxRates = {
        igstPercent: 18,
        cgstPercent: 9,
        sgstPercent: 9,
        cessPercent: 0,
      };

      const result = BillCalculationService.processBillItem(item, taxRates);

      expect(result.igstAmount).toBe(50); // 5% of 1000 (item-level)
      expect(result.amount).toBe(1050); // 1000 + 50
    });
  });

  describe('calculateBillTotals', () => {
    test('should calculate bill totals with CGST and SGST', () => {
      const items = [
        {
          quantity: 10,
          rate: 100,
          mrp: 120,
          discountPercent: 0,
        },
        {
          quantity: 5,
          rate: 200,
          mrp: 250,
          discountPercent: 0,
        },
      ];

      const taxes = {
        igstPercent: 0,
        cgstPercent: 9,
        sgstPercent: 9,
        cessPercent: 0,
      };

      const result = BillCalculationService.calculateBillTotals(items, 0, taxes);

      expect(result.subtotal).toBe(2000); // (10*100) + (5*200)
      expect(result.itemDiscount).toBe(0);
      expect(result.billDiscountAmount).toBe(0);
      expect(result.cgstAmount).toBe(180); // 9% of 2000
      expect(result.sgstAmount).toBe(180); // 9% of 2000
      expect(result.totalTaxAmount).toBe(360);
      expect(result.totalAmount).toBe(2360); // 2000 + 360
    });

    test('should calculate bill totals with item discount', () => {
      const items = [
        {
          quantity: 10,
          rate: 100,
          mrp: 120,
          discountPercent: 10,
        },
      ];

      const taxes = {
        igstPercent: 0,
        cgstPercent: 9,
        sgstPercent: 9,
        cessPercent: 0,
      };

      const result = BillCalculationService.calculateBillTotals(items, 0, taxes);

      expect(result.subtotal).toBe(1100); // 1000 - 100 (item discount) + 200 (taxes)
      expect(result.itemDiscount).toBe(100);
      expect(result.cgstAmount).toBe(81); // 9% of 900
      expect(result.sgstAmount).toBe(81); // 9% of 900
      expect(result.totalAmount).toBe(1062); // 900 + 162
    });

    test('should calculate bill totals with bill discount', () => {
      const items = [
        {
          quantity: 10,
          rate: 100,
          mrp: 120,
          discountPercent: 0,
        },
      ];

      const taxes = {
        igstPercent: 0,
        cgstPercent: 9,
        sgstPercent: 9,
        cessPercent: 0,
      };

      const result = BillCalculationService.calculateBillTotals(items, 10, taxes);

      expect(result.subtotal).toBe(1180); // 1000 + 180 (taxes)
      expect(result.billDiscountAmount).toBe(118); // 10% of 1180
      expect(result.cgstAmount).toBe(162); // 9% of 1800 (after discount)
      expect(result.sgstAmount).toBe(162); // 9% of 1800 (after discount)
      expect(result.totalAmount).toBe(2124); // 1800 + 324
    });

    test('should calculate bill totals with IGST', () => {
      const items = [
        {
          quantity: 10,
          rate: 100,
          mrp: 120,
          discountPercent: 0,
        },
      ];

      const taxes = {
        igstPercent: 18,
        cgstPercent: 0,
        sgstPercent: 0,
        cessPercent: 0,
      };

      const result = BillCalculationService.calculateBillTotals(items, 0, taxes);

      expect(result.subtotal).toBe(1180); // 1000 + 180 (IGST)
      expect(result.igstAmount).toBe(180); // 18% of 1000
      expect(result.totalAmount).toBe(1180); // 1000 + 180
    });

    test('should calculate bill totals with CESS', () => {
      const items = [
        {
          quantity: 10,
          rate: 100,
          mrp: 120,
          discountPercent: 0,
        },
      ];

      const taxes = {
        igstPercent: 0,
        cgstPercent: 9,
        sgstPercent: 9,
        cessPercent: 5,
      };

      const result = BillCalculationService.calculateBillTotals(items, 0, taxes);

      expect(result.subtotal).toBe(1280); // 1000 + 180 (CGST+SGST) + 100 (CESS)
      expect(result.cgstAmount).toBe(90); // 9% of 1000
      expect(result.sgstAmount).toBe(90); // 9% of 1000
      expect(result.cessAmount).toBe(100); // 5% of 1000
      expect(result.totalTaxAmount).toBe(280);
      expect(result.totalAmount).toBe(1280); // 1000 + 280
    });
  });

  describe('getPaymentStatus', () => {
    test('should return Paid when paid amount equals total', () => {
      const status = BillCalculationService.getPaymentStatus(1000, 1000);
      expect(status).toBe('Paid');
    });

    test('should return Paid when paid amount exceeds total', () => {
      const status = BillCalculationService.getPaymentStatus(1000, 1100);
      expect(status).toBe('Paid');
    });

    test('should return Partial when paid amount is between 0 and total', () => {
      const status = BillCalculationService.getPaymentStatus(1000, 500);
      expect(status).toBe('Partial');
    });

    test('should return Unpaid when paid amount is 0', () => {
      const status = BillCalculationService.getPaymentStatus(1000, 0);
      expect(status).toBe('Unpaid');
    });
  });

  describe('validateBillData', () => {
    test('should validate correct bill data', () => {
      const billData = {
        billNo: 'BILL-001',
        date: '2025-01-01',
        items: [
          {
            product: 'Product 1',
            rate: 100,
            quantity: 10,
          },
        ],
      };

      expect(() => BillCalculationService.validateBillData(billData)).not.toThrow();
    });

    test('should throw error for missing bill number', () => {
      const billData = {
        date: '2025-01-01',
        items: [
          {
            product: 'Product 1',
            rate: 100,
            quantity: 10,
          },
        ],
      };

      expect(() => BillCalculationService.validateBillData(billData)).toThrow();
    });

    test('should throw error for missing items', () => {
      const billData = {
        billNo: 'BILL-001',
        date: '2025-01-01',
        items: [],
      };

      expect(() => BillCalculationService.validateBillData(billData)).toThrow();
    });

    test('should throw error for invalid item rate', () => {
      const billData = {
        billNo: 'BILL-001',
        date: '2025-01-01',
        items: [
          {
            product: 'Product 1',
            rate: 0,
            quantity: 10,
          },
        ],
      };

      expect(() => BillCalculationService.validateBillData(billData)).toThrow();
    });

    test('should throw error for invalid item quantity', () => {
      const billData = {
        billNo: 'BILL-001',
        date: '2025-01-01',
        items: [
          {
            product: 'Product 1',
            rate: 100,
            quantity: 0,
          },
        ],
      };

      expect(() => BillCalculationService.validateBillData(billData)).toThrow();
    });
  });
});
