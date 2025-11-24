class BillCalculationService {
  
  static calculateItemAmount(quantity, rate) {
    return parseFloat((quantity * rate).toFixed(2));
  }
  static calculateDiscountAmount(amount, discountPercent) {
    return parseFloat((amount * (discountPercent / 100)).toFixed(2));
  }

  static calculateTaxAmount(amount, taxPercent) {
    return parseFloat((amount * (taxPercent / 100)).toFixed(2));
  }

  static processBillItem(item) {
    const quantity = parseFloat(item.quantity) || 1;
    const rate = parseFloat(item.rate) || 0;
    const mrp = parseFloat(item.mrp) || rate;
    const discountPercent = parseFloat(item.discountPercent) || 0;
    const cgstPercent = parseFloat(item.cgstPercent) || 0;
    const sgstPercent = parseFloat(item.sgstPercent) || 0;

    const baseAmount = this.calculateItemAmount(quantity, rate);

    const discountAmount = this.calculateDiscountAmount(baseAmount, discountPercent);
    const amountAfterDiscount = baseAmount - discountAmount;

    const cgstAmount = this.calculateTaxAmount(amountAfterDiscount, cgstPercent);
    const sgstAmount = this.calculateTaxAmount(amountAfterDiscount, sgstPercent);

    const finalAmount = amountAfterDiscount + cgstAmount + sgstAmount;

    return {
      ...item,
      quantity,
      rate,
      mrp,
      discountPercent,
      discountAmount,
      cgstPercent,
      cgstAmount,
      sgstPercent,
      sgstAmount,
      amount: parseFloat(finalAmount.toFixed(2)),
    };
  }

  static calculateBillTotals(items, billDiscountPercent = 0, cgstPercent = 0, sgstPercent = 0) {
    const processedItems = items.map(item => this.processBillItem(item));

    const subtotal = processedItems.reduce((sum, item) => sum + (item.amount || 0), 0);

    const itemDiscount = processedItems.reduce((sum, item) => sum + (item.discountAmount || 0), 0);

    const billDiscountAmount = this.calculateDiscountAmount(subtotal, billDiscountPercent);

    const amountAfterDiscount = subtotal - billDiscountAmount;

    const billCgstAmount = this.calculateTaxAmount(amountAfterDiscount, cgstPercent);
    const billSgstAmount = this.calculateTaxAmount(amountAfterDiscount, sgstPercent);

    const totalAmount = amountAfterDiscount + billCgstAmount + billSgstAmount;

    return {
      items: processedItems,
      subtotal: parseFloat(subtotal.toFixed(2)),
      itemDiscount: parseFloat(itemDiscount.toFixed(2)),
      billDiscountPercent,
      billDiscountAmount: parseFloat(billDiscountAmount.toFixed(2)),
      cgstPercent,
      cgstAmount: parseFloat(billCgstAmount.toFixed(2)),
      sgstPercent,
      sgstAmount: parseFloat(billSgstAmount.toFixed(2)),
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      paidAmount: 0,
      dueAmount: parseFloat(totalAmount.toFixed(2)),
    };
  }

  static getPaymentStatus(totalAmount, paidAmount) {
    if (paidAmount >= totalAmount) return 'Paid';
    if (paidAmount > 0) return 'Partial';
    return 'Unpaid';
  }
  
  static validateBillData(billData) {
    const errors = [];

    if (!billData.billNo) errors.push('Bill number is required');
    if (!billData.date) errors.push('Bill date is required');
    if (!billData.items || billData.items.length === 0) errors.push('At least one item is required');

    billData.items?.forEach((item, index) => {
      if (!item.product) errors.push(`Item ${index + 1}: Product name is required`);
      if (!item.rate || parseFloat(item.rate) <= 0) errors.push(`Item ${index + 1}: Rate must be greater than 0`);
      if (!item.quantity || parseFloat(item.quantity) <= 0) errors.push(`Item ${index + 1}: Quantity must be greater than 0`);
    });

    if (errors.length > 0) {
      throw new Error(errors.join('; '));
    }

    return true;
  }
}

module.exports = BillCalculationService;
