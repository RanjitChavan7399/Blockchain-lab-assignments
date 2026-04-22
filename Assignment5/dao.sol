// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleDAO {

    struct Proposal {
        string description;
        uint voteCount;
        uint deadline;
        bool executed;
    }

    address public owner;
    Proposal[] public proposals;

    mapping(uint => mapping(address => bool)) public hasVoted;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createProposal(string memory _description, uint _duration) public onlyOwner {
        proposals.push(Proposal({
            description: _description,
            voteCount: 0,
            deadline: block.timestamp + _duration,
            executed: false
        }));
    }

    function vote(uint _proposalId) public {
        require(_proposalId < proposals.length, "Invalid proposal");
        Proposal storage proposal = proposals[_proposalId];

        require(block.timestamp < proposal.deadline, "Voting ended");
        require(!hasVoted[_proposalId][msg.sender], "Already voted");

        proposal.voteCount++;
        hasVoted[_proposalId][msg.sender] = true;
    }

    function executeProposal(uint _proposalId) public onlyOwner {
        require(_proposalId < proposals.length, "Invalid proposal");
        Proposal storage proposal = proposals[_proposalId];

        require(block.timestamp >= proposal.deadline, "Voting not finished");
        require(!proposal.executed, "Already executed");

        proposal.executed = true;
    }

    function getProposals() public view returns (Proposal[] memory) {
        return proposals;
    }
}