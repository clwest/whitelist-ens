import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { ethers, providers} from "ethers";
import { useEffect, useRef, useState } from "react";

export default function  Home() {
  // Track if wallet is connected
  const [walletConnected, setWalletConnected] = useState(false);
  // Create a Web3 connection
  const web3ModalRef = useRef();
  // ENS 
  const [ens, setENS] = useState("");
  // Save the address of the connected account
  const [address, setAddress] = useState("");

  // Sets the ENS if the current account has one else sets address

  const setENSOrAddress = async (address, web3Provider) => {
    var _ens = await web3Provider.lookupAddress(address);
    // if the address has ens set it
    if (_ens) {
      setENS(_ens);
    } else {
      setAddress(address);
    }
  }

  const getProviderOrSigner = async () => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // make sure we are on Rinkeby
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 4) {
      window.alert("change to rinkeby testnet")
      throw new Error("Please connect to the Rinkeby test network");
    }
    const signer = web3Provider.getSigner();
    const address = await signer.getAddress();
    await setENSOrAddress(address, web3Provider);
    return signer;
  };

  const connectWallet = async () => {
    try {
      await getProviderOrSigner(true);
      setWalletConnected(true);
    } catch (err) {
      console.error(err)
    }
  }

  const renderButton = () => {
    if (walletConnected) {
      <div>Wallet Connected</div>
    } else {
      return (
        <button onClick={connectWallet} className={styles.button}>Connect Wallet</button>
      )
    }
  }

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions: {},
        disableInjectedProvider: false
      })
      connectWallet()
    }
  }, [walletConnected])

  return (
    <div>
      <Head>
        <title>ENS Dapp</title>
        <meta name="description" content="ENS-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>
            Welcome to LearnWeb3 Punks {ens ? ens : address}!
          </h1>
          <div className={styles.description}>
            Its an NFT collection for LearnWeb3 Punks.
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="./learnweb3punks.png" />
        </div>
      </div>

      <footer className={styles.footer}>
        Made with &#10084; by Donky Betz
      </footer>
    </div>
  );
};
