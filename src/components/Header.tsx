import Link from 'next/link'
import React from 'react'

const Header = () => {
  return (
    <nav className="max-w-5xl m-auto w-full px-4">
        <div className="py-4 flex items-center justify-between gap-8">
            <Link href={"/"} className="text-2xl font-semibold text-black hover:opacity-70">
                devMH
            </Link>
            <div className="flex gap-4 items-center">
                <Link href={"/#features"} className="font-medium text-sm text-black hover:opacity-70">
                Features
                </Link>
                <Link href={"/#pricing"} className="font-medium text-sm text-black hover:opacity-70">
                Pricing
                </Link>
                <Link href={"/dashboard"} className="font-medium text-sm text-white bg-black px-4 py-2 rounded-lg hover:opacity-70">
                Dashboard
                </Link>
            </div>
        </div>
    </nav>
  )
}

export default Header