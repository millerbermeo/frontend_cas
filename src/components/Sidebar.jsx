import { ChevronFirst, ChevronLast, MoreVertical, X, Menu, Power, Copyright } from "lucide-react"
import logo from "../assets/logo.png"
import logo_sena from "../assets/logo_sena.png"
import profile from "../assets/profile.png"
import { createContext, useContext, useState } from "react"
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const SidebarContext = createContext();

export default function Sidebar({ children }) {
    const [expanded, setExpanded] = useState(true)
    return (
        <>
            <aside className="h-screen">
                <nav className="h-full flex flex-col bg-[#003366] text-white border-r shadow-sm px-2 justify-start">
                    <div className="p-4 pb-2 flex justify-between items-center text-black">
                        {/* <img src={logo} className={`overflow-hidden transition-all  ${expanded ? "w-32" : "w-0"}`} /> */}
                        <button onClick={() => setExpanded((curr) => !curr)} className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100">
                            {expanded ? <Menu /> : <X />}
                        </button>
                    </div>

                    <div className="mt-10 pt-4 border-t-[1px]">
                        <span className="ml-3 h-8 items-center flex">
                            MENU
                        </span>

                        <SidebarContext.Provider value={{ expanded }}>

                            <ul className="flex-1 px-3 border-b-[1px] mt-4 py-6 border-t-[1px] mb-5">{children}</ul>
                        </SidebarContext.Provider>
                    </div>

                    <div className="border-t flex p-3 mt-28">
                        {/* <img src={profile} className="w-10 h-10 rounded-md" /> */}
                        <Power className="ml-2.5" size={20} />
                        <div className={`flex justify-between items-center overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"} `}>
                            <div className="leading-4">
                                {/* <h4 className="font-semibold">constGenius</h4>
                                <span className="text-xs text-gray-600">constgenius@gmail.com</span> */}
                                <h4>Logout</h4>
                            </div>

                        </div>
                    </div>


                    <div className="absolute flex items-center bottom-5 h-10 p-3 mt-28">
                        {/* <img src={profile} className="w-10 h-10 rounded-md" /> */}
                        <Copyright className="ml-2.5" size={20} />
                        <div className={`overflow-hidden h-5 ${expanded ? "w-auto ml-3" : "w-0"} `}>
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
            <li className={`relative flex items-center text-white py-2 px-3 my-1 font-medium rounded-md cursor-pointer  group ${isActive ? "bg-gradient-to-tr from-indigo-200 to-indigo-100  text-black" : "hover:bg-indigo-200 hover:text-black"}`}>
                {icon}
                <span className={`overflow-hidden  ${expanded ? "w-52 ml-3" : "w-0"}`}>{text}</span>
                {alert && (
                    <div className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${expanded ? "" : "top-2"}`}>

                    </div>
                )}

                {!expanded && (
                    <div className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}>
                        {text}
                    </div>
                )}
            </li>
        </Link>
    )
}