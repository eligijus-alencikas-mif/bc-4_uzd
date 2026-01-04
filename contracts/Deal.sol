// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Deal {
    address public seller;
    address public buyer;
    address public courier;

    uint public price;
    bool public paid;
    bool public delivered;

    constructor(address _buyer) {
        seller = msg.sender;
        buyer = _buyer;
    }

    modifier onlySeller() {
        require(msg.sender == seller, "seller only");
        _;
    }

    modifier onlyBuyer() {
        require(msg.sender == buyer, "buyer only");
        _;
    }

    // seller sets price and courier
    function setDeal(uint _price, address _courier) external onlySeller {
        price = _price;
        courier = _courier;
    }

    // buyer deposits escrow
    function pay() external payable onlyBuyer {
        require(msg.value == price, "wrong amount");
        paid = true;
    }

    // courier confirms delivery, funds released
    function deliver() external {
        require(msg.sender == courier, "courier only");
        require(paid && !delivered, "invalid state");

        delivered = true;
        (bool success, ) = payable(seller).call{value: price}("");
        require(success, "payout failed");
    }

    function health() external pure returns (string memory) {
        return "running";
    }
}
