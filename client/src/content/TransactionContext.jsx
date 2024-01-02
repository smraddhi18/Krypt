import React, {useEffect, useState} from 'react';
import { ethers } from "ethers";
import {contractABI, contractAddress} from '../utils/constants';

//const {ethers} =require("ethers")
export const TransactionContext=React.createContext();

const {ethereum}=window

// const getEthereumContract=()=>{
//     const provider =new ethers.providers.Web3Provider(ethereum)
//     const signer=provider.getSigner()
//     const transactionContract=new ethers.Contract(contractAddress,contractABI,signer);
//     console.log({provider,signer,transactionContract})
// }
const createEthereumContract = async() => {
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const transactionsContract = await new ethers.Contract(contractAddress, contractABI, signer);
//     provider.getNetwork()
//   .then(network => {
//     console.log(`Connected to ${network.url}`);
//   })
//   .catch(error => {
//     console.error(error);
//   });
   // await transactionsContract.waitForDeployment();
   return(transactionsContract)
  };

export const TransactionProvider=({children})=>{
    
        const [connectedAccount, setCurrentAccount]=useState('');
        const [formData, setFormData] = useState({addressTo:'',amount:'',keyword:'',message:''});
        const [loading,setLoading]=useState(false)
        const [transactionCount,setTransactionCount]=useState(localStorage.getItem(`transactionCount`))
        const [getTransactions,setTransactions]=useState({})
        const handleChange=(e,name)=>{
            setFormData((prevState)=>({...prevState,[name]:e.target.value}))
        }
        const getAllTransactions = async()=>{
            try{
                if(!ethereum) return alert("Please install metamask")
                const transactionContract= createEthereumContract();
                const availableTransactions=await transactionContract.getTransactionCount();
                console.log(availableTransactions);

                const structuredTransactions=availableTransactions.map((transactions)=>({
                    addressTo:transactions.receiver,
                    addressFrom:transactions.sender,
                    timestamp:new Date(transactions.timestamp.toNumber*1000).toLocaleString(),
                    message:transactions.message,
                    keyword:transactions.keyword,
                    amount: parseInt(transactions.amount._hex)/(10**18)

                }))
                console.log(structuredTransactions)
                structuredTransactions(structuredTransactions)
                setTransactions(structuredTransactions)
            }
            catch(error){
                console.log(error);
            }
        }
        const checkIfWalletIsConnected = async()=>{
       try{
            if(!ethereum) return alert("Please install metamask")
            const accounts=await ethereum.request({method:'eth_accounts'})
            if(accounts.length){
                setCurrentAccount(accounts[0])
                //console.log(window.ethereum)
                getAllTransactions()
            }
            else{
                console.log("No accounts Found")
            }
            
    }
    catch (error) {
        console.log(error)
            throw new Error("No ethereum object")
        }
    } 
    
const checkIfTransactionExist=async()=>{
    try{
        const transactionContract= createEthereumContract();
        console.log(transactionContract);
        const transactionCount=await transactionContract.getTransactionCount()
        window.localStorage.setItem("transactionCount",transactionCount)
    }
    catch(error){
        console.log(error)
        throw new Error("No ethereum object")
    }
    
}  
    const connectWallet = async()=>{
        try{
            if(!ethereum) return alert("Please install metamask")

            const accounts=await ethereum.request({method:'eth_requestAccounts'})
            setCurrentAccount(accounts[0])
        }
        catch(error){
            console.log(error)
            throw new Error("No ethereum object")
        }
    }

    const sendTransaction = async()=>{
        try {
            if(!ethereum) return alert("Please install metamask")

            //get data from form
            const {addressTo,amount,keyword,message}=formData
           // getEthereumContract();
           const transactionContract=await createEthereumContract()
           //const parsedAmount = ethers.utils.parseEther(amount); // Use ethers.utils.parseEther
        //    await ethereum.request({
        //     method:'eth_sendTransaction',
        //     params:[{
        //         from: connectedAccount, 
        //         to: addressTo,
        //         gas:'0x5208',//21000 gwei
        //         value:amount,
        //    }]
        // })
       
        const transactionHash=await transactionContract.addBlockchain(addressTo,amount,message,keyword)
            setLoading(true)
            console.log(`Loading-${transactionHash.hash}`)
            await transactionHash.wait(1);
            setLoading(false)
            console.log(`Success-${transactionHash.hash}`)

           const transactionCount=await transactionContract.getTransactionCount()
            setTransactionCount(transactionCount.toNumber())


         } catch (error) {
            console.log(error)
            throw new Error("No ethereum object")
        }
    }

    useEffect(()=>{
        checkIfWalletIsConnected();
        checkIfTransactionExist();
    },[]);
return(
   <TransactionContext.Provider value={{connectWallet,connectedAccount,formData,setFormData,handleChange,sendTransaction,getTransactions,loading}}>
    {children}
    </TransactionContext.Provider>

)
}