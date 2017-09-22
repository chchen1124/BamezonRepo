//list required nodes
var mysql=require("mysql");
var inquirer=require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Poptarttreat11@",
  database: "bamazon"
});

//connects to the database
connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  afterConnection();
});

//function that asks user what option would he/she like to choose in the menu
function afterConnection()
{
  inquirer.prompt({
    name:"main_menu",
    type:"rawlist",
    message:"What would you like to choose",
    choices:["VIEW_PRODUCTS","VIEW_LOW_INV","ADD_INV","ADD_PROD"]
  }).then(function (answer){
    if(answer.main_menu.toUpperCase()==="VIEW_PRODUCTS")
    {
      seeProducts();
    }
    else if(answer.main_menu.toUpperCase()==="VIEW_LOW_INV")
    {
      viewLowInventory();
    }
    else if(answer.main_menu.toUpperCase()==="ADD_INV")
    {
      addInventory();
    }
    else
    {
      addProduct();
    }
  });
}

//function for viewing all products in the store
function seeProducts()
{
	connection.query("SELECT * from `products`",function(err,res){
		if(err)
		{
			throw err;
		}
		console.log(res);

	});
	connection.end();
}

//function for viewing the products with stock quantity less than 5
function viewLowInventory()
{
	var st="WHERE `stock_quantity` < 5";
	connection.query("SELECT * from `products` "+st,function(err,res){
		if(err)
		{
			throw err;
		}
		console.log(res);
	});
	connection.end();
}

//function that adds more units or stocks to any product based on the product id
function addInventory()
{
	var temp;
	var parsetemp;
	var choice=3;
	connection.query("SELECT `stock_quantity` from `products` WHERE `item_id` = "+choice,function(err,res){
		temp=JSON.stringify(res);
		var lastdigit=temp.charAt(temp.indexOf("}")-1);
		var real_quantity=temp.substr(19,temp.length-temp.indexOf(lastdigit));
		parsetemp=parseInt(real_quantity);
		console.log("Parse Temp is "+parsetemp);
		inquirer.prompt(
		{
			name:"number_wanted",
			type:"input",
			message: "How many would you like to add?"
		}).then(function (answer){
			//adds the amount wanted to the current stock quantity
			parsetemp=parseInt(parsetemp)+parseInt(answer.number_wanted);
			res=parsetemp;
			console.log("The total amount of units/stocks for this product is now "+res);
			UpdateNumber(parsetemp,choice);
		});				
	});
}

//function to update the products table due to new stocks of this specific product (based on the product id) being added
function UpdateNumber(amount,decision)
{
	connection.query("UPDATE `products` SET ? WHERE ?",[
		{
			stock_quantity:amount
		},
		{
			item_id:decision
		}
	]);
	connection.end();
}

//function to add a new product to the store
function addProduct()
{
  connection.query("INSERT into products SET ? ",{
    product_name:"Computer Vision",department_name:"Technical",price:154.34,stock_quantity:866
  },
  function(err,res)
  {
    if(err)
    {
      throw err;
    }
  });
  connection.end();	
}