require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const path = require("path");
const ethers = require('ethers');

var port = 3001;

const API_URL = process.env.API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const {abi} = require('./artifacts/contracts/Voting.sol/Voting.json');
const provider = new ethers.providers.JsonRpcProvider(API_URL);

const signer = new ethers.Wallet(PRIVATE_KEY, provider);

const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
})

app.get("/index.html", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
})

app.post("/addCandidate", async (req, res) => {
    try {
        var vote = req.body.vote;
        console.log("Candidate name received:", vote);
        if (!vote) {
            return res.send("ERROR: No candidate name provided.");
        }
        const bool = await contractInstance.getVotingStatus();
        if (bool == true) {
            console.log("..........ADDING NEW CANDIDATE..........");
            const tx = await contractInstance.addCandidate(vote);
            await tx.wait();
            res.send("REGISTRATION OF THE CANDIDATE APPROVED");
        }
        else {
            res.send("THE VOTE IS FINISHED");
        }
    } catch (error) {
        console.error("Error adding candidate:", error.message);
        res.status(500).send("Error adding candidate: " + error.message);
    }
});

app.listen(port, function () {
    console.log(`http://localhost:${port}/`)
});