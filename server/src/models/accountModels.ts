import { getAccountDetails } from "./../controllers/accountController";
import { Pool } from "mysql2/promise";

export interface Account {
  account_uuid: string;
  account_number: string;
  user_id: number;
  account_type: string;
  balance: number;
  nominee_name: string;
  nominee_relationship: string;
}

export interface KYC {
  user_id: number;
  aadhar_number: string;
  aadhar_file: string;
  pan_number: string;
  pan_file: string;
}

export class AccountModel {
  constructor(private db: Pool) {}

  // Generate unique 12-digit account number
  generateAccountNumber(): string {
    return Math.floor(100000000000 + Math.random() * 900000000000).toString();
  }

  // Check if user already has an account
  async findAccountByUserId(user_id: number): Promise<any | null> {
    const [rows]: any = await this.db.execute(
      "SELECT * FROM accounts WHERE user_id = ?",
      [user_id]
    );
    return rows?.[0] || null;
  }

  // Create new account
  async createAccount(account: Account): Promise<void> {
    const {
      account_uuid,
      account_number,
      user_id,
      account_type,
      balance,
      nominee_name,
      nominee_relationship,
    } = account;

    await this.db.execute(
      `INSERT INTO accounts 
        (account_uuid, account_number, user_id, account_type, balance, nominee_name, nominee_relationship, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', NOW())`,
      [
        account_uuid,
        account_number,
        user_id,
        account_type,
        balance,
        nominee_name,
        nominee_relationship,
      ]
    );
  }

  // Create KYC record
  async createKyc(kyc: KYC): Promise<void> {
    const { user_id, aadhar_number, aadhar_file, pan_number, pan_file } = kyc;

    await this.db.execute(
      `INSERT INTO kyc_documents 
        (user_id, aadhaar_number, aadhaar_file, pan_number, pan_file, status, submitted_at)
       VALUES (?, ?, ?, ?, ?, 'pending', NOW())`,
      [user_id, aadhar_number, aadhar_file, pan_number, pan_file]
    );
  }

  // Update user's address
  async updateAddress(user_id: number, address: string): Promise<void> {
    await this.db.execute("UPDATE users SET address = ? WHERE user_id = ?", [
      address,
      user_id,
    ]);
  }

  async getAccountDetails(user_id: number): Promise<any> {
    const [rows] = await this.db.execute(
      `SELECT * FROM accounts WHERE user_id = ?`,
      [user_id]
    );
    return [rows]; // so controller can destructure [rows]
  }

  async getAccountDetailsByUserId(user_id: number): Promise<any | null> {
    const [rows]: any = await this.db.execute(
      `SELECT 
         u.user_id, u.full_name, u.phone_number, u.email, u.address,
         a.account_id, a.account_number, a.account_type, a.balance, a.status,a.nominee_name, a.nominee_relationship,
         k.kyc_id, k.aadhaar_number, k.pan_number, k.status AS kyc_status
       FROM users u
       LEFT JOIN accounts a ON u.user_id = a.user_id
       LEFT JOIN kyc_documents k ON u.user_id = k.user_id
       WHERE u.user_id = ?`,
      [user_id]
    );
    return rows?.[0] || null;
  }

  // Get user_id
  async getAccountInfoByUUID(
    account_uuid: string
  ): Promise<{ user_id: number; account_number: string } | null> {
    const [rows]: any = await this.db.execute(
      "SELECT user_id, account_number FROM accounts WHERE account_uuid = ?",
      [account_uuid]
    );
    if (rows.length > 0) {
      return {
        user_id: rows[0].user_id,
        account_number: rows[0].account_number,
      };
    }
    return null;
  }
  async deleteTransactionsBySender(account_number: string): Promise<void> {
    await this.db.execute("DELETE FROM transactions WHERE sender_account = ?", [
      account_number,
    ]);
  }
  async deleteAccount(account_uuid: string): Promise<void> {
    await this.db.execute("DELETE FROM accounts WHERE account_uuid = ?", [
      account_uuid,
    ]);
  }
  async deleteKycByUserId(user_id: number): Promise<void> {
    await this.db.execute("DELETE FROM kyc_documents WHERE user_id = ?", [
      user_id,
    ]);
  }
}
