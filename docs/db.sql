DROP DATABASE IF EXISTS epiceats;
CREATE DATABASE epiceats;
USE epiceats;

CREATE TABLE menu_item (
    id BIGINT AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    img VARCHAR(255),
    category ENUM('BURGER', 'PIZZA', 'BEVERAGE', 'SIDES', 'DESSERT', 'SPECIALS') NOT NULL,
	quantity INT NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id)
);

CREATE TABLE sales_package (
    id BIGINT AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    discount_percentage DECIMAL(5, 2) NOT NULL DEFAULT 0.0,
    is_deleted BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id)
);

CREATE TABLE sales_package_item (
	id BIGINT AUTO_INCREMENT,
    package_id BIGINT NOT NULL,
    item_id BIGINT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
	is_deleted BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id),
    FOREIGN KEY (package_id) REFERENCES sales_package(id),
    FOREIGN KEY (item_id) REFERENCES menu_item(id)
);

CREATE TABLE employee (
    id BIGINT AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    address VARCHAR(255),
    salary DECIMAL(10, 2) NOT NULL DEFAULT 0.0,
    role ENUM('CASHIER', 'MANAGER', 'CHEF', 'WAITER', 'SUPERVISOR') NOT NULL,
    dob DATE NOT NULL,
    employee_since DATE NOT NULL,
    is_terminated BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id)
);

CREATE TABLE `user` (
    employee_id BIGINT,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
	created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	last_login DATETIME,
	deleted_at DATETIME,
	updated_at DATETIME,
	role ENUM('ADMIN', 'EMPLOYEE') NOT NULL DEFAULT 'EMPLOYEE',
	is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (employee_id) REFERENCES employee(id),
    PRIMARY KEY (employee_id)
);

CREATE TABLE employee_shift (
    id BIGINT AUTO_INCREMENT,
    employee_id BIGINT NOT NULL,
    shift_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
	is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (employee_id) REFERENCES employee(id),
    PRIMARY KEY (id)
);

CREATE TABLE promotion_history (
    id BIGINT AUTO_INCREMENT,
    employee_id BIGINT NOT NULL,
    old_role ENUM('CASHIER', 'MANAGER', 'CHEF', 'WAITER', 'SUPERVISOR') NOT NULL,
    new_role ENUM('CASHIER', 'MANAGER', 'CHEF', 'WAITER', 'SUPERVISOR') NOT NULL,
    promotion_date DATE NOT NULL,
	is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (employee_id) REFERENCES employee(id),
    PRIMARY KEY (id)
);

CREATE TABLE customer (
    id BIGINT AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(255) UNIQUE,
    email VARCHAR(255) UNIQUE,
    address VARCHAR(255),
    is_deleted BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id)
);

CREATE TABLE `order` (
    id BIGINT AUTO_INCREMENT,
	placed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    discount DECIMAL(10, 2) NOT NULL DEFAULT 0.0,
    customer_id BIGINT,
    employee_id BIGINT NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (customer_id) REFERENCES customer(id),
    FOREIGN KEY (employee_id) REFERENCES employee(id),
    PRIMARY KEY (id)
);

CREATE TABLE order_item (
    item_id BIGINT NOT NULL,
    order_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    discount_per_unit DECIMAL(10, 2) NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (item_id) REFERENCES menu_item(id),
    FOREIGN KEY (order_id) REFERENCES `order`(id),
    PRIMARY KEY (item_id, order_id)
);

CREATE TABLE receipt (
    id BIGINT AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
	amount_given DECIMAL(10, 2) NOT NULL,
	is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (order_id) REFERENCES `order`(id),
    PRIMARY KEY (id)
);

CREATE TABLE inventory (
    id BIGINT AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
	description TEXT,
    quantity INT NOT NULL,
    unit VARCHAR(50) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	is_deleted BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id)
);

CREATE TABLE supplier (
    id BIGINT AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) UNIQUE,
    address VARCHAR(255),
	is_deleted BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id)
);

CREATE TABLE inventory_purchase (
    id BIGINT AUTO_INCREMENT,
    inventory_id BIGINT,
    menu_item_id BIGINT,
    supplier_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    cost DECIMAL(10, 2) NOT NULL,
    purchased_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (inventory_id) REFERENCES inventory(id),
    FOREIGN KEY (menu_item_id) REFERENCES menu_item(id),
    FOREIGN KEY (supplier_id) REFERENCES supplier(id),
    PRIMARY KEY (id)
);

CREATE TABLE supplier_menu_item (
	supplier_id BIGINT NOT NULL,
	menu_item_id BIGINT NOT NULL,
	quantity BIGINT NOT NULL,
	is_deleted BOOLEAN DEFAULT FALSE,
	FOREIGN KEY (supplier_id) REFERENCES supplier(id),
	FOREIGN KEY (menu_item_id) REFERENCES menu_item(id),
	PRIMARY KEY (supplier_id, menu_item_id)
);

CREATE TABLE supplier_inventory (
	supplier_id BIGINT NOT NULL,
	inventory_id BIGINT NOT NULL,
	quantity BIGINT NOT NULL,
	is_deleted BOOLEAN DEFAULT FALSE,
	FOREIGN KEY (supplier_id) REFERENCES supplier(id),
	FOREIGN KEY (inventory_id) REFERENCES inventory(id),
	PRIMARY KEY (supplier_id, inventory_id)
);

CREATE TABLE restaurant_table (
    id BIGINT AUTO_INCREMENT,
    table_number INT NOT NULL UNIQUE,
    capacity INT NOT NULL,
	last_booked DATETIME DEFAULT NULL,
	is_available BOOLEAN DEFAULT TRUE,
	is_deleted BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id)
);

CREATE TABLE restaurant_table_booking (
	id BIGINT AUTO_INCREMENT,
	table_id BIGINT NOT NULL,
	customer_id BIGINT NOT NULL,
	booking_date DATE NOT NULL,
	start_time TIME NOT NULL,
	end_time TIME NOT NULL,
	is_deleted BOOLEAN DEFAULT FALSE,
	PRIMARY KEY (id),
	FOREIGN KEY (table_id) REFERENCES restaurant_table(id),
	FOREIGN KEY (customer_id) REFERENCES customer(id)
);

CREATE TABLE expense (
    id BIGINT AUTO_INCREMENT,
    expense_type ENUM('RENT', 'SALARIES', 'UTILITIES', 'MAINTENANCE', 'OTHER') NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    expense_date DATE NOT NULL,
    description VARCHAR(255),
	is_deleted BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id)
);

CREATE TABLE report (
    id BIGINT AUTO_INCREMENT,
    generated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    report_type ENUM('DAILY', 'WEEKLY', 'MONTHLY', 'ANNUAL', 'CUSTOM') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,  
    generated_by BIGINT NOT NULL,
	title VARCHAR(255) NOT NULL,
    description TEXT,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (generated_by) REFERENCES employee(id),
    PRIMARY KEY (id)
);

DESC menu_item;
DESC sales_package;
DESC sales_package_item;
DESC employee;
DESC `user`;
DESC promotion_history;
DESC customer;
DESC `order`;
DESC order_item;
DESC receipt;
DESC inventory;
DESC supplier;
DESC inventory_purchase;
DESC supplier_menu_item;
DESC supplier_inventory;
DESC employee_shift;
DESC restaurant_table;
DESC restaurant_table_booking;
DESC expense;
DESC report;

INSERT INTO menu_item (name, price, img, category, quantity) VALUES
('Cheeseburger', 8.99, 'cheeseburger.jpg', 'BURGER', 100),
('Margherita Pizza', 12.99, 'margherita_pizza.jpg', 'PIZZA', 50),
('Coke', 2.50, 'coke.jpg', 'BEVERAGE', 200),
('French Fries', 3.99, 'french_fries.jpg', 'SIDES', 150),
('Chocolate Cake', 4.99, 'chocolate_cake.jpg', 'DESSERT', 80);

INSERT INTO sales_package (name, description, discount_percentage) VALUES
('Lunch Special', 'Combo of Burger, Fries, and Drink', 10.00),
('Pizza Feast', '2 Large Pizzas and 1 Side', 15.00),
('Beverage Combo', '1 Soft Drink and 1 Dessert', 5.00),
('Family Deal', '4 Burgers, 2 Sides, 2 Beverages', 20.00),
('Party Pack', '10 Pizzas, 5 Sides, 5 Beverages', 25.00);

INSERT INTO sales_package_item (package_id, item_id, quantity) VALUES
(1, 1, 1),
(1, 4, 1),
(1, 3, 1),
(2, 2, 2),
(3, 3, 1);

INSERT INTO employee (name, phone, email, address, salary, role, dob, employee_since) VALUES
('Sathish Shan', '0770110488', 'shansathish33.1@gmail.com', 'No, 60. Alokamawatha, Walawegama, Udawalawa', 200000.0, 'MANAGER', '2001-07-28', '2024-01-19'),
('Kasun Perera', '0771234567', 'kasunp@gmail.com', '21 Lake Rd, Nugegoda', 55000.0, 'CASHIER', '1993-04-18', '2021-02-11'),
('Nimali Silva', '0712345678', 'nimalis@gmail.com', '85 Flower Rd, Colombo 07', 85000.0, 'CHEF', '1989-06-24', '2020-09-01'),
('Tharindu Weerasinghe', '0757894561', 'tharindu.w@gmail.com', '14 Galle Rd, Panadura', 62000.0, 'WAITER', '1995-02-09', '2019-05-17'),
('Dilani Jayawardena', '0769876543', 'dilani.jay@gmail.com', '7 Temple Rd, Kandy', 72000.0, 'SUPERVISOR', '1990-09-10', '2018-04-03'),
('Ruwan Fernando', '0774567890', 'ruwanf@gmail.com', '34 Ocean View, Dehiwala', 58000.0, 'CASHIER', '1987-11-05', '2016-12-01'),
('Ishara Ranasinghe', '0716547890', 'isharar@gmail.com', '12 Station Rd, Kurunegala', 69000.0, 'CHEF', '1992-08-14', '2020-01-20'),
('Malith Gunasekara', '0723456789', 'malithg@yahoo.com', '19 Hill St, Galle', 74000.0, 'SUPERVISOR', '1988-03-03', '2017-08-29'),
('Nadeesha Priyadarshani', '0745678901', 'nadeesha.p@gmail.com', '53 Park Rd, Anuradhapura', 51000.0, 'CASHIER', '1991-05-22', '2019-07-12'),
('Chaminda Herath', '0751234987', 'chamindah@gmail.com', '66 River Rd, Polonnaruwa', 67000.0, 'WAITER', '1986-12-17', '2015-03-10'),
('Harsha Senanayake', '0779988776', 'harsha.s@gmail.com', '9 Lotus Rd, Moratuwa', 80000.0, 'MANAGER', '1985-01-15', '2013-06-01'),
('Sanduni Ekanayake', '0784561230', 'sandunie@gmail.com', '45 Palm Ave, Badulla', 60000.0, 'CASHIER', '1994-07-08', '2021-09-27'),
('Ravindu Dissanayake', '0763214567', 'ravindud@gmail.com', '31 Beach Rd, Trincomalee', 64000.0, 'WAITER', '1996-11-19', '2022-02-14'),
('Kalani Wickramasinghe', '0709876543', 'kalanikw@gmail.com', '25 Lake Dr, Jaffna', 78000.0, 'CHEF', '1989-10-29', '2018-11-04'),
('Chamara Dias', '0714567890', 'chamdi@gmail.com', '17 Temple Rd, Batticaloa', 56000.0, 'CASHIER', '1993-03-25', '2017-01-20'),
('Nuwani De Silva', '0729876543', 'nuwani.d@gmail.com', '88 Main Rd, Matale', 70000.0, 'SUPERVISOR', '1990-02-12', '2016-07-07'),
('Sajith Jayasuriya', '0743217890', 'sajithj@gmail.com', '61 Coconut Grove, Chilaw', 62000.0, 'WAITER', '1987-08-18', '2014-05-22'),
('Thilini Bandara', '0771122334', 'thilini.b@gmail.com', '40 Station Rd, Hambantota', 75000.0, 'CHEF', '1991-06-30', '2019-10-18'),
('Akila Rajapaksha', '0789098765', 'akilar@gmail.com', '3 Ocean Blvd, Kalutara', 63000.0, 'SUPERVISOR', '1994-01-05', '2020-03-03'),
('Yasith Madushanka', '0756781234', 'yasithm@gmail.com', '20 Rose Lane, Ratnapura', 59000.0, 'CASHIER', '1995-09-09', '2021-05-05'),
('Vindya Karunarathne', '0712323232', 'vindyak@yahoo.com', '12 Mango Garden, Monaragala', 61000.0, 'WAITER', '1992-10-10', '2019-06-06'),
('Roshan Liyanage', '0734567891', 'roshanl@gmail.com', '75 Green Path, Nuwara Eliya', 81000.0, 'MANAGER', '1984-04-04', '2012-12-12'),
('Piumi Senarath', '0768887776', 'piumi.s@gmail.com', '101 Lotus Circle, Ampara', 68000.0, 'CHEF', '1993-12-01', '2018-03-15'),
('Hiruni Samarasinghe', '0709998887', 'hiruni.sam@gmail.com', '29 Cinnamon Lane, Vavuniya', 73000.0, 'SUPERVISOR', '1989-09-19', '2015-08-09'),
('Lasitha Gamage', '0787654321', 'lasithag@gmail.com', '13 Rose Walk, Gampaha', 66000.0, 'WAITER', '1991-11-29', '2017-10-10'),
('Chamari Athukorala', '0721239876', 'chamaria@gmail.com', '5 Forest Dr, Kalmunai', 70000.0, 'CASHIER', '1996-06-06', '2022-06-06'),
('Dulaj Weerasekara', '0773216540', 'dulajw@gmail.com', '98 Hill Crest, Puttalam', 67000.0, 'CHEF', '1990-07-07', '2017-07-07'),
('Janani Rajapaksha', '0718787878', 'jananirj@gmail.com', '33 Maple Ln, Mullaitivu', 69000.0, 'SUPERVISOR', '1986-05-15', '2014-04-04'),
('Dinuka Maduranga', '0702345678', 'dinukam@yahoo.com', '27 Lotus View, Kilinochchi', 76000.0, 'WAITER', '1992-03-21', '2020-09-09'),
('Isuru Samarawickrama', '0731122334', 'isurusw@gmail.com', '59 Palm Grove, Mannar', 64000.0, 'CASHIER', '1993-08-08', '2018-08-08');

INSERT INTO `user` (employee_id, username, password, role) VALUES
(1, 'god_xero', '$2a$12$m8klimGVexhjMpucFB0UFOxnnaiWXFf26BH9rk/ZVaxa/RwblMAva', 'ADMIN'), -- 1234
(2, 'john_doe', '$2a$12$m8klimGVexhjMpucFB0UFOxnnaiWXFf26BH9rk/ZVaxa/RwblMAva', 'EMPLOYEE'),
(3, 'jane_smith', '$2a$12$m8klimGVexhjMpucFB0UFOxnnaiWXFf26BH9rk/ZVaxa/RwblMAva', 'EMPLOYEE'),
(4, 'mike_johnson', '$2a$12$m8klimGVexhjMpucFB0UFOxnnaiWXFf26BH9rk/ZVaxa/RwblMAva', 'EMPLOYEE'),
(5, 'emily_davis', '$2a$12$m8klimGVexhjMpucFB0UFOxnnaiWXFf26BH9rk/ZVaxa/RwblMAva', 'EMPLOYEE');

INSERT INTO promotion_history (employee_id, old_role, new_role, promotion_date) VALUES
(1, 'CASHIER', 'MANAGER', '2024-01-01'),
(2, 'CHEF', 'SUPERVISOR', '2023-07-01'),
(3, 'WAITER', 'CHEF', '2023-03-01'),
(4, 'SUPERVISOR', 'MANAGER', '2022-05-01'),
(5, 'MANAGER', 'SUPERVISOR', '2021-06-01');

INSERT INTO customer (name, phone, email, address) VALUES
('Alice Green', '0770789032', 'alice.green@gmail.com', '789 Green St, Colombo'),
('Bob Brown', '0770345678', 'bob.brown@gmail.com', '345 Brown St, Kandy'),
('Charlie White', '0770987654', 'charlie.white@gmail.com', '456 White St, Galle'),
('David Black', '0770765433', 'david.black@gmail.com', '123 Black St, Negombo'),
('Eva Blue', '0770321654', 'eva.blue@gmail.com', '567 Blue St, Matara');

INSERT INTO `order` (placed_at, discount, customer_id, employee_id) VALUES
('2024-03-01 12:30:00', 5.00, 1, 1),
('2024-03-01 13:00:00', 10.00, 2, 2),
('2024-03-01 13:30:00', 2.00, 3, 3),
('2024-03-01 14:00:00', 0.00, 4, 4),
('2024-03-01 14:30:00', 8.00, 5, 5);

INSERT INTO order_item (item_id, order_id, quantity, discount_per_unit) VALUES
(1, 1, 1, 0.50),
(2, 2, 2, 1.00),
(3, 3, 1, 0.30),
(4, 4, 2, 0.40),
(5, 5, 1, 0.60);

INSERT INTO receipt (order_id, amount_given) VALUES
(1, 20.00),
(2, 30.00),
(3, 25.00),
(4, 15.00),
(5, 35.00);

INSERT INTO inventory (name, description, quantity, unit) VALUES
('Tomato', 'Fresh ripe tomatoes', 100, 'KG'),
('Flour', 'High quality wheat flour', 200, 'KG'),
('Cheese', 'Mozzarella cheese', 50, 'KG'),
('Coke Can', 'Coca-Cola soft drink', 300, 'CAN'),
('Lettuce', 'Fresh lettuce leaves', 80, 'BUNCH');

INSERT INTO supplier (name, phone, email, address) VALUES
('Fresh Foods Ltd', '0770666777', 'supplier1@gmail.com', '123 Food St, Colombo'),
('Flour Mill Inc', '0770888999', 'supplier2@gmail.com', '456 Mill St, Kandy'),
('Cheese Factory', '0770222333', 'supplier3@gmail.com', '789 Dairy Rd, Galle'),
('Coca-Cola Co', '0770333444', 'supplier4@gmail.com', '101 Beverage Blvd, Negombo'),
('Veggie Growers', '0770444555', 'supplier5@gmail.com', '202 Greenhouse St, Matara');

INSERT INTO inventory_purchase (inventory_id, menu_item_id, supplier_id, quantity, cost) VALUES
(1, null, 1, 50, 100.00),
(null, 2, 2, 100, 150.00),
(3, null, 3, 25, 75.00),
(4, null, 4, 150, 200.00),
(null, 5, 5, 40, 60.00);

INSERT INTO supplier_menu_item (supplier_id, menu_item_id, quantity) VALUES
(1, 2, 200),
(2, 3, 20),
(3, 4, 1234),
(2, 2, 134),
(1, 1, 7623);

INSERT INTO supplier_inventory (supplier_id, inventory_id, quantity) VALUES
(1, 2, 6723),
(2, 3, 412),
(3, 4, 823),
(2, 2, 7823),
(1, 1, 7832);

INSERT INTO employee_shift (employee_id, shift_date, start_time, end_time) VALUES
(1, '2024-03-01', '09:00:00', '17:00:00'),
(1, '2024-03-01', '08:00:00', '16:00:00'),
(1, '2024-03-01', '10:00:00', '18:00:00'),
(4, '2024-03-01', '12:00:00', '20:00:00'),
(5, '2024-03-01', '14:00:00', '22:00:00');

INSERT INTO restaurant_table (table_number, capacity, is_available) VALUES
(1, 4, TRUE),
(2, 2, FALSE),
(3, 6, TRUE),
(4, 4, TRUE),
(5, 2, FALSE);

INSERT INTO restaurant_table_booking (table_id, customer_id, booking_date, start_time, end_time) VALUES
(1, 1, '2025-04-09', '12:30:00', '14:00:00'),
(1, 2, '2025-04-09', '14:00:00', '14:30:00'),
(1, 3, '2025-04-09', '14:30:00', '15:00:00'),
(1, 4, '2025-04-09', '15:00:00', '15:30:00'),
(1, 5, '2025-04-09', '15:30:00', '16:00:00');

INSERT INTO expense (expense_type, amount, expense_date, description) VALUES
('RENT', 1500.00, '2024-03-01', 'Monthly rent for the restaurant'),
('SALARIES', 12000.00, '2024-03-01', 'Employee salaries for the month'),
('UTILITIES', 2000.00, '2024-03-01', 'Electricity and water bills'),
('MAINTENANCE', 500.00, '2024-03-01', 'Restaurant maintenance costs'),
('OTHER', 1000.00, '2024-03-01', 'Miscellaneous expenses');

INSERT INTO report (generated_at, report_type, start_date, end_date, generated_by, title, description) VALUES
('2024-03-01 10:00:00', 'DAILY', '2024-03-01', '2024-03-01', 1, 'Daily Sales Report', 'A report showing sales for the day'),
('2024-03-01 10:30:00', 'WEEKLY', '2024-02-23', '2024-03-01', 2, 'Weekly Performance Report', 'A report showing weekly performance'),
('2024-03-01 11:00:00', 'MONTHLY', '2024-02-01', '2024-02-28', 3, 'Monthly Revenue Report', 'A report showing monthly revenue'),
('2024-03-01 11:30:00', 'ANNUAL', '2023-01-01', '2023-12-31', 4, 'Annual Expense Report', 'A report showing annual expenses'),
('2024-03-01 12:00:00', 'CUSTOM', '2024-02-01', '2024-03-01', 5, 'Custom Sales Report', 'A report showing custom sales for a given period');

SELECT * FROM menu_item;
SELECT * FROM sales_package;
SELECT * FROM sales_package_item;
SELECT * FROM employee;
SELECT * FROM `user`;
SELECT * FROM promotion_history;
SELECT * FROM customer;
SELECT * FROM `order`;
SELECT * FROM order_item;
SELECT * FROM receipt;
SELECT * FROM inventory;
SELECT * FROM supplier;
SELECT * FROM inventory_purchase;
SELECT * FROM supplier_menu_item;
SELECT * FROM supplier_inventory;
SELECT * FROM employee_shift;
SELECT * FROM restaurant_table;
SELECT * FROM restaurant_table_booking;
SELECT * FROM expense;
SELECT * FROM report;

SELECT * FROM menu_item;
SELECT * FROM sales_package;
SELECT * FROM sales_package_item;
