


const main=async ()=> {
  const [owner, otherAccount] = await ethers.getSigners();
  const TransactionFactory=await hre.ethers.getContractFactory("Transactions");
  const transactions =await TransactionFactory.deploy();
  await transactions.waitForDeployment()

  console.log(`Transactions deployed to: ${transactions.target}`);
  // const txresponse=await transactions.addBlockchain('0xa834a617C52146caA9D7Ebb16afEd9c0bE4fF3EC',1000000,'text','text');
  // const txreceipt=await txresponse.wait(2);
  // const transaction =await transactions.getTransactionCount();
  // console.log(transaction.toString());
}

const runMain=async ()=>{
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

runMain();