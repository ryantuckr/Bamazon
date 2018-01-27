itemdrop database if exists bamazon;

create database bamazon;
use bamazon;

create table products(
    id int(10) auto_increment not null,
    item_id varchar(55),
    product_name varchar(55),
    department_name varchar(55),
    price decimal(10,2),
    stock_quantity int(10),
    primary key (id)
);

insert into products (item_id, product_name, department_name, price, stock_quantity)
values
("apptv4874", "Apple TV", "electronics", 499.99, 12),
("appwatch8120", "Apple Watch", "electronics", 325.99, 24),
("hhg90057", "Window Cleaner", "household goods", 7.95, 3000),
("hhg90071", "Floor Cleaner", "household goods", 5.58, 4500),
("pet4559", "Dog Food", "pets", 28.50, 45),
("pet1228", "Fish Food", "pets", 4.25, 75),
("clo6989", "Rain Poncho", "clothing", 4.95, 200),
("clo2317", "Rain Hat", "clothing", 11.95, 15),
("aut2547", "Front Head Light", "automotive", 17.45, 9),
("aut6674", "Protective Seat Cover", "automotive", 9.99, 10)