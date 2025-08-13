DROP TABLE IF EXISTS licenses;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(64) NOT NULL
);

INSERT INTO users(id, username, password_hash) VALUES (
  1,
  'admin',
  '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'
);

CREATE TABLE licenses (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  badge VARCHAR(50),
  print_size VARCHAR(20) NOT NULL,
  pixel_size VARCHAR(20) NOT NULL
);

INSERT INTO licenses(id, name, badge, print_size, pixel_size) VALUES (
  1,
  '身份证',
  '含回执',
  '26x32mm',
  '358x441px'
);
