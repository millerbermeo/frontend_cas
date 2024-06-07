import React from 'react'

import { Dropdown, Link, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import { ModalUser } from './utils/ModalUser';



export const Navbar = ({ tittle }) => {
    return (
        <>
            <nav
                className="sticky top-0 flex z-20 border-b-4 border-b-white w-full flex-wrap items-center justify-between bg-zinc-100 rounded mt-3 py-2 shadow-dark-mild dark:bg-neutral-700 lg:py-4">
                <div className="flex w-full flex-wrap items-center justify-between px-3">
                    <div className="ms-2">
                        <h2 className="text-xl text-black dark:text-white" href="#"
                        >{tittle}</h2>

                    
                    </div>

                    <ModalUser/>
                  
                 
                       



                </div>
            </nav>
        </>
    )
}
