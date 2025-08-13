DROP TABLE IF EXISTS certificate;
CREATE TABLE certificate (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  has_receipt TINYINT(1) DEFAULT 0,
  print_size VARCHAR(20),
  pixel_size VARCHAR(20),
  resolution VARCHAR(20),
  bg_color VARCHAR(20),
  image_format VARCHAR(20) DEFAULT '无要求',
  image_file_size VARCHAR(50) DEFAULT '无要求',
  requirements VARCHAR(255),
  price DECIMAL(10,2) DEFAULT 0,
  create_time DATETIME,
  update_time DATETIME,
  delete_time DATETIME
);
