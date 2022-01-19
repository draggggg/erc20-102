
var TDErc20 = artifacts.require("ERC20TD.sol");
var ERC20Claimable = artifacts.require("ERC20Claimable.sol");
var evaluator = artifacts.require("Evaluator.sol");
const exerciceSolution= artifacts.require("ExerciceSolution.sol");
const ERC20Mintable= artifacts.require("ERC20Mintable")
const account= "0x488016c7e4DD2A3c23FD072BaD5C71B6609642dD"

module.exports = (deployer, network, accounts) => {
    deployer.then(async () => {
        await deployTDToken(deployer, network, accounts); 
        await deployEvaluator(deployer, network, accounts); 
        await setPermissionsAndRandomValues(deployer, network, accounts); 
        await deployRecap(deployer, network, accounts);
		await doExercices(deployer, network, accounts);
    });
};

async function deployTDToken(deployer, network, accounts) {
	TDToken = await TDErc20.new("TD-ERC20-101","TD-ERC20-101",web3.utils.toBN("20000000000000000000000000000"))
	ClaimableToken = await ERC20Claimable.new("ClaimableToken","CLTK",web3.utils.toBN("20000000000000000000000000000"))
}

async function deployEvaluator(deployer, network, accounts) {
	Evaluator = await evaluator.new(TDToken.address, ClaimableToken.address)
}

async function setPermissionsAndRandomValues(deployer, network, accounts) {
	await TDToken.setTeacher(Evaluator.address, true)
}

async function deploySolution(deployer, network, accounts) {
	MintableERC20 = await ERC20Mintable.new("ERC20", "ERC20", 1000000)
	Solution = await exerciceSolution.new(ClaimableToken.address, MintableERC20.address, {from:account})
	await MintableERC20.setMinter(Solution.address, true, {from:account})
}

async function deployRecap(deployer, network, accounts) {
	console.log("TDToken " + TDToken.address)
	console.log("ClaimableToken " + ClaimableToken.address)
	console.log("Evaluator " + Evaluator.address)
}

async function doExercices(deployer, network, accounts){

	// score
	console.log("'''''''''''' Score ''''''''''''")
	const startBalance = await TDToken.balanceOf(accounts[0])
	console.log("startBalance " + startBalance)

	// deploy solution
	await deploySolution(deployer, network, accounts)

	// submit exercice
	console.log("'''''''''''' Submit Exercice ''''''''''''")
	await Evaluator.submitExercice(Solution.address , {from:account})
	const submit_balance = await TDToken.balanceOf(account)
	console.log("submit_balance " + submit_balance)

	// exercice1
	console.log("'''''''''''' Exercice 1 ''''''''''''")
	await ClaimableToken.claimTokens({from: account})
	await Evaluator.ex1_claimedPoints({from: account})
	const ex1_balance = await TDToken.balanceOf(account)
	console.log("ex1_balance " + ex1_balance)

	// exercice2
	console.log("'''''''''''' Exercice 2 ''''''''''''")
	await Evaluator.ex2_claimedFromContract({from: account})
	const ex2_balance = await TDToken.balanceOf(account)
	console.log("ex2_balance " + ex2_balance)

	// exercice3
	console.log("'''''''''''' Exercice 3 ''''''''''''")
	await Evaluator.ex3_withdrawFromContract({from: account})
	const ex3_balance = await TDToken.balanceOf(account)
	console.log("ex3_balance " + ex3_balance)

	// exercice4
	console.log("'''''''''''' Exercice 4 ''''''''''''")
	await ClaimableToken.approve(Solution.address ,200,{from: account})
	await Evaluator.ex4_approvedExerciceSolution({from: account})
	const ex4_balance = await TDToken.balanceOf(account)
	console.log("ex4_balance " + ex4_balance)

	// exercice5
	console.log("'''''''''''' Exercice 5 ''''''''''''")
	await ClaimableToken.approve(Solution.address ,0,{from: account})
	await Evaluator.ex5_revokedExerciceSolution({from: account})
	const ex5_balance = await TDToken.balanceOf(account)
	console.log("ex5_balance " + ex5_balance)

	// exercice6
	console.log("'''''''''''' Exercice 6 ''''''''''''")
	await Evaluator.ex6_depositTokens({from: account})
	const ex6_balance = await TDToken.balanceOf(account)
	console.log("ex6_balance " + ex6_balance)

	// exercice7
	console.log("'''''''''''' Exercice 7 ''''''''''''")
	await Evaluator.ex7_createERC20({from: account})
	const ex7_balance = await TDToken.balanceOf(account)
	console.log("ex7_balance " + ex7_balance)

	// exercice8
	console.log("'''''''''''' Exercice 8 ''''''''''''")
	await Evaluator.ex8_depositAndMint({from: account})
	const ex8_balance = await TDToken.balanceOf(account)
	console.log("ex8_balance " + ex8_balance)

	// // exercice9
	// console.log("'''''''''''' Exercice 9 ''''''''''''")
	// await Evaluator.ex9_withdrawAndBurn({from: account})
	// const ex9_balance = await TDToken.balanceOf(account)
	// console.log("ex9_balance " + ex9_balance)
}

