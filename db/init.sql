-- 1) Garante que o schema public exista
CREATE SCHEMA IF NOT EXISTS public;

-- 2) Cria a tabela de usuários, se ainda não existir
CREATE TABLE IF NOT EXISTS public.users (
  id            BIGINT        PRIMARY KEY,
  email         VARCHAR(255)  UNIQUE NOT NULL,
  password_hash VARCHAR(255)  NOT NULL
);

-- 3) Insere um usuário de exemplo (não falha em re-runs)
INSERT INTO public.users (id, email, password_hash)
VALUES
  (1, 'admin@teste.com', '$2a$12$g6sjZBLy.IgigAcUQHBvB.svv6VNfkxKddykSsdLseZIY0Pjr00We')
ON CONFLICT (id) DO NOTHING;
