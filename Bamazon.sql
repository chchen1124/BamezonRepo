DROP DATABASE if exists `bamazon`;
CREATE DATABASE `bamazon`;

USE `bamazon`;

CREATE TABLE `products`
(
`item_id` INTEGER NOT NULL UNIQUE auto_increment PRIMARY KEY,
`product_name` VARCHAR(200) NOT NULL,
`department_name` VARCHAR(320) NOT NULL,
`price` DECIMAL(18,2) NOT NULL,
`stock_quantity` INTEGER NOT NULL 
);

INSERT into `products` (`product_name`,`department_name`,`price`,`stock_quantity`) values ('SQL in 24 Hours','Technical',121.21,835);
INSERT into `products` (`product_name`,`department_name`,`price`,`stock_quantity`) values ('Seducing the Dutchess','Novel',18.55,549),
('Resistor Kit','Electronics',51.52,650),('Scrabble','Toys',23.75,570),('Red with Blue stripes sketchers shoes','Clothes',15.07,988);

Select `stock_quantity` from `products` WHERE `item_id`=3;
UPDATE `products` SET `stock_quantity`=478 WHERE `item_id`=3; 
Select * from `products`;
DELETE from `products` WHERE `item_id` IN (12,13,14); 