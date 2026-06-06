let WALLET_CONNECTED = "";
let contractAddress = "0xF377EF3ca5EeB9eaB14129CD7aAD7804571573E3";
let contractAbi = [
    {
      "inputs": [
        {
          "internalType": "string[]",
          "name": "_candidateNames",
          "type": "string[]"
        },
        {
          "internalType": "uint256",
          "name": "_durationInMinutes",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        }
      ],
      "name": "addCandidate",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "candidates",
      "outputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "voteCount",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllVotesOfCandiates",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "voteCount",
              "type": "uint256"
            }
          ],
          "internalType": "struct Voting.Candidate[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getRemainingTime",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_candidateIndex",
          "type": "uint256"
        }
      ],
      "name": "getVotesOfCandiate",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getVotingStatus",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_candidateIndex",
          "type": "uint256"
        }
      ],
      "name": "vote",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "voters",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "votingEnd",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "votingStart",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

const connectMetamask = async() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    WALLET_CONNECTED = await signer.getAddress();
    var element = document.getElementById("metamasknotification");
    element.innerHTML = "connected with the address:  " + WALLET_CONNECTED;
}

const addVote = async() => {
    if(WALLET_CONNECTED !== "") {
        var name = document.getElementById("vote");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
        var cand = document.getElementById("cand");
        cand.innerHTML = "Voting On Going ..........";
        const tx = await contractInstance.vote(name.value);
        await tx.wait();
        cand.innerHTML = "Voting Done (Thank You)";
    }
    else {
        var cand = document.getElementById("cand");
        cand.innerHTML = "You Should Connect Your Metamask Account First";
    }
}

const voteStatus = async() => {
    if(WALLET_CONNECTED !== "") {
        var status = document.getElementById("status");
        var remainingTime = document.getElementById("time");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
        const currentStatus = await contractInstance.getVotingStatus();
        const time = await contractInstance.getRemainingTime();
        console.log(time);
        status.innerHTML = currentStatus == 1 ? "The Vote is Openned" : "The Vote is finished";
        remainingTime.innerHTML = `Time Left: ${time.toNumber()} seconds`;
    }
    else {
        var status = document.getElementById("status");
        status.innerHTML = "Please connect metamask";
    }
}

const getAllCandidates = async() => {
        var p3 = document.getElementById("p3");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
        p3.innerHTML = "Please wait, getting all the candidates from the voting smart contract";
        var candidates = await contractInstance.getAllVotesOfCandiates();
        console.log(candidates);
        var table = document.getElementById("myTable");

        // Clear existing rows (except header)
        var tbody = table.querySelector("tbody");
        if (tbody) tbody.innerHTML = "";

        for (let i = 0; i < candidates.length; i++) {
            var row = table.insertRow();
            var idCell = row.insertCell();
            var nameCell = row.insertCell();
            var vc = row.insertCell();

            idCell.innerHTML = i;
            nameCell.innerHTML = candidates[i].name;
            vc.innerHTML = candidates[i].voteCount;
        }

        p3.innerHTML = "The candidate list is updated"
   
}

const addCandidateClient = async(event) => {
    event.preventDefault();
    var nameInput = document.querySelector('input[name="vote"]');
    var candidateName = nameInput.value.trim();

    if (!candidateName) {
        alert("Please enter a candidate name.");
        return;
    }

    if (WALLET_CONNECTED === "") {
        alert("Please connect MetaMask first.");
        return;
    }

    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);

        const status = await contractInstance.getVotingStatus();
        if (!status) {
            alert("The vote is finished. Cannot add candidates.");
            return;
        }

        var statusEl = document.getElementById("votingStatus");
        if (statusEl) statusEl.innerHTML = "Adding candidate... please confirm in MetaMask";

        const tx = await contractInstance.addCandidate(candidateName);
        await tx.wait();

        if (statusEl) statusEl.innerHTML = "✅ Candidate '" + candidateName + "' registered successfully!";
        nameInput.value = "";
    } catch (error) {
        console.error("Error adding candidate:", error);
        alert("Error: " + (error.reason || error.message));
    }
}

