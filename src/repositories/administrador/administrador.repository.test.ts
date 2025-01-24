import { newDb, replaceQueryArgs$ } from "pg-mem"
import AdministradorRepository from "./administrador.repository"

jest.mock("../../database/database", () => ({
   query: jest.fn()
}))

describe("Testando métodos do administrador repository", () => {

   const administradorRepository = new AdministradorRepository()
   const db = newDb()

   beforeAll(() => {
      
      require("../../database/database").query.mockImplementation((sql:string, params:any[] = []) => {
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

   describe("Método get()", () => {

      test("Deve retornar lista vazia", async () => {
         
         const result = await administradorRepository.get()
   
         expect(result).toBeDefined()
         expect(result.length).toBe(0)
         expect(result).toEqual([])
      })
   })


   describe("Método create()", () => {

      test("Deve retornar administrador cadastrado", async () => {

         const fakeAdministrador = {
            id: "1",
            nome: "Ricardo Kanashiro",
            email: "ricardo@email.com",
            senha: "senha123"
         }
   
         const result = await administradorRepository.create(fakeAdministrador)
   
         expect(result).toBeDefined()
         expect(result.length).toBe(1)
         expect(result).toEqual([ fakeAdministrador ])
      })
   
      test("Não pode criar administradores com ids duplicados", async () => {
   
         const sameIdFakeAdministrador = {
            id: "1",
            nome: "Outro Ricardo",
            email: "outroricardo@email.com",
            senha: "senha123"
         }
   
         await expect(administradorRepository.create(sameIdFakeAdministrador)).rejects.toThrow()
      })
   
      test("Não pode criar administradores com emails duplicados", async () => {
   
         const sameIdFakeAdministrador = {
            id: "2",
            nome: "Outro Ricardo",
            email: "ricardo@email.com",
            senha: "senha123"
         }
   
         await expect(administradorRepository.create(sameIdFakeAdministrador)).rejects.toThrow()
      })
   })

   describe("Método update()", () => {

      test("Deve atualizar e retornar administrador", async () => {

         const fakeData = {
            nome: "Ricardo Atualizado",
            id: "1"
         }
   
         const result = await administradorRepository.update(fakeData)
   
         expect(result).toBeDefined()
         expect(result.length).toBe(1)
         expect(result).toEqual([{ ...fakeData, email: "ricardo@email.com", senha: "senha123" }])
      })
   })

   describe("Método delete()", () => {

      test("Deve deletar administradores existentes", async () => {
   
         const fakeIds = ["1", "2"]
   
         for(let id of fakeIds) {
            await administradorRepository.delete(id)
         }
   
         const result = await administradorRepository.get()
   
         expect(result).toBeDefined()
         expect(result.length).toBe(0)
         expect(result).toEqual([])
      })
   })

})