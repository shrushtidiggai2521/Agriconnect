-- =========================================================
-- AgriConnect Database - User Module
-- =========================================================

CREATE DATABASE IF NOT EXISTS agriconnect_db;
USE agriconnect_db;

DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100)  NOT NULL,
    email       VARCHAR(150)  NOT NULL,
    phone       VARCHAR(15)   NOT NULL,
    password    VARCHAR(255)  NOT NULL,
    role        ENUM('FARMER', 'BUYER', 'SUPPLIER') NOT NULL,
    location    VARCHAR(150),
    created_at  DATETIME      NOT NULL,

    CONSTRAINT uk_users_email UNIQUE (email)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE INDEX idx_users_role ON users (role);
CREATE INDEX idx_users_location ON users (location);
