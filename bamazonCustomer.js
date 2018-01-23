var mysql = require("mysql");
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("CONNECTED TO MYSQL AS ID " + connection.threadId);
    getList();
});

function getList() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        for (i = 0; i < res.length; i++) {
            console.log(res[i].id + " | " + res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
        }
        console.log("-----------------------------------------------");
        //console.log(res);

        inquirer.prompt([{
                type: "input",
                name: "welcomemessage",
                message: "Welcome to Bamazon! Please Press [ENTER]"
            },

            {
                type: "prompt",
                name: "itemid",
                message: "Please input the ITEM ID [example: abc1234] of the item you would like to purchase",
            },
            {
                type: "prompt",
                name: "quantity",
                message: "How many units would you like to purchase?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ]).then(function (answer) {
            //console.log(answer.itemid);
            //console.log(answer.quantity);
            //console.log(res);
            var chosenItem;
            var cost;
            for (var i = 0; i < res.length; i++) {
                if (res[i].item_id === answer.itemid) {
                    console.log("user input = " + answer.itemid);
                    console.log("SQL data id = " + res[i].item_id + " Current Stock: " + res[i].stock_quantity);
                    console.log("Cost per Item = " + res[i].price)
                    chosenItem = res[i];
                    cost = res[i].price * answer.quantity;
                    console.log("Total Order Cost = " + cost);



                }
            }
            if (chosenItem.stock_quantity >= answer.quantity) {
                console.log("Order can be filled!");
                
                // var cost = answer.quantity * res[i].price;
                // console.log("order cost" + cost);



                var updatedQuantity = chosenItem.stock_quantity - answer.quantity;
                console.log("updated quantity: " + updatedQuantity);
                return updatedQuantity;

                //build out the logic starting with connection.query in same scope?
                //??seperate function for SUM answer.quantity with matching res[i]item_id
                //?? seperate function for subtracting answer.quantity with matching res[i].stock_quantity

            } else {
                console.log("Unfortunatly, we DO NOT have enough in stock to cover this order.")
            }
        });

    });

};