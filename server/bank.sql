-- 1. Users
CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  user_uuid VARCHAR(100) NOT NULL,
  full_name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  phone_number VARCHAR(15) UNIQUE,
  password_hash VARCHAR(255),
  role ENUM('customer', 'admin') DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Accounts
CREATE TABLE accounts (
  account_id INT AUTO_INCREMENT PRIMARY KEY,
  account_number VARCHAR(20) UNIQUE,
  user_id INT,
  account_type ENUM('savings', 'current') DEFAULT 'savings',
  balance DECIMAL(12,2) DEFAULT 0.00,
  status ENUM('pending', 'active', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 3. KYC Documents
CREATE TABLE kyc_documents (
  kyc_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  aadhaar_number VARCHAR(20),
  pan_number VARCHAR(20),
  aadhaar_file VARCHAR(255),
  pan_file VARCHAR(255),
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 4. Transactions
CREATE TABLE transactions (
  transaction_id INT AUTO_INCREMENT PRIMARY KEY,
  sender_account INT,
  receiver_account INT,
  amount DECIMAL(12,2),
  transaction_type ENUM('credit', 'debit'),
  status ENUM('success', 'failed') DEFAULT 'success',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_account) REFERENCES accounts(account_id),
  FOREIGN KEY (receiver_account) REFERENCES accounts(account_id)
);

-- 5. Notifications (optional)
CREATE TABLE notifications (
  notification_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  message TEXT,
  seen BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- remove unique email
ALTER TABLE `bank`.`users` 
DROP INDEX `email_UNIQUE` ;
;


-- add column in accounts table
ALTER TABLE `bank`.`accounts` 
ADD COLUMN `nominee_name` VARCHAR(100) NULL DEFAULT NULL AFTER `created_at`,
ADD COLUMN `nominee_relationship` VARCHAR(45) NULL DEFAULT NULL AFTER `nominee_name`;


-- add column in users table
ALTER TABLE `bank`.`users` 
ADD COLUMN `address` VARCHAR(200) NULL DEFAULT NULL AFTER `created_at`;


-- change data type
ALTER TABLE `bank`.`accounts` 
CHANGE COLUMN `account_type` `account_type` VARCHAR(50) NULL DEFAULT 'savings' ,

-- add column in accounts table
ALTER TABLE `bank`.`accounts` 
ADD COLUMN `account_uuid` VARCHAR(50) NULL AFTER `nominee_relationship`;