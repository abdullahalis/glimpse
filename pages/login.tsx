import { useState } from "react";
import { useRouter } from "next/router";
import supabase from "@/utils/supabaseClient";
import glimpse_white from '../glimpse_white.svg'
import Image from 'next/image'

export default function Login() {
    const [email, setEmail] = useState<string | undefined>();
    const [password, setPassword] = useState<string | undefined>();

    const router = useRouter();

    async function loginWithEmail() {
        try {
            if (email && password) {
                const resp = await supabase.auth.signInWithPassword({
                    email: email, 
                    password: password,
                });
                if (resp.error) throw resp.error;
                const userId = resp.data.user?.id;

                console.log("userId: ", userId);
                try {
                    const { data, error} = await supabase.from("users")
                    .select("username")
                    .eq("id", userId);

                    if (error) {
                        throw error;
                    }
                    console.log("data: ", data);
                    router.push("/" + data[0]["username"]);
                  }
                  catch (error) {
                    console.log("error", error);
                  }
                
            }
        }
        catch (error) {
            console.log("error", error);
        }
    }
    return (
        <div className="flex flex-col  w-full justify-center items-center">
            <Image className="lg:w-2/6 md:w-3/6 w-5/6 mb-10 object-cover object-center mt-16" alt="loho" src={glimpse_white} />
            <div className="w-full max-w-xs">
                <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        id="email" 
                        type="text" 
                        placeholder="you@example.com"
                        onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
                        id="password" 
                        type="password" 
                        placeholder="password"
                        onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center justify-between flex-col">
                    <button className="hover:bg-[#006363] bg-[#008080]/100 font-bold text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline w-24" 
                        type="button"
                        onClick={loginWithEmail}
                        >
                        Login
                    </button>
                    </div>
                </form>
            </div>
        </div>
    );
}