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
    console.log("CONNECTED TO MYSQL AS ID " + connection.threadId);
    menu();
});

function menu() {

    inquirer.prompt([{
            type: "input",
            name: "welcomemessage",
            message: "Bamazon Manager Press [ENTER]"
        },

        {
            type: "list",
            name: "check1",
            message: "MENU ITEMS - MANAGER VIEW:",
            choices: ["VIEW Products For Sale", "VIEW Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
        },


    ]).then(answers => {
        //console.log(JSON.stringify(answers));

        //.....................SWTICH CASE CODE BLOCK
        switch (answers.check1) {
            case "VIEW Products For Sale":
                viewProducts();
                break;

            case "VIEW Low Inventory":
                lowInventory();
                break;

            case "Add to Inventory":
                addInventory();
                break;

            case "Add New Product":
                addNewProduct();
                break;

            case "Exit":
                exit();
                break;
        };
    });
}

function viewProducts() {
    //console.log("this will show a table query");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        //console.log(res);
        for (i = 0; i < res.length; i++) {
            console.log("Item ID : " + res[i].item_id + " | " + " Product: " + res[i].product_name + " | ", "Department: " + res[i].department_name + " | ", "Price: " + res[i].price + " | ", "Inventory: " + res[i].stock_quantity);
        };
        menu();
    })
}


function lowInventory() {
    //console.log("this will show all the low inventory stuff");
    //If a manager selects `View Low Inventory`, then it should list 
    //all items with an inventory count lower than five.

    var query = "SELECT product_name, stock_quantity FROM products WHERE stock_quantity < 6";
    connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++)

        {
            //console.log(err);
            console.log("Reorder:")
            console.log("Product Name: " + res[i].product_name + "Inventory: " + res[i].stock_quantity);
            console.log("-------------------------------------------");

        }
        menu();
    })

};

function addInventory() {
    console.log("this will prompt to add inventory");
    //If a manager selects `Add to Inventory`, your app should display 
    //a prompt that will let the manager "add more" of any item currently in the store.

    //inquirer prompt that collects item id and quantity to be updated.
    //matched with database and added instead of subtracted with the first exercise

    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        //console.log(res);
        for (i = 0; i < res.length; i++) {
            console.log("Item ID : " + res[i].item_id + " | " + " Product: " + res[i].product_name + " | ", "Department: " + res[i].department_name + " | ", "Price: " + res[i].price + " | ", "Inventory: " + res[i].stock_quantity);
        };
    })

    inquirer.prompt([{
            type: "prompt",
            name: "intro",
            message: "ADD INVENTORY - MANAGER VIEW press [ENTER]",
        },

        {
            type: "prompt",
            name: "itemid",
            message: "What Item ID [example: abc1234] are you adding inventory too?",
        },
        {
            type: "prompt",
            name: "quantity",
            message: "How much inventory are you adding?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ]).then(function (answer) {
        var chosenItem;
        var addedQuantity;
        for (var i = 0; i < res.length; i++) {
            if (res[i].item_id === answer.itemid) {
                chosenItem = res[i];
            } else {
                console.log("that is not a valid ID Item")
                console.log("please try again")
                menu();
            }
        }

        addedQuantity = chosenItem.stock_quantity + answer.quantity;
        //console.log("updated quantity: " + updatedQuantity);

        connection.query(
            "UPDATE products set ? where ?", [{
                    stock_quantity: addedQuantity
                },
                {
                    id: chosenItem.id
                }

            ],
            function (err) {
                if (err) throw err;
                console.log("-----------------------------------------------");
                console.log(chosenQuantity + " have been added to inventory under Item ID: " + chosenItem.id);
                console.log("-----------------------------------------------");

                inquirer.prompt([{
                    type: "list",
                    name: "yesorno",
                    message: "Do you need to add inventory to other Item IDs?",
                    choices: ["Yes", "No"]
                }, ]).then(answers => {
                    if (answers.yesorno === "Yes") {
                        addInventory();
                    } else {
                        console.log("Exiting to menu.")
                        console.log("-----------------------------------------------");
                        menu();
                    }
                });

            });
    });
}





function addNewProduct() {
    console.log("this will prompt to add a new product ");
    //* If a manager selects `Add New Product`, it should allow the manager 
    //to add a completely new product to the store.
}




function exit() {
    connection.end();
}