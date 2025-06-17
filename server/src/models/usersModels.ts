import { Pool } from "mysql2/promise";

export interface User {
  user_uuid: string;
  full_name: string;
  email: string;
  phone_number: string;
  password_hash: string;
}

export class UsersModel {
  constructor(private db: Pool) {}

  // Find user by phone number
  async findUserByPhone(phone: string): Promise<User | null> {
    const [rows] = await this.db.execute("SELECT * FROM users WHERE phone_number = ?", [phone]);
    const result = Array.isArray(rows) && rows.length > 0 ? (rows[0] as User) : null;
    return result;
  }

  // Create new user
  async createUser(user: User): Promise<number> {
    const { user_uuid, full_name, email, phone_number, password_hash } = user;

    const [result]: any = await this.db.execute(
      `INSERT INTO users (user_uuid, full_name, email, phone_number, password_hash, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [user_uuid, full_name, email, phone_number, password_hash]
    );

    return result.insertId;
  }
}
