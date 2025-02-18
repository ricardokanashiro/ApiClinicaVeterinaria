import Database from "../../database/database"
import { IAdministradorData } from "src/types/adminInterface"

class administradorRepository {

   private static db = Database
   errorTemplate: string = "Erro no AdministradorRepository "

   async get() {

      try {
         const response = await administradorRepository.db.query(
            "SELECT * FROM administradores"
         )

         return response.rows
      }
      catch (err) {
         throw new Error(
            this.errorTemplate + "no método get() ao receber administradores: " + err
         )
      }
   }

   async create({ id, nome, email, senha }: IAdministradorData) {

      try {

         const response = await administradorRepository.db.query(
            "INSERT INTO administradores (id, nome, email, senha) VALUES ($1, $2, $3, $4) RETURNING *",
            [id, nome, email, senha]
         )

         return response.rows
      }
      catch (err) {
         throw new Error(this.errorTemplate + "no método create() ao cadastrar administrador: " + err)
      }

   }

   async update({ id, nome, senha }: IAdministradorData) {

      try {

         let query: string = "UPDATE administradores SET"
         const params = []

         if (nome) {
            query += ` nome = $${params.length + 1}`
            params.push(nome)
         }

         if (senha) {
            params.length > 0 ? query += `, senha = $${params.length + 1}` : query += ` senha = $${params.length + 1}`
            params.push(senha)
         }

         query += ` where id = $${params.length + 1} RETURNING *`
         params.push(id)

         const response = await administradorRepository.db.query(query, params)

         return response.rows
      }
      catch (err) {
         throw new Error(this.errorTemplate + "no método update() ao atualizar administrador: " + err)
      }
   }

   async delete(id: string) {

      try {
         await administradorRepository.db.query("DELETE FROM administradores WHERE id = $1", [id])
      } 
      catch (err) {
         throw new Error(this.errorTemplate + "no método delete() ao deletar administrador: " + err)
      }
   }

   async getById(id: string | undefined){

      try {
         const response = await administradorRepository.db.query(
            "SELECT * FROM administradores WHERE id = $1", [id]
         )
         
         return response.rows[0]
      } 
      catch (error) {
         throw new Error(
            this.errorTemplate 
            + "no método getById() ao encontrar administrador: " 
            + error
         )
      }
   }
}

export default administradorRepository