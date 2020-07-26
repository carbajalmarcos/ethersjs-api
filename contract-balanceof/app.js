var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var app = express();
var Web3 = require("web3");
const abi = require("./utils/abi.json");

const provider =  "http://localhost:7545";
const contractAddress = "";
const web3 = new Web3(provider);
const tokenContract = new web3.eth.Contract(abi, contractAddress);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.get("/balanceof", async (req, res, next) => {
  try {
    if (!req.query["address"]) {
      return res.status(400).send("address field is missing");
    }
    let address = req.query["address"];
    let balance = await tokenContract.methods.balanceOf(address).call();
    return res.send({ balance: balance.toString() });
  } catch (e) {
    console.log(e);
    return res.status(500).send(e);
  }
});

app.get("/transfer", async (req, res, next) => {
  try {
    if (!req.query["pkey"] || !req.query["to"] || !req.query["amount"]) {
      return res.status(400).send("pkey, to and amount fields are missing");
    }
    let fromAcc = web3.eth.accounts.privateKeyToAccount(req.query["pkey"]),
      toAcc = req.query["to"],
      amount = req.query["amount"],
      sendOptions = {
        from: fromAcc.address,
        gasPrice: "30000000000000",
        gas: 1500000,
      };
    let response = await tokenContract.methods
      .transfer(toAcc, amount)
      .send(sendOptions);
    return res.send({ ...response });
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

module.exports = app;
