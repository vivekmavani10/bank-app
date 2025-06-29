import { Pool } from "mysql2/promise";

export class DashboardModel {
  constructor(private db: Pool) {}

  async getTotalUsers(): Promise<number> {
    const [rows]: any = await this.db.query(
      "SELECT COUNT(user_id) AS total FROM users"
    );
    return rows[0].total;
  }

  async getTotalApprovedAccounts(): Promise<number> {
    const [rows]: any = await this.db.query(
      "SELECT COUNT(account_id) AS total FROM accounts WHERE status = 'approved'"
    );
    return rows[0].total;
  }

  async getTotalPendingAccounts(): Promise<number> {
    const [rows]: any = await this.db.query(
      "SELECT COUNT(account_id) AS total FROM accounts WHERE status = 'pending'"
    );
    return rows[0].total;
  }

  async getTotalTransactions(): Promise<number> {
    const [rows]: any = await this.db.query(
      "SELECT COUNT(transaction_id) AS total FROM transactions"
    );
    return rows[0].total;
  }

  async getTotalBankBalance(): Promise<number> {
    const [rows]: any = await this.db.query(
      "SELECT SUM(balance) AS total FROM accounts"
    );
    return rows[0].total || 0;
  }

  async getRecentAccountApplications(limit: number = 5): Promise<any[]> {
    const [rows]: any = await this.db.query(
      `SELECT 
       a.account_id, 
       a.user_id, 
       u.full_name,
       a.account_type,
       a.status, 
       a.created_at 
     FROM accounts a
     JOIN users u ON a.user_id = u.user_id
     ORDER BY a.created_at DESC 
     LIMIT ?`,
      [limit]
    );
    return rows;
  }

  async getRecentTransactions(limit: number = 10): Promise<any[]> {
    const [rows]: any = await this.db.query(
      `SELECT 
       t.transaction_id,
       from_acc.account_number AS sender_account,
       to_acc.account_number AS receiver_account,
       t.amount,
       t.transaction_type,
       t.status,
       t.created_at
     FROM transactions t
     LEFT JOIN accounts from_acc ON t.sender_account = from_acc.account_id
     LEFT JOIN accounts to_acc ON t.receiver_account = to_acc.account_id
     ORDER BY t.created_at DESC
     LIMIT ?`,
      [limit]
    );
    return rows;
  }
}
