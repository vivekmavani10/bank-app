import { Pool } from "mysql2/promise";

export interface User {
  user_id?: number;
  user_uuid: string;
  full_name: string;
  email: string;
  phone_number: string;
  role: string;
  password_hash: string;
  address?: string;
}

export class UsersModel {
  constructor(private db: Pool) {}

  async findUserByPhone(phone: string): Promise<User | null> {
    const [rows] = await this.db.execute(
      "SELECT * FROM users WHERE phone_number = ? LIMIT 1",
      [phone]
    );

    const result =
      Array.isArray(rows) && rows.length > 0 ? (rows[0] as User) : null;
    return result;
  }

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

  async getUserById(user_id: number): Promise<User | null> {
    const [rows] = await this.db.execute(
      "SELECT user_id, user_uuid, full_name, email, phone_number, address FROM users WHERE user_id = ?",
      [user_id]
    );

    const result =
      Array.isArray(rows) && rows.length > 0 ? (rows[0] as User) : null;
    return result;
  }

  async updateUserById(
    user_id: number,
    data: {
      full_name: string;
      email: string;
      phone_number: string;
      address: string;
    }
  ): Promise<boolean> {
    const [result]: any = await this.db.execute(
      `UPDATE users 
     SET full_name = ?, email = ?, phone_number = ?, address = ? 
     WHERE user_id = ?`,
      [data.full_name, data.email, data.phone_number, data.address, user_id]
    );

    return result.affectedRows > 0;
  }
}
