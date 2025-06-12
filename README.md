# Panda Video

Este repositório contém o front‑end, back‑end, banco de dados e cache (Redis) da aplicação de gerenciamento de vídeos "Panda Video".

---

## Execução do Projeto

Antes de qualquer coisa, certifique-se da criação dos arquivos .env de cada parte do projeto (front-end e back-end). Para isso, deixei os arquivos de exemplo no projeto, bastando copiar e colar para o arquivo real.

Para subir todos os serviços (Postgres, Redis, back‑end e front‑end), execute:

```bash
docker compose up --build
```

Em instâncias futuras, apenas:

```bash
docker compose up
```

A aplicação ficará disponível em `http://localhost:3000` (back‑end) e `http://localhost:5173` (front‑end) por padrão.

---

## Login

Para fazer o login na aplicação, deixei um usuário pré estabelecido na criação do banco. Ao rodar o comando docker, já será executado o script do banco com a inserção do usuário:
admin@teste.com
Senha: 123456

---


