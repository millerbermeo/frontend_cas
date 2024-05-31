import React from 'react'
import { User } from "@nextui-org/user";
import { Dropdown, Link, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";


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

                   

                    <Dropdown backdrop="opaque">
                        <DropdownTrigger>
                        <User
                        name="Miller Rivera"
                        description="Administrador"
                        avatarProps={{
                            src: "https://i.pravatar.cc/150?u=a04258114e29026702d"
                        }}
                    />
                        </DropdownTrigger>
                        <DropdownMenu variant="faded" aria-label="Static Actions">
                            <DropdownItem key="new">New file</DropdownItem>
                            <DropdownItem key="copy">Copy link</DropdownItem>
                            <DropdownItem key="edit">Edit file</DropdownItem>
                            <DropdownItem key="delete" className="text-danger" color="danger">
                                Delete file
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>



                </div>
            </nav>
        </>
    )
}
