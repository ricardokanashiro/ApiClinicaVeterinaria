import express from 'express'

const server = express()

server.use(express.json())

const PORT = process.env.PORT || 3000

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`))