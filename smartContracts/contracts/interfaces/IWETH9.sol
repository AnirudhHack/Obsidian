pragma solidity >=0.8.0;

interface IWETH9 {
    function deposit() external payable;

    function withdraw(uint wad) external;

    function approve(address guy, uint wad) external returns (bool);
    
    function balanceOf(address user)external view returns(uint);
    
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    
    function transfer(address to, uint256 value) external returns (bool);
}