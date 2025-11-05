import { EventStore } from './eventStore';
import { AccountProjector } from './projector';
import { WithdrawMoneyCommand } from './commands';
import { MoneyWithdrawnEvent, InsufficientFundsEvent } from './events';

export class CommandHandler {
  private projector: AccountProjector;

  constructor(private eventStore: EventStore, initialBalance = 1000) {
    this.projector = new AccountProjector(eventStore, initialBalance);
  }

  handleWithdraw(command: WithdrawMoneyCommand) {
    const { accountId, amount } = command;

    if (!Number.isFinite(amount)) throw new Error('Amount must be a number');
    if (amount <= 0) throw new Error('Withdrawal must be > 0');

    const balance = this.projector.getBalance(accountId);

    if (amount > balance) {
      const event: InsufficientFundsEvent = {
        type: 'InsufficientFunds',
        accountId,
        payload: { attemptedAmount: amount, balance },
        timestamp: Date.now(),
      };
      this.eventStore.append(accountId, event);
      return { success: false, reason: 'INSUFFICIENT_FUNDS', event };
    }

    const event: MoneyWithdrawnEvent = {
      type: 'MoneyWithdrawn',
      accountId,
      payload: { amount },
      timestamp: Date.now(),
    };
    this.eventStore.append(accountId, event);

    return { success: true, event };
  }
}
