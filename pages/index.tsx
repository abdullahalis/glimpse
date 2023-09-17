import Image from 'next/image'
import { useEffect, useState } from 'react'
import supabase from '@/utils/supabaseClient'
import ImageUploading, { ImageListType } from 'react-images-uploading'
import { useRouter } from 'next/router'
import React from 'react';
import glimpse_white from '../glimpse_white.svg'
import glimpse from '../glimpse.svg'
import {
    Navbar,
    MobileNav,
    Typography,
    Button,
    IconButton,
  } from "@material-tailwind/react";

export default function Home() {

    const [openNav, setOpenNav] = React.useState(false);

    const router = useRouter();
 
    React.useEffect(() => {
        window.addEventListener(
        "resize",
        () => window.innerWidth >= 960 && setOpenNav(false),
        );
    }, []);
    
    // const navList = (
    //     <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
    //     <Typography
    //         as="li"
    //         variant="small"
    //         color="blue-gray"
    //         className="p-1 font-normal"
    //     >
    //         <a href="#" className="flex items-center text-gray-900">
    //         Pages
    //         </a>
    //     </Typography>
    //     <Typography
    //         as="li"
    //         variant="small"
    //         color="blue-gray"
    //         className="p-1 font-normal"
    //     >
    //         <a href="#" className="flex items-center text-gray-900">
    //         Account
    //         </a>
    //     </Typography>
    //     <Typography
    //         as="li"
    //         variant="small"
    //         color="blue-gray"
    //         className="p-1 font-normal"
    //     >
    //         <a href="#" className="flex items-center text-gray-900">
    //         Blocks
    //         </a>
    //     </Typography>
    //     <Typography
    //         as="li"
    //         variant="small"
    //         color="blue-gray"
    //         className="p-1 font-normal"
    //     >
    //         <a href="#" className="flex items-center text-gray-900">
    //         Docs
    //         </a>
    //     </Typography>
    //     </ul>
    // );

    return (
        <div className="w-screen h-screen text-white" style={{
          background: "linear-gradient(90deg, rgba(17, 24, 39, 1) 48%, rgba(0, 128, 128, 1) 100%)"
        }}>
            <div className='text-[#111827]'>.</div>
            <Navbar className="mx-auto max-w-screen-xl py-2 px-4 lg:px-8 lg:py-4 rounded-full">
                <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
                    {/* <Typography
                    as="a"
                    href="#"
                    className="mr-4 cursor-pointer py-1.5 font-medium text-gray-900"
                    >
                    Home 
                    </Typography> */}
                    <Image className=" w-40 object-center cursor-pointer" alt="loho" src={glimpse} 
                    onClick={(e) => {
                        router.push("/");
                    }}/>
                    
                    <Image className=" w-40 object-center" alt="loho" src={glimpse_white} />
                    {/* <div className="hidden lg:block">{navList}</div> */}
                    <div>
                        <Button size="sm" className="hover:bg-gray-200 bg-gray-50 rounded-full lg:inline-block rounded-full text-[#111827]/75 mr-2 w-24"
                            onClick={(e) => {
                                router.push("/login");
                            }}>
                            Login
                        </Button>
                        <Button variant="gradient" size="sm" className="hover:bg-[#111827] bg-[#111827]/75 rounded-full lg:inline-block focus:outline-none focus:shadow-outline rounded-full w-24"
                            onClick={(e) => {
                                router.push("/signup");
                            }}>
                            Sign Up
                        </Button>
                    </div>
                    
                    {/* <IconButton
                    variant="text"
                    className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
                    ripple={false}
                    onClick={() => setOpenNav(!openNav)}
                    >
                    {openNav ? (
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        className="h-6 w-6"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                        </svg>
                    ) : (
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                        </svg>
                    )}
                    </IconButton> */}
                </div>
                <MobileNav open={openNav}>
                    <div className="container mx-auto">
                    {/* {navList} */}
                    <button
                        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Sign Up
                    </button>
                    </div>
                </MobileNav>
            </Navbar>
            <div className="container mx-auto flex px-5 py-24 items-center justify-center flex-col">
                <Image className="lg:w-2/6 md:w-3/6 w-5/6 mb-10 object-cover object-center" alt="loho" src={glimpse_white} />
                <div className="text-center lg:w-5/12 w-full mt-4">
                    <h1 className="my-4 text-5xl font-bold leading-tight">
                        A Glimpse of You, In Just One Link
                    </h1>
                    <p className="text-2xl mb-8">
                        Share the full spectrum of your work, connect with your audience, and make your online presence truly seamless - all with just one convenient link.
                    </p>
                    <div className="flex justify-center mx-auto">
                        <button
                            className="hover:bg-gray-200 bg-white text-gray-800 font-bold rounded-full  py-4 px-8"
                            onClick={(e) => {
                                router.push("/signup");
                            }}>
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </div >
      );
}
