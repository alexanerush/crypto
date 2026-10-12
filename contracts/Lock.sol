
 // SPDX-License-Identifier: MIT
 pragma solidity ^0.8.24;

 contract Lock {
     uint256 public unlockTime;
     address payable public owner;

     event Withdrawal(uint256 amount, uint256 when);

     constructor(uint256 _unlockTime) payable {
         require(
             block.timestamp < _unlockTime,
             "Unlock time should be in the future"
         );

         unlockTime = _unlockTime;
         owner = payable(msg.sender);
     }

     function withdraw() public {
         require(block.timestamp >= unlockTime, "Too early");
         require(msg.sender == owner, "Not the owner");

         uint256 amount = address(this).balance;

         emit Withdrawal(amount, block.timestamp);

         (bool success, ) = owner.call{value: amount}("");
         require(success, "Withdrawal failed");
     }
 }
