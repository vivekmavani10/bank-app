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
       t.sender_account AS sender_account,
       t.receiver_account AS receiver_account,
       t.amount,
       t.transaction_type,
       t.status,
       t.created_at,
       from_acc.full_name AS sender_name,
       to_acc.full_name AS receiver_name
     FROM transactions t
     LEFT JOIN accounts a1 ON t.sender_account = a1.account_number
     LEFT JOIN users from_acc ON a1.user_id = from_acc.user_id
     LEFT JOIN accounts a2 ON t.receiver_account = a2.account_number
     LEFT JOIN users to_acc ON a2.user_id = to_acc.user_id
     ORDER BY t.created_at DESC
     LIMIT ?`,
    [limit]
  );
  return rows;
}
  
}
