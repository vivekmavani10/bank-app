import { Pool } from "mysql2/promise";

export class AdminAccountModel {
  constructor(private db: Pool) {}

  async getAllUserAccounts(): Promise<any[]> {
    const [rows] = await this.db.execute(
      `SELECT 
      u.user_id, u.full_name, u.email, u.phone_number, u.address,
      a.account_uuid, a.account_number, a.account_type, a.balance, 
      a.nominee_name, a.nominee_relationship, a.status, a.created_at,
      k.aadhaar_number, k.pan_number, k.aadhaar_file, k.pan_file, k.status AS kyc_status, k.submitted_at AS kyc_submitted_at
     FROM users u
     JOIN accounts a ON u.user_id = a.user_id
     LEFT JOIN kyc_documents k ON u.user_id = k.user_id`
    );
    return rows as any[];
  }

  async updateAccountStatus(
    account_uuid: string,
    status: "approved" | "rejected"
  ): Promise<boolean> {
    // Step 1: Get current status
    const [rows] = await this.db.execute(
      `SELECT status FROM accounts WHERE account_uuid = ?`,
      [account_uuid]
    );

    const currentStatus = (rows as any)[0]?.status;

    // Step 2: Prevent updating if the new status is same as current
    if (currentStatus === status) {
      return false; // No change needed
    }

    // Step 3: Update status
    const [result] = await this.db.execute(
      `UPDATE accounts SET status = ? WHERE account_uuid = ?`,
      [status, account_uuid]
    );

    return (result as any).affectedRows > 0;
  }
}
