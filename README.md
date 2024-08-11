# Obsidian
![banner](https://github.com/user-attachments/assets/540b1fc9-7df9-42d8-ab8a-193c14f65328)

Obsidian is a Defi platform where we are building one click defi strategy like Leverage liquid staking vaults (ERC-4626 ) on base, optimism. Using superform we will allow users to interact in the vault from any chain with tenderly powered virtual testnet.

Partner technology used 
| **Partner Technology** | **Description** |
|---------------------|-----------------|
| **Superform**       | WE have used erc4626 vault standard for our wstETH vault. That way it can be integrated with superform so that anybody from any chain can invest in the vault  |
| **Tenderly**        | - **Virtual Testnet**: Our current vaults are deployed on tenderly's Virtual Testnet on base chain.  Tenderly's Virtual Testnet allows us to deploy and test our vault contracts in a simulated Base chain environment. https://virtual.base.rpc.tenderly.co/3b1f2402-a538-49b6-9828-099218e1f2a0 |
| **Base**            | The vault strategy is built and deployed for the Base chain, which serves as the underlying blockchain infrastructure for our vault operations. |



## Dapp Deployment link
https://obsidian-dapp.vercel.app/

## vault Address on Tenderly virtual testnet (Base Chain)
vault Address = 0x0fe4223ad99df788a6dcad148eb4086e6389ceb6  
(https://dashboard.tenderly.co/explorer/vnet/4710ac52-ae3b-47cf-9b9a-74050ef08198/tx/0xb589deefc964d165f8029e9b2ab5fa3fd13ed3181b091260584e4bf3d9edc7fa)

Tenderly public explorer = https://dashboard.tenderly.co/explorer/vnet/4710ac52-ae3b-47cf-9b9a-74050ef08198/transactions

Tenderly admin rpc = https://virtual.base.rpc.tenderly.co/3b1f2402-a538-49b6-9828-099218e1f2a0

## Vault Working
Convert ETH to Lido's wstETH and leverage more wstETH by borrowing ETH in order to increase yield received from staking rewards.

While this strategy can increase rewards received through staking, it also has multiple variables and risks you should consider: First, the ETH borrow APY in Aave v3 is variable and may not always be lower than staking rewards received. Second, the value of wstETH versus ETH is also variable and drops in the wstETH/ETH price ratio can make your position risky or cause losses at the moment of exiting the position. Third, please note that the risk of liquidation exists for this type of position and you can find the wstETH/ETH liquidation rate for your position in the top right corner of our Aave dashboard.

## Vault APY calculation
![image](https://github.com/user-attachments/assets/b7f3bd25-30ca-44c4-8a44-b7e9244d8c5c)

![image](https://github.com/user-attachments/assets/cb4378cd-c15a-45ef-b3e8-23eb8da7afa7)


## Demo


https://github.com/user-attachments/assets/dda9610b-d63f-48b1-a36f-794d2abdad17



## Contract Functionality Explanation


### `deposit`

Allows users to deposit ETH into the vault. The ETH is wrapped as WETH, swapped to the vault's asset using Uniswap V3, and converted to vault shares. The shares are then minted and transferred to the receiver address.

### `withdraw`

Allows users to withdraw ETH by burning their vault shares. The function converts the shares back to the asset, swaps the asset to ETH using Uniswap V3, and transfers the ETH to the receiver address.

### `rebalance`

Rebalances the vault by supplying assets to Aave and borrowing additional assets. This function handles token swaps and ensures the vault's balance is adjusted according to the new strategy.

### `leverage`

Increases the vault's exposure by supplying additional assets to Aave and borrowing more assets. This function adjusts the vault's leverage by using token swaps and Aave's lending protocol.

### `deleverage`

Reduces the vault's leverage by repaying Aave loans and withdrawing assets. The function handles token swaps to convert the withdrawn assets back to ETH, effectively reducing the vault's leverage.

### `executeOperation`

Handles flash loan operations. It decodes the action type and parameters, performs the corresponding financial operation (rebalance, leverage, deleverage), and repays the flash loan with interest.

### `callVaultAction`

Triggers a flash loan from Aave and executes a specified vault action based on the provided parameters. This function is only callable by the governance address.
