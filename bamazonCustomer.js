//list required nodes
var mysql = require("mysql");
var inquirer = require("inquirer");

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

//connect to the database
connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  afterConnection();
});

//select everything from the products table in the bamazon DB and print them all out
function afterConnection()
{
  connection.query("SELECT * FROM `products`",function(err,res){
    if(err)
    {
      throw err;
    }
    console.log(res);
    //invoke the Ask() function
    Ask();
  });
}

//function to ask about products and units
function Ask()
{
  //first inquirer asks the product you want to buy, second inquirer asks number of units you would love to purchase
  inquirer.prompt([
    {
      name:"productid",
      type:"input",
      message:"What is the product that you would like to buy"
    },
    {
      name:"units",
      type:"input",
      message:"How many units you would like to buy"
    }
  ])
  .then(function(ans)
  {
    connection.query("SELECT * from `products`",
    function(err,res)
    {
      if(err)
      {
        throw err;
      }
      var stock_quant,the_price;
      //loops through the array of res
      for(var g=0;g<res.length;g++)
      {
        //if the ans.productid is equal to an item id in the array
        if(parseInt(res[g].item_id)===parseInt(ans.productid))
        {
          //save the array item's stock quantity and price to variables
          stock_quant=res[g].stock_quantity;
          the_price=res[g].price;
          break;
        }
      }
      //if stock quantity is less than the amount of units user requested print "Insufficient quantity!"
      if(stock_quant<ans.units)
      {
        console.log("Insufficient quantity!");
      }
      //otherwise reduce the quantities of this specific product
      else
      {
        stock_quant=stock_quant-ans.units;
        //Updates the database by setting the stock quantity value to the new stock quantity based on the item id   
        var q1=connection.query("UPDATE `products` SET ? WHERE ?",[
          {
            stock_quantity:stock_quant
          },
          {
            item_id:ans.productid
          }
        ],function(err,resp)
        {
          if(err)
          {
            throw err;
          }
        });
        //calculates the total cost of the user
        var totalCost=ans.units*the_price;
        console.log("Your total cost is "+totalCost.toFixed(2));
      }
      connection.end();
    });
  });
}