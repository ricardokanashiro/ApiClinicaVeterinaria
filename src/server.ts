import express from 'express'
import administradorRepository from './repositories/administrador/administrador.repository'

const AdministradorRepository = new administradorRepository()

const server = express()

server.use(express.json())

server.get("/", async (_, res) => {

   const r = await AdministradorRepository.get()
   res.send(r)
})

const PORT = process.env.PORT || 3000

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`))