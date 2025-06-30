import { Pool } from "mysql2/promise";

interface Transaction {
  sender_account: number;
  receiver_account: number | null;
  amount: number;
  transaction_type: string;
  status: string;
  description?: string;
  transaction_uuid: string;
}

export class TransactionModel {
  constructor(private db: Pool) {}

  async createTransaction(tx: Transaction): Promise<void> {
    const {
      sender_account,
      receiver_account,
      amount,
      transaction_type,
      status,
      description,
      transaction_uuid,
    } = tx;

    await this.db.execute(
      `INSERT INTO transactions 
        (sender_account, receiver_account, amount, transaction_type, status, description, transaction_uuid, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        sender_account,
        receiver_account,
        amount,
        transaction_type,
        status,
        description || "",
        transaction_uuid,
      ]
    );
  }

  async performTransfer(
    sender_account: string,
    receiver_account: string,
    amount: number
  ): Promise<void> {
    const connection = await this.db.getConnection();
    try {
      await connection.beginTransaction();

      const [senderRows]: any = await connection.execute(
        "SELECT account_id, balance FROM accounts WHERE account_number = ?",
        [sender_account]
      );
      const sender = senderRows[0];
      if (!sender) throw new Error("Sender account not found");

      if (sender.balance < amount) throw new Error("Insufficient balance");

      const [receiverRows]: any = await connection.execute(
        "SELECT account_id FROM accounts WHERE account_number = ?",
        [receiver_account]
      );
      const receiver = receiverRows[0];
      if (!receiver) throw new Error("Receiver account not found");

      await connection.execute(
        "UPDATE accounts SET balance = balance - ? WHERE account_id = ?",
        [amount, sender.account_id]
      );

      await connection.execute(
        "UPDATE accounts SET balance = balance + ? WHERE account_id = ?",
        [amount, receiver.account_id]
      );

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async findAccountByAccountNumber(
    account_number: string
  ): Promise<any | null> {
    const [rows]: any = await this.db.execute(
      "SELECT * FROM accounts WHERE account_number = ?",
      [account_number]
    );
    return rows?.[0] || null;
  }

  async findAccountByUserId(user_id: number): Promise<any | null> {
    const [rows]: any = await this.db.execute(
      "SELECT * FROM accounts WHERE user_id = ?",
      [user_id]
    );
    return rows?.[0] || null;
  }

  async depositInAccount(
    account_number: string,
    amount: number
  ): Promise<void> {
    await this.db.execute(
      `UPDATE accounts SET balance = balance + ? WHERE account_number = ?`,
      [amount, account_number]
    );
  }

  async getTransactionHistory(user_id: number): Promise<any[]> {
    const [rows]: any = await this.db.execute(
      `
      SELECT 
        t.transaction_id,
        t.transaction_uuid,
        t.sender_account,
        t.receiver_account,
        t.amount,
        t.transaction_type,
        t.status,
        t.description,
        t.created_at
      FROM transactions t
      INNER JOIN accounts a_sender ON t.sender_account = a_sender.account_number
      INNER JOIN accounts a_receiver ON t.receiver_account = a_receiver.account_number
      WHERE a_sender.user_id = ? OR a_receiver.user_id = ?
      ORDER BY t.created_at DESC
      `,
      [user_id, user_id]
    );

    return rows;
  }
}
