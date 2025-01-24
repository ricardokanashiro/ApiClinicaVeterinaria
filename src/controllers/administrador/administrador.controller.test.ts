import { newDb, replaceQueryArgs$ } from "pg-mem"
import { Request, Response } from "express"

import AdministradorRepository from "@repositories/administrador/administrador.repository"
import AdministradorServices from "@services/administrador/administrador.services"
import AdministradorController from "./administrador.controller"

jest.mock("../../database/database", () => ({
   query: jest.fn()
}))

describe("Testando Métodos do Administrador Controller", () => {

   const administradorRepository = new AdministradorRepository()
   const administradorServices = new AdministradorServices(administradorRepository)
   const administradorController = new AdministradorController(administradorServices)
   const db = newDb()

   beforeAll(() => {

      require("../../database/database").query.mockImplementation((sql: string, params: any[] = []) => {
         const queryWithParams = replaceQueryArgs$(sql, params)
         return db.public.query(queryWithParams)
      })

      db.public.none(`
         CREATE TABLE administradores (
            id VARCHAR(40) NOT NULL,
            nome VARCHAR(60) NOT NULL,
            email VARCHAR(60) NOT NULL,
            senha VARCHAR(30) NOT NULL,

            PRIMARY KEY (id),
            UNIQUE (email)
         );
      `)
   })

   test("O método getAdmins() deve obter lista de administradores e retornar código 200", async () => {
      const request = {} as Request
      const response = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response

      await administradorController.getAdmins(request, response)

      expect(response.status).toHaveBeenCalledWith(200)
      expect(response.json).toHaveBeenCalledWith([])
   })

   test("O método createAdmin() deve criar administrador e retornar código 200", async () => {

      const body = {
         nome: "Ricardo Kanashiro",
         email: "ricardo@email.com",
         senha: "senha123"
      }

      const request = { body } as Request
      const response = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response
      
      await administradorController.createAdmin(request, response)

      expect(response.status).toHaveBeenCalledWith(200)
      expect(response.json).toHaveBeenCalledWith(
         expect.arrayContaining([
            expect.objectContaining(body)
         ])
      )
   })

   test("O método updateAdmin() deve atualizar administrador e retornar código 200", async () => {

      const alreadyExistingAdmin = await administradorServices.getAdmins()

      const body = {
         nome: "Ricardo Atualizado",
         senha: "senha atualizada",
         id: alreadyExistingAdmin[0].id
      }

      const request = { body } as Request
      const response = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response

      await administradorController.updateAdmin(request, response)
      
      expect(response.status).toHaveBeenCalledWith(200)
      expect(response.json).toHaveBeenCalledWith(
         expect.arrayContaining([
            expect.objectContaining(body)
         ])
      )
   })

   test("O método deleteAdmin() deve deletar o administrador e retornar código 200", async () => {

      const alreadyExistingAdmin = await administradorServices.getAdmins()

      const params = { id: alreadyExistingAdmin[0].id }

      const request = { params } as Partial<Request> as Request
      const response = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response

      await administradorController.deleteAdmin(request, response)

      expect(response.status).toHaveBeenCalledWith(200)
      expect(response.json).toHaveBeenCalledWith([])
   })
})