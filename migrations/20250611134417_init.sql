-- +goose Up
-- +goose StatementBegin
CREATE TABLE companies (
  id integer PRIMARY KEY AUTOINCREMENT,
  name text NOT NULL,
  cnpj text UNIQUE NOT NULL,
  cep text NOT NULL,
  whatsapp_number text UNIQUE NOT NULL,
  banner blob,
  updated_at integer,
  created_at integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE users (
  id integer PRIMARY KEY AUTOINCREMENT,
  company_id integer NOT NULL,
  name text NOT NULL,
  password text NOT NULL,
  email text UNIQUE NOT NULL,
  updated_at integer,
  created_at integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (company_id) REFERENCES companies (id)
);

CREATE TABLE categories (
  id integer PRIMARY KEY AUTOINCREMENT,
  name text NOT NULL
);

CREATE TABLE products (
  id integer PRIMARY KEY AUTOINCREMENT,
  company_id integer NOT NULL,
  category_id text NOT NULL,
  name text NOT NULL,
  description text,
  image blob,
  sku text NOT NULL,
  retail_price real DEFAULT 0,
  wholesale_price real DEFAULT 0,
  unit text NOT NULL,
  updated_at integer,
  created_at integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (company_id) REFERENCES companies (id),
  FOREIGN KEY (category_id) REFERENCES categories (id)
);

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TABLE categories;

DROP TABLE products;

DROP TABLE users;

DROP TABLE companies;

-- +goose StatementEnd
