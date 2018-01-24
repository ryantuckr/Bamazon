var mysql = require("mysql");
var inquirer = require('inquirer');
var fs = require('fs');

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
    //console.log("CONNECTED TO MYSQL AS ID " + connection.threadId);
    menu();
});

function showResults(arr) {

    for (i = 0; i < arr.length; i++) {
        console.log("Item ID : " + arr[i].item_id + " | " + " Product: " + arr[i].product_name + " | ", "Price: " + arr[i].price + " | ", "Current Stock: " + arr[i].stock_quantity);
    }
    console.log("-----------------------------------------------");

}

function menu() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        // for (i = 0; i < res.length; i++) {
        //     console.log("Item ID : " + res[i].item_id + " | " + " Product: " + res[i].product_name + " | ", "Price: " + res[i].price);
        // }
        // console.log("-----------------------------------------------");
        logData(res);
        showResults(res);
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
                    //console.log("user input = " + answer.itemid);
                    //console.log("SQL data id = " + res[i].item_id + " Current Stock: " + res[i].stock_quantity);
                    //console.log("Cost per Item = " + res[i].price)
                    chosenItem = res[i];
                    cost = res[i].price * answer.quantity;
                    //console.log("Total Order Cost = " + cost);
                }
            }
            //console.log(chosenItem.stock_quantity);
            //console.log(answer.quantity);
            //console.log(chosenItem.stock_quantity >= answer.quantity);


            if (chosenItem.stock_quantity >= answer.quantity) {
                //console.log("Order can be filled!");

                var updatedQuantity = chosenItem.stock_quantity - answer.quantity;
                //console.log("updated quantity: " + updatedQuantity);

                connection.query(
                    "UPDATE products set ? where ?", [{
                            stock_quantity: updatedQuantity
                        },
                        {
                            id: chosenItem.id
                        }

                    ],
                    function (err) {
                        if (err) throw err;
                        console.log("-----------------------------------------------");
                        console.log("Your Order is Successful and has been placed.");
                        console.log("-----------------------------------------------");
                        console.log("Your order total is: $" + cost.toFixed(2));
                        console.log("-----------------------------------------------");
                        
                        
                        inquirer.prompt([ 
                            {
                            type: "list",
                            name: "yesorno",
                            message: "Would you like to place another order?",
                            choices: ["Yes", "No"]
                            },
                        ]).then(answers => {
                            if (answers.yesorno === "Yes") {
                                menu();
                            }else {
                                console.log("Thank you for your order.")
                                console.log("-----------------------------------------------");
                                connection.end();
                            }
                        });
                       
                    });

            } else {
                console.log("Unfortunatly, we DO NOT have enough in stock to cover this order.")
                console.log("-----------------------------------------------");
                
                //insuirer prompt want to order any thing else?
                    //if yes then run menu
                    //if not then connection end

                    inquirer.prompt([ 
                        {
                        type: "list",
                        name: "yesorno",
                        message: "Would you like to place another order for a different item?",
                        choices: ["Yes", "No"]
                        },
                    ]).then(answers => {
                        if (answers.yesorno === "Yes") {
                            menu();
                        }else {
                            console.log("Please check back soon as inventory levels change often.")
                            console.log("-----------------------------------------------");
                            connection.end();
                        }
                    });
               
                
            }
        });

    });

};

function logData() {
    fs.appendFile("logfile.txt", "!!!!!!did this work!!!!!", function (err) {
        if (err) {
            return console.log(err);
        }
        //console.log("file saved");
    });
}