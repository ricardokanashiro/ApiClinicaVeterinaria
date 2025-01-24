import { newDb, replaceQueryArgs$ } from "pg-mem"

import administradorRepository from "@repositories/administrador/administrador.repository"
import administradorServices from "./administrador.services"

jest.mock("../../database/database", () => ({
   query: jest.fn()
}))

describe("Testando métodos do Administradores Services", () => {

   const db = newDb()
   const AdministradorRepository = new administradorRepository()
   const AdministradorServices = new administradorServices(AdministradorRepository)

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

   describe("Método getAdmins()", () => {

      test("Deve retornar a lista de admins vazia", async () => {
   
         const admins = await AdministradorServices.getAdmins()
   
         expect(admins).toBeDefined()
         expect(admins.length).toBe(0)
         expect(admins).toEqual([])
      })
   })

   describe("Método createAdmins()", () => {

      test("Deve criar administrador e retornar lista", async () => {
   
         const fakeAdministrador = {
            nome: "Ricardo Kanashiro",
            email: "ricardo@email.com",
            senha: "senha123"
         }
   
         const result = await AdministradorServices.createAdmin(fakeAdministrador)
   
         expect(result).toBeDefined()
         expect(result.length).toBe(1)
         
         expect(result[0]).toBeDefined()
         expect(result[0]).toEqual(
            expect.objectContaining({
               nome: fakeAdministrador.nome,
               email: fakeAdministrador.email,
               senha: fakeAdministrador.senha
            })
         )
      })

      test("Deve não criar e disparar erro ao tentar criar administrador com email já existente", async () => {

         const fakeAdministrador = {
            nome: "Outro Ricardo",
            email: "ricardo@email.com",
            senha: "outra senha"
         }
   
         await expect(AdministradorServices.createAdmin(fakeAdministrador)).rejects.toThrow()
      })
   })

   describe("Método update()", () => {

      test("Deve atualizar administrador e retornar lista", async () => {

         const alreadyExistingAdmin = await AdministradorServices.getAdmins()
   
         const fakeData = {
            id: alreadyExistingAdmin[0].id,
            nome: "Ricardo Atualizado",
            senha: "senha atualizada"
         }
   
         const result = await AdministradorServices.updateAdmin(fakeData)
   
         expect(result).toBeDefined()
         expect(result.length).toBe(1)
         
         expect(result[0]).toBeDefined()
         expect(result[0]).toEqual(
            expect.objectContaining({
               nome: fakeData.nome,
               senha: fakeData.senha
            })
         )
      })
   
      test("Deve atualizar apenas o nome e retornar lista de administradores", async () => {
   
         const alreadyExistingAdmin = await AdministradorServices.getAdmins()
   
         const fakeData = {
            id: alreadyExistingAdmin[0].id,
            nome: "Ricardo Atualizado",
         }
   
         const result = await AdministradorServices.updateAdmin(fakeData)
   
         expect(result).toBeDefined()
         expect(result.length).toBe(1)
         
         expect(result[0]).toBeDefined()
         expect(result[0]).toEqual({ ...alreadyExistingAdmin[0], nome: "Ricardo Atualizado" })
      })

      test("Deve atualizar apenas a senha e retornar lista de administradores", async () => {
   
         const alreadyExistingAdmin = await AdministradorServices.getAdmins()
   
         const fakeData = {
            id: alreadyExistingAdmin[0].id,
            senha: "senha atualizada",
         }
   
         const result = await AdministradorServices.updateAdmin(fakeData)
   
         expect(result).toBeDefined()
         expect(result.length).toBe(1)
         
         expect(result[0]).toBeDefined()
         expect(result[0]).toEqual({ ...alreadyExistingAdmin[0], senha: "senha atualizada" })
      })
   })

   describe("Método delete()", () => {

      test("Deve excluir o usuário existente e obter lista vazia", async () => {

         const alreadyExistingAdmin = await AdministradorServices.getAdmins()

         const response = await AdministradorServices.deleteAdmin(alreadyExistingAdmin[0].id)

         expect(response).toBeDefined()
         expect(response.length).toBe(0)
         expect(response).toEqual([])
      })
   })
})