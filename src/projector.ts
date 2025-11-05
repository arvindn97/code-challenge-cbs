import { EventStore } from './eventStore';

export class AccountProjector {
  constructor(private eventStore: EventStore, private initialBalance = 1000) {}

  getBalance(accountId: string): number {
    const events = this.eventStore.load(accountId);
    let balance = this.initialBalance;

    for (const event of events) {
      if (event.type === 'MoneyWithdrawn') {
        balance -= event.payload.amount;
      }
    }
    return balance;
  }
}
