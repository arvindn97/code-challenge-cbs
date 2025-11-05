export type EventBase<T extends string, P> = {
  type: T;
  accountId: string;
  payload: P;
  timestamp: number;
};

// Example events for our system
export type MoneyWithdrawnEvent = EventBase<'MoneyWithdrawn', { amount: number }>;
export type InsufficientFundsEvent = EventBase<'InsufficientFunds', { attemptedAmount: number; balance: number }>;

export type AccountEvent = MoneyWithdrawnEvent | InsufficientFundsEvent;
