import { v4 as uuidV4 } from "uuid"
import administradorRepository from "../../repositories/administrador/administrador.repository"
import { IAdministradorData } from "src/types/adminInterface"

class administradorServices {

   private repository: administradorRepository
   private errorTemplate: string = "Erro no Administrador Services "
   private emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
   private uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

   constructor(administradorRepository: administradorRepository) {
      this.repository = administradorRepository
   }

   public async getAdmins() {
      const admins = await this.repository.get()
      return admins
   }

   public async createAdmin({ nome, email, senha }: IAdministradorData) {
      
      const id = uuidV4()

      if(!this.isNomeValid(nome)) {
         throw new Error(this.errorTemplate + "no método createAdmin(): nome inválido!")
      }

      if(!this.isEmailValid(email)) {
         throw new Error(this.errorTemplate + "no método createAdmin(): email inválido!")
      }

      if(!this.isSenhaValid(senha)) {
         throw new Error(this.errorTemplate + "no método createAdmin(): senha inválida!")
      }

      const admins = await this.repository.create({ id, nome, email, senha })
      return admins
   }

   public async updateAdmin({ nome, senha, id }: IAdministradorData) {

      if(!this.isIdValid(id)) {
         throw new Error(this.errorTemplate + "no método updateAdmin(): id inválido!")
      }

      const foundAdmin = await this.repository.getById(id)

      if(!foundAdmin || Object.keys(foundAdmin).length === 0) {
         throw new Error(this.errorTemplate + "no método updateAdmin(): administrador não encontrado!")
      }
      
      if(nome && !this.isNomeValid(nome)) {
         throw new Error(this.errorTemplate + "no método updateAdmin(): nome inválido!")
      }

      if(senha && !this.isSenhaValid(senha)) {
         throw new Error(this.errorTemplate + "no método updateAdmin(): senha inválida!")
      }

      const admins = await this.repository.update({ nome, senha, id })
      return admins
   }

   public async deleteAdmin(id: string) {

      if(!this.isIdValid(id)) {
         throw new Error(this.errorTemplate + "no método deleteAdmin(): id inválido!")
      }

      await this.repository.delete(id)
      const admins = await this.repository.get()
      return admins
   }

   private isNomeValid(nome: any) {

      if(
         !nome || 
         typeof nome !== "string" ||
         !nome.trim() ||
         nome.length > 60
      ) {
         return false
      }

      return true
   }

   private isEmailValid(email: any) {

      if(
         !email || 
         typeof email !== "string" ||
         !email.trim() || 
         !this.emailRegex.test(email) || 
         email.length > 60
      ) {
         return false
      }

      return true
   }

   private isSenhaValid(senha: any) {

      if(
         !senha || 
         typeof senha !== "string" ||
         !senha.trim() || 
         senha.length > 30
      ) {
         return false
      }

      return true
   }

   private isIdValid(id: any) {

      if(typeof id !== "string" || !this.uuidRegex.test(id)) {
         return false
      }

      return true
   }
}

export default administradorServices