import Database from "./database"

export const createTables = async () => {
   await Database.query(`
      CREATE TABLE veterinarios (
         id VARCHAR(40) NOT NULL,
         nome VARCHAR(60) NOT NULL,
         email VARCHAR(60) NOT NULL,
         cpf VARCHAR(12) NOT NULL,
         telefone VARCHAR(12) NOT NULL,

         PRIMARY KEY (id),
         UNIQUE (cpf)
      );
      
      CREATE TABLE clientes (
         id VARCHAR(40) NOT NULL,
         nome VARCHAR(60) NOT NULL,
         email VARCHAR(60) NOT NULL,
         cpf VARCHAR(12) NOT NULL,
         telefone VARCHAR(12) NOT NULL,

         PRIMARY KEY (id),
         UNIQUE(cpf)
      );

      CREATE TABLE administradores (
         id VARCHAR(40) NOT NULL,
         nome VARCHAR(60) NOT NULL,
         email VARCHAR(60) NOT NULL,
         senha VARCHAR(30) NOT NULL,

         PRIMARY KEY (id),
         UNIQUE (email)
      );

      CREATE TABLE pets (
         id VARCHAR(40) NOT NULL,
         nome VARCHAR(60) NOT NULL,
         idade INTEGER NOT NULL,
         clienteId VARCHAR(40) NOT NULL,
         tipo VARCHAR(80) NOT NULL,
         raca VARCHAR(80) NOT NULL,

         PRIMARY KEY (id),
         FOREIGN KEY (clienteId) REFERENCES clientes (id)
      );

      CREATE TABLE consultas (
         id VARCHAR(40) NOT NULL,
         clienteId VARCHAR(40) NOT NULL,
         petId VARCHAR(40) NOT NULL,
         veterinarioId VARCHAR(40) NOT NULL,
         data VARCHAR(8) NOT NULL,
         horario VARCHAR(6) NOT NULL,

         FOREIGN KEY (clienteId) REFERENCES clientes (id),
         FOREIGN KEY (petId) REFERENCES pets (id),
         FOREIGN KEY (veterinarioId) REFERENCES veterinarios (id)
      );
   `)
}

createTables()