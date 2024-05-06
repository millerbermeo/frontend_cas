import React from 'react'

export const Navbar = () => {
    return (
        <>
            <nav
                className="sticky top-0 flex z-20  w-full flex-wrap items-center justify-between bg-zinc-100 rounded mt-3 py-2 shadow-dark-mild dark:bg-neutral-700 lg:py-4">
                <div className="flex w-full flex-wrap items-center justify-between px-3">
                    <div className="ms-2">
                        <a className="text-xl text-black dark:text-white" href="#"
                        >Sticky top</a
                        >
                    </div>
                </div>
            </nav>
        </>
    )
}
