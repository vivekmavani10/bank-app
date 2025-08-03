import { editQuery } from "./../controllers/queryController";
import { Pool } from "mysql2/promise";

interface Query {
  query_uuid: string;
  query: string;
  user_id: number;
}

export class QueryModel {
  constructor(private db: Pool) {}

  async submitQuery(queryInter: Query): Promise<void> {
    const { query_uuid, query, user_id } = queryInter;

    await this.db.execute(
      `INSERT INTO query
            (query_uuid, user_id, query, created_at, is_customer_read, is_admin_read, is_replied)
            VALUES (?, ?, ?, NOW(), 0, 0, 0)`,
      [query_uuid, user_id, query]
    );
  }

  async editQuery(queryInter: Query): Promise<void> {
    const { query_uuid, query } = queryInter;

    await this.db.execute(
      `UPDATE query
            SET query = ?, updated_at = NOW()
            WHERE query_uuid = ?`,
      [query, query_uuid]
    );
  }

  async deleteQuery(query_uuid: string): Promise<void> {
    await this.db.execute(`DELETE FROM query WHERE query_uuid = ?`, [
      query_uuid,
    ]);
  }
}
