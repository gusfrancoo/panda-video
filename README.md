# Panda Video

Este repositório contém o front‑end, back‑end, banco de dados da aplicação de gerenciamento de vídeos **Panda Video**.

---

## Pré-requisitos

Antes de iniciar, copie os arquivos de exemplo de ambiente para criar os `.env`:

- No diretório `back-end`:
  ```bash
  cp .env.example .env
  ```
- No diretório `front-end`:
  ```bash
  cp .env.example .env
  ```

---

## Execução do Projeto

Para subir todos os serviços (Postgres, Redis, back‑end e front‑end), execute na raiz:

```bash
docker compose up --build
```

Nas próximas vezes, apenas:

```bash
docker compose up
```

A aplicação ficará disponível em:

- **Back‑end**: `http://localhost:3000`
- **Front‑end**: `http://localhost:5173`

---

## Login Padrão

Um usuário de exemplo é inserido automaticamente no banco:

- **E-mail**: `admin@teste.com`
- **Senha**: `123456`

Use essas credenciais para acessar a aplicação.


