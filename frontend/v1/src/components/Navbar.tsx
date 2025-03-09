import Link from "next/link"
import Image from "next/image"

const Navbar = () => {
  return (
    <div className="p-4 sticky top-0 border-b-2 flex justify-between items-center bg-secondary">
      <Link href="/">
        <Image 
        src="/logo.png"
        width={40}
        height={40}
        alt="Logo"
        />
      </Link>
      

    </div>
  )
}

export default Navbar