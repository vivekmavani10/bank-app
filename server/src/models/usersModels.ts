import { Pool } from "mysql2/promise";

export interface User {
  user_id?: number;
  user_uuid: string;
  full_name: string;
  email: string;
  phone_number: string;
  role: string;
  password_hash: string;
}

export class UsersModel {
  constructor(private db: Pool) {}

  // 🔍 Find user by phone number
  async findUserByPhone(phone: string): Promise<User | null> {
    const [rows] = await this.db.execute(
      "SELECT * FROM users WHERE phone_number = ? LIMIT 1",
      [phone]
    );

    const result = Array.isArray(rows) && rows.length > 0 ? (rows[0] as User) : null;
    return result;
  }

  // ➕ Create a new user
  async createUser(user: User): Promise<number> {
    const { user_uuid, full_name, email, phone_number, password_hash } = user;

    const [result]: any = await this.db.execute(
      `INSERT INTO users 
        (user_uuid, full_name, email, phone_number, password_hash, role, created_at)
       VALUES (?, ?, ?, ?, ?, 'customer', NOW())`,
      [user_uuid, full_name, email, phone_number, password_hash]
    );

    return result.insertId;
  }
}
