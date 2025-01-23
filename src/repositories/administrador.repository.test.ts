import { newDb, replaceQueryArgs$ } from "pg-mem"
import AdministradorRepository from "./administrador.repository"

jest.mock("../database/database", () => ({
   query: jest.fn()
}))

describe("Testando métodos do administrador repository", () => {

   const administradorRepository = new AdministradorRepository()
   const db = newDb()

   beforeAll(() => {
      
      require("../database/database").query.mockImplementation((sql:string, params:any[] = []) => {
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

   test("Método get() deve retornar lista vazia", async () => {
      
      const result = await administradorRepository.get()

      expect(result).toBeDefined()
      expect(result.length).toBe(0)
      expect(result).toEqual([])
   })

   test("Método create() deve retornar administrador cadastrado", async () => {

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

   test("Método get() não pode criar administradores com ids duplicados", async () => {

      const sameIdFakeAdministrador = {
         id: "1",
         nome: "Outro Ricardo",
         email: "outroricardo@email.com",
         senha: "senha123"
      }

      await expect(administradorRepository.create(sameIdFakeAdministrador)).rejects.toThrow()
   })

   test("Método get() não pode criar administradores com emails duplicados", async () => {

      const sameIdFakeAdministrador = {
         id: "2",
         nome: "Outro Ricardo",
         email: "ricardo@email.com",
         senha: "senha123"
      }

      await expect(administradorRepository.create(sameIdFakeAdministrador)).rejects.toThrow()
   })

   test("Método update() deve atualizar e retornar administrador", async () => {

      const fakeData = {
         nome: "Ricardo Atualizado",
         id: "1"
      }

      const result = await administradorRepository.update(fakeData)

      expect(result).toBeDefined()
      expect(result.length).toBe(1)
      expect(result).toEqual([{ ...fakeData, email: "ricardo@email.com", senha: "senha123" }])
   })

   test("Método delete() deve deletar administrador", async () => {

      const fakeId = "1"
      await administradorRepository.delete(fakeId)

      const result = await administradorRepository.get()

      expect(result).toBeDefined()
      expect(result.length).toBe(0)
      expect(result).toEqual([])
   })
})