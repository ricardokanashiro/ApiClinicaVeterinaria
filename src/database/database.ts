import { Pool } from "pg"

import "dotenv/config"

class Database {

   private static db: Pool

   static {
      Database.db = new Pool({
         user: process.env.POSTGRES_USER,
         host: process.env.POSTGRES_HOST,
         database: process.env.POSTGRES_DB,
         password: process.env.POSTGRES_PASSWORD,
         port: parseInt(process.env.POSTGRES_PORT || '5432'),
         // ssl: true
      })

      Database.db.on("connect", () => {
         console.log("Conectado ao banco de dados!")
      })
   }

   public async query(sql: string, params: any[] = []) {  

      try {
         const result = await Database.db.query(sql, params)
         return result
      }
      catch(err: unknown) {
         throw new Error("Erro ao executar query no BD: " + err)
      }
   }

   public async closeConnection() {
      Database.db.end()
   }
}

export default new Database()