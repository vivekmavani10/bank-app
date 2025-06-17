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
  from_account_id INT,
  to_account_id INT,
  amount DECIMAL(12,2),
  transaction_type ENUM('credit', 'debit'),
  status ENUM('success', 'failed') DEFAULT 'success',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (from_account_id) REFERENCES accounts(account_id),
  FOREIGN KEY (to_account_id) REFERENCES accounts(account_id)
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

