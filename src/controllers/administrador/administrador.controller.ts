import { Request, Response } from "express"
import AdministradorServices from "@services/administrador/administrador.services"

class AdministradorController {

   private services: AdministradorServices

   constructor(administradorServices: AdministradorServices) {
      this.services = administradorServices
   }

   public async getAdmins(req: Request, res: Response) {
      
      try {
         const admins = await this.services.getAdmins()
         return res.status(200).json(admins)
      } 
      catch (err) {
         return res.status(500).json("Erro no controller ao obter administradores: " + err)
      }
   }

   public async createAdmin(req: Request, res: Response) {

      try {
         const { nome, email, senha } = req.body
         const admins = await this.services.createAdmin({ nome, email, senha })
         return res.status(200).json(admins)
      } 
      catch (err) {
         return res.status(500).json("Erro no controller ao cadastrar administrador: " + err)
      }
   }

   public async updateAdmin(req: Request, res: Response) {

      try {
         const { nome, senha, id } = req.body
         const admins = await this.services.updateAdmin({  nome, senha, id })
         return res.status(200).json(admins)
      } 
      catch (err) {
         return res.status(500).json("Erro no controller ao atualizar administrador: " + err)
      }
   }

   public async deleteAdmin(req: Request, res: Response) {

      try {
         const { id } = req.params
         console.log(id)
         const admins = await this.services.deleteAdmin(id)
         return res.status(200).json(admins)
      } 
      catch (err) {
         return res.status(500).json("Erro no controller ao deletar administrador: " + err)
      }
   }
}

export default AdministradorController