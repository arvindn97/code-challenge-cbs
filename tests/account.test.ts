import { EventStore } from '../src/eventStore';
import { CommandHandler } from '../src/commandHandler';
import { AccountProjector } from '../src/projector';

describe('Withdraw Money Flow', () => {
  let store: EventStore;
  let handler: CommandHandler;
  const initialBalance = 1000;
  const accountId = 'acc-1';

  beforeEach(() => {
    store = new EventStore();
    handler = new CommandHandler(store, initialBalance);
  });

  test('successful withdrawal reduces balance', () => {
    handler.handleWithdraw({ accountId: accountId, amount: 200 });
    const projector = new AccountProjector(store, initialBalance);
    expect(projector.getBalance(accountId)).toBe(800);
  });

  test('multiple withdrawals work cumulatively', () => {
    handler.handleWithdraw({ accountId: accountId, amount: 200 });
    handler.handleWithdraw({ accountId: accountId, amount: 100 });
    const projector = new AccountProjector(store, initialBalance);
    expect(projector.getBalance(accountId)).toBe(700);
  });

  test('insufficient balance emits event and does not change balance', () => {
    const res = handler.handleWithdraw({ accountId: accountId, amount: 2000 });
    expect(res.success).toBe(false);
    const projector = new AccountProjector(store, initialBalance);
    expect(projector.getBalance(accountId)).toBe(1000);
  });

  test('negative withdrawal throws error', () => {
    expect(() => handler.handleWithdraw({ accountId: accountId, amount: -100 }))
      .toThrow('Withdrawal must be > 0');
  });
});
