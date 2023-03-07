import React, {useEffect, useState} from "react";
import {useWallet} from "@solana/wallet-adapter-react";
import {
    useClaimNFT,
    useLogin,
    useLogout,
    useProgram,
    useUser,
    useDropUnclaimedSupply,
    useNFTs,
} from "@thirdweb-dev/react/solana";
import {wallet} from "./_app";
import {useRouter} from "next/router";
import {NFT} from "@thirdweb-dev/sdk";
import Link from "next/link";
import Image from "next/image";


function LoginPage() {
        const [usersNFT, setUsersNft] = useState<NFT | 
        undefined>();
        const login = useLogin();
        const logout = useLogout();
        const router = useRouter();
        const {user} = useUser();
        const {publicKey, connect, select} = useWallet();

        const {program} = useProgram(
            process.env.NEXT_PUBLIC_PROGRAM_ADDRESS,
            "nft-drop"
        );

        const {data:unclaimedSupply} = useDropUnclaimedSupply(program);
        const {data: nfts, isLoading} = useNFTs(program);
        const {mutateAsync: claim} = useClaimNFT(program);

        useEffect(() => {
            if (!publicKey) {
                select(wallet.name);
                connect();
            }
        }, [publicKey, wallet]);

        useEffect(()=>{
            if(!user || !nfts) return;

            const usersNft = nfts.find((nft) => nft.owner === user?.address);

            if(usersNft){
                setUsersNft(usersNft);
            }
        }, [nfts, user]);

        const handleLogin = async ()=>{
            await login();
            router.replace("/");
        };

        const handlePurchase = async () =>{
            await claim({
                amount: 1,
            });
            router.replace("/");
        };


    return(
        <div className="flex min-h-screen flex-col items-center justify-center text-center bg-h-24 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500">
            <div className="absolute top-20 left-0 w-full h-1/4 bg-fuchsia-600 -skew-y-6 z-10 overflow-hidden shadow-xl"

/>
        <Image 
        onClick={logout}
          className="mt-5 z-30 shadow-2xl mb-10 rounded-full animate-pulse cursor-pointer"
          src="/avatar1.png"
          alt="logo"
          width={200}
          height={200}
          />

          <main className="z-30 text-black">
            <h1 className="text-4xl font-bold uppercase">
                Welcome to the <span className="text-black-600 animate-pulse">Meta 3.0</span>
            </h1>

        {!user && (
            <div>
                <button 
                onClick={handleLogin}
                className="text-2xl font-bold mb-10 bg-fuchsia-600 text-white py-4 px-10 border-2 border-fusby-fuchsia-600 animate-pulse rounded-md transition duration-200 mt-12"
                >login/connect

                </button>
            </div>
        )}

        {user && (
            <div>
                <p className="text-2xl mt-14 text-fuchsia-600 font-bold mb-5">
                    Welcome {user.address.slice(0,5)}...{user.address.slice(-5)}
                </p>

                

                {usersNFT && (
                    <link 
                    href="/"
                    className="text-2xl font-bold mb-5 bg-fuchsia-600 text-white py-4 px-10 border-2
                    border-fusby-fuchsia-600 animate pulse rounded-md transition duration-200 hover:bg-white
                    hover-text-fuchsia-600 mt-5 uppercase"
                    >
                        ACCESS  GRANTED - ENTER
                        </link>
)}
            </div>
        )}

         
          </main>       
      </div>
    );
    }

export default LoginPage;


        