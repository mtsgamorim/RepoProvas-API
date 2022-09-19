# <p align = "center"> Projeto RepoProvas API </p>

<p align = "center">
   <img src="https://img.shields.io/badge/author-Matheus Amorim-4dae71?style=flat-square" />
   <img src="https://img.shields.io/github/languages/count/mtsgamorim/RepoProvas-API?color=4dae71&style=flat-square" />
</p>

## :clipboard: Descrição

Sistema de compartilhamento de provas entre estudantes, onde qualquer pessoa pode procurar provas antigas de suas disciplinas e professores ou enviar provas antigas para ajudar outros estudantes.

---

## :computer: Tecnologias e Conceitos

- REST APIs
- JWTs & refresh tokens
- Node.js
- TypeScript
- Postgres with Prisma
- Jest & supertest

---

## :rocket: Rotas

```yml
POST /sign-up
    - Rota para cadastro usuario
    - headers: {}
    - body: {
    "email": "lorem@gmail.com",
    "password": "loremipsum",
    "confirmPassword": "loremipsum"
    }
```

```yml
POST /sign-in
    - Rota para fazer login
    - headers: {}
    - body: {
        "email": "lorem@gmail.com",
        "password": "loremipsum"
        }
```

```yml
Post /tests (autenticada)
    - Rota para adicionar provas ao sistema
    - headers: { "Authorization": "Bearer $token" }
    - body: {
        "name": "loremipsum",
        "pdfUrl": "https://www.loremipsum.com/",
        "category": "loremipsum",
        "discipline": "loremipsum",
        "teacher": "loremipsum"
     }
```

```yml
GET /tests/discipline (autenticada)
    - Rota para listar todos os testes por disciplina e periodos
    - headers: { "Authorization": "Bearer $token" }
    - body: {}
```

```yml
GET tests/teacher (autenticada)
    - Rota para listar todos os testes por professor
    - headers: { "Authorization": "Bearer $token" }
    - body: {}
```

---

## 🏁 Rodando a aplicação

Essa API possui deploy em : https://repoprovas-mts.herokuapp.com/

Para rodar na máquina:

Primeiro, faça o clone desse repositório na sua maquina:

```
git clone https://github.com/mtsgamorim/RepoProvas-API.git
```

Depois, dentro da pasta, rode o seguinte comando para instalar as dependencias.

```
npm install
```

Depois, modifique a pasta .env-example para .env e preencha as configurações

Depois, gere o banco com o comando:

```
npx prisma migrate dev

```

Depois, coloque os seeds no banco, note que ele é necessário pois possui as categorias, os periodos e os professores cadastrados no sitema:

```
npx prisma db seed
```

Finalizado o processo, é só inicializar o servidor

```
npm run dev
```

Caso queira adicionar novos professores, periodos ou disciplinas, modifique o arquivo seed na pasta prisma ou rode comandos SQL no seu banco de dados.
