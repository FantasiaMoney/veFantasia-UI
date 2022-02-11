const VTokenToTokenViewHelperABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "balanceBefore",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "balanceAfter",
				"type": "uint256"
			}
		],
		"name": "calculateDeposit",
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
				"name": "duration",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_startTime",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "balanceBefore",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "balanceAfter",
				"type": "uint256"
			}
		],
		"name": "calculateReturn",
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
]

export default VTokenToTokenViewHelperABI
