DROP TABLE IF EXISTS products_to_orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS sellers;
DROP TABLE IF EXISTS users;
--
CREATE TABLE users(
  id serial PRIMARY KEY,
  first_name varchar(64) NOT NULL CHECK (first_name != ''),
  last_name varchar(64) NOT NULL CHECK (last_name != ''),
  email varchar(100) NOT NULL UNIQUE CONSTRAINT "VALID EMAIL" CHECK (email != ''),
  height numeric(3, 2) CHECK (
    height > 0
    AND height < 3
  ),
  is_male bool NOT NULL,
  birthday date CHECK (
    age(birthday) < interval '120 years'
    AND birthday < (current_date + interval '1 day')
  ),
  created_at timestamp NOT NULL DEFAULT current_timestamp
);
CREATE TABLE sellers (
  id serial PRIMARY KEY,
  user_id int NOT NULL UNIQUE REFERENCES users ON DELETE CASCADE ON UPDATE CASCADE,
  "address" text,
  phone text,
  created_at timestamp NOT NULL DEFAULT current_timestamp
);
CREATE TABLE products(
  id serial PRIMARY KEY,
  "name" varchar(256) NOT NULL CHECK("name" != ''),
  price numeric(11, 2) NOT NULL CHECK(price > 0),
  quantity integer NOT NULL CHECK(quantity > 0),
  category varchar(256) NOT NULL CHECK(category != ''),
  brand varchar(256) NOT NULL CHECK (brand != ''),
  seller_id bigint NOT NULL REFERENCES sellers ON DELETE CASCADE ON UPDATE CASCADE,
  created_at timestamp NOT NULL DEFAULT current_timestamp
);
CREATE TABLE orders (
  id serial PRIMARY KEY,
  buyer_id int NOT NULL REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
  created_at timestamp NOT NULL DEFAULT current_timestamp
);
CREATE TABLE products_to_orders (
  product_id int REFERENCES products ON DELETE CASCADE ON UPDATE CASCADE,
  order_id int REFERENCES orders ON DELETE CASCADE ON UPDATE CASCADE,
  quantity int NOT NULL CHECK (quantity > 0),
  PRIMARY KEY (product_id, order_id) 
);