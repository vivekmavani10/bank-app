import { dbPool } from "../config/db";

export class AuthModel {
  async findByPhoneNumber(phone_number: string) {
    const [rows]: any = await dbPool.execute(
      "SELECT * FROM users WHERE phone_number = ?",
      [phone_number]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async updatePassword(
    user_id: number,
    password_hash: string
  ): Promise<boolean> {
    const [result]: any = await dbPool.execute(
      "UPDATE users SET password_hash = ? WHERE user_id = ?",
      [password_hash, user_id]
    );
    return result.affectedRows > 0;
  }
}
