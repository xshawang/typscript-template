import Decimal from 'decimal.js';

export class MathUtil {
  // 相加
  static add(a: number | string | null, b: number | string | null): number {
    try {
      return new Decimal(a || 0).plus(b || 0).toNumber();
    } catch {
      return 0;
    }
  }

  // 相减
  static sub(a: number | string | null, b: number | string | null): number {
    try {
      return new Decimal(a || 0).minus(b || 0).toNumber();
    } catch {
      return 0;
    }
  }

  // 相乘
  static mul(a: number | string | null, b: number | string | null): number {
    try {
      return new Decimal(a || 0).times(b || 0).toNumber();
    } catch {
      return 0;
    }
  }

  // 相除（防止除以 0 返回 NaN）
  static div(a: number | string | null, b: number | string | null): number {
    try {
      const divisor = new Decimal(b || 0);
      if (divisor.isZero()) {
        return 0;
      }
      return new Decimal(a || 0).div(divisor).toNumber();
    } catch {
      return 0;
    }
  }

  static getMultiplierToTarget(
    currentBalance: number,
    targetAmount: number,
    betAmount: number,
  ) {
    if (betAmount <= 0) {
      throw new Error('投注金额必须大于0');
    }
    const required = targetAmount - currentBalance;
    if (required <= 0) {
      return 0; // 已经达到或超过目标金额，无需投注
    }
    return Math.ceil(required / betAmount);
  }
}
