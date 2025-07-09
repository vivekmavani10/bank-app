import { Pool } from "mysql2/promise";

export class AdminAccountModel {
  constructor(private db: Pool) {}

  async getAllUserAccounts(
    search?: string,
    limit?: number,
    offset?: number
  ): Promise<any[]> {
    const parsedLimit = Number(limit);
    const parsedOffset = Number(offset);

    const safeLimit = !isNaN(parsedLimit) && parsedLimit > 0 ? parsedLimit : 10;
    const safeOffset =
      !isNaN(parsedOffset) && parsedOffset >= 0 ? parsedOffset : 0;

    let query = `
    SELECT 
      u.user_id, u.full_name, u.email, u.phone_number, u.address,
      a.account_uuid, a.account_number, a.account_type, a.balance, 
      a.nominee_name, a.nominee_relationship, a.status, a.created_at,
      k.aadhaar_number, k.pan_number, k.aadhaar_file, k.pan_file, 
      k.status AS kyc_status, k.submitted_at AS kyc_submitted_at
    FROM users u
    JOIN accounts a ON u.user_id = a.user_id
    LEFT JOIN kyc_documents k ON u.user_id = k.user_id
  `;

    const values: any[] = [];

    if (search) {
      query += `
      WHERE 
        u.full_name LIKE ? OR 
        a.account_number LIKE ?
    `;
      const keyword = `%${search}%`;
      values.push(keyword, keyword);
    }

    query += ` ORDER BY u.user_id DESC LIMIT ${safeLimit} OFFSET ${safeOffset}`;

    const [rows] = await this.db.execute(query, values);
    return rows as any[];
  }

  async getTotalUserAccountsCount(search?: string): Promise<number> {
    let query = `
    SELECT COUNT(*) as count
    FROM users u
    JOIN accounts a ON u.user_id = a.user_id
  `;

    const values: any[] = [];

    if (search) {
      query += `
      WHERE 
        u.full_name LIKE ? OR 
        a.account_number LIKE ?
    `;
      const keyword = `%${search}%`;
      values.push(keyword, keyword);
    }

    const [rows] = await this.db.execute(query, values);
    const result = rows as { count: number }[];
    return result[0]?.count || 0;
  }

  async updateAccountStatus(
    account_uuid: string,
    status: "approved" | "rejected"
  ): Promise<boolean> {
    const [rows] = await this.db.execute(
      `SELECT status FROM accounts WHERE account_uuid = ?`,
      [account_uuid]
    );

    const currentStatus = (rows as any)[0]?.status;

    if (currentStatus === status) {
      return false;
    }

    const [result] = await this.db.execute(
      `UPDATE accounts SET status = ? WHERE account_uuid = ?`,
      [status, account_uuid]
    );

    return (result as any).affectedRows > 0;
  }
}
