-- Create database if not exists
CREATE DATABASE IF NOT EXISTS homenest;
USE homenest;

-- Create groceries table
CREATE TABLE IF NOT EXISTS groceries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(100) NOT NULL,
    quantity INT DEFAULT 1,
    unit VARCHAR(20) DEFAULT 'Pcs',
    category VARCHAR(50) DEFAULT 'Others',
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
