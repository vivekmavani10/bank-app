import { Pool } from "mysql2/promise";

export interface User {
  user_uuid: string;
  full_name: string;
  email: string;
  phone_number: string;
  password_hash: string;
}

export class UsersModel {
  private db: Pool;

  constructor(dbPool: Pool) {
    this.db = dbPool;
  }

  async findUserByPhone(phone_number: string): Promise<any> {
    const [rows] = await this.db.execute(
      "SELECT * FROM users WHERE phone_number = ?",
      [phone_number]
    );
    return Array.isArray(rows) ? rows[0] : null;
  }

  async createUser(user: User): Promise<number> {
    const {
      user_uuid,
      full_name,
      email,
      phone_number,
      password_hash,
    } = user;

    const [result]: any = await this.db.execute(
      `INSERT INTO users (user_uuid, full_name, email, phone_number, password_hash, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [user_uuid, full_name, email, phone_number, password_hash]
    );

    return result.insertId;
  }
}
