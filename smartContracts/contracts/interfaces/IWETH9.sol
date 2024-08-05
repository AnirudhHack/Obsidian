pragma solidity >=0.4.0;

interface IWETH9 {
    function deposit() external payable;

    function withdraw(uint wad) external;

    function approve(address guy, uint wad) external returns (bool);
    
    function balanceOf(address user)external view returns(uint);
}