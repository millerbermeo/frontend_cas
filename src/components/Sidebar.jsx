import { ChevronFirst, ChevronLast, MoreVertical, X, Menu, Power, Copyright } from "lucide-react"
import logo from "../assets/logo2.png"
import logo_sena from "../assets/logo_sena.png"
import profile from "../assets/profile.png"
import { createContext, useContext, useState } from "react"
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { ModalLogout } from "../configs/ModalLogout"


const SidebarContext = createContext();

export default function Sidebar({ children }) {
    const [expanded, setExpanded] = useState(true)
    return (
        <>
            <aside className="h-screen">
                <nav className="h-full flex flex-col bg-sky-700 text-white border-r transition-all duration-300 shadow-sm px-2 justify-start">  
                    <div className="p-4 pb-2 flex justify-between items-center text-black">
                       <div className="flex gap-3 items-end">
                       {/* <img src={logo} className={`overflow-hidden duration-300 ease-out rounded-full  ${expanded ? "w-14" : "w-0"}`} /> */}
                        <h1 className={`duration-300 ease-out overflow-hidden transition-all text-3xl text-white font-bold ${expanded ? "w-14" : "w-0"}`}>CAS</h1>
                        {/* <span className={`absolute`}>Centro de acopio SENA</span> */}
                       </div>
                        <button onClick={() => setExpanded((curr) => !curr)} className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100">
                            {expanded ? <Menu /> : <X />}
                        </button>
                    </div>

                    <div className=" mt-5 2xl:mt-10 pt-4 border-t-[1px] border-white border-opacity-50">
                        <span className="ml-3 h-8 items-center flex">
                            MENU
                        </span>

                        <SidebarContext.Provider value={{ expanded }}>

                            <ul className="flex-1 px-3 border-b-[1px] mt-4 py-6 border-white border-opacity-50 border-t-[1px] mb-5">{children}</ul>
                        </SidebarContext.Provider>  
                    </div>

                    <div className="border-t hidden 2xl:flex p-3 mt-[12%]  2xl:mt-[45%] border-white cursor-pointer border-opacity-50">
                        {/* <img src={profile} className="w-10 h-10 rounded-md" /> */}
                        <Power className="ml-2.5" size={20} />
                        <div className={`flex justify-between items-center overflow-hidden  duration-300 cursor-pointer transition-all ${expanded ? "w-40 2xl:w-48 ml-3" : "w-0"} `}>
                            <div className="">
             <ModalLogout/>
                        
                            </div>

                        </div>
                    </div>


                    <div className="absolute flex items-center bottom-5 h-10 p-3">
                        {/* <img src={profile} className="w-10 h-10 rounded-md" /> */}
                        <Copyright className="ml-2.5" size={20} />
                        <div className={`overflow-hidden transition-all duration-300 h-5 ${expanded ? "w-auto ml-3" : "w-0"} `}>
                            <div className="leading-4 text-lg">

                                <h4>Centro de Acopio Sena</h4>
                            </div>

                        </div>
                    </div>

        
                </nav>
            </aside>
        </>
    )
}

export function SidebarItem({ nav, icon, text, active, alert }) {
    const { expanded } = useContext(SidebarContext)

    const { pathname } = useLocation();

    // Determina si la ruta actual coincide con la ruta del SidebarItem
    const isActive = pathname.startsWith(nav);


    return (
        <Link to={nav}>
            <li className={`relative flex items-center  py-2 px-3 my-1 font-medium rounded-md cursor-pointer   group ${isActive ? "bg-gradient-to-tr from-indigo-50 to-indigo-50 text-black duration-300" : "hover:bg-indigo-50  text-white hover:text-black"}`}>
                {icon}
                <span className={`overflow-hidden  ${expanded ? "w-40 2xl:w-48 ml-3" : "w-0"}`}>{text}</span>
                {alert && (
                    <div className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${expanded ? "" : "top-2"}`}>

                    </div>
                )}

                {!expanded && (
                    <div className={`absolute left-full z-10 rounded-md px-2 py-1 ml-6 bg-indigo-50 text-sky-900 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}>
                        {text}
                    </div>
                )}
            </li>
        </Link>
    )
}