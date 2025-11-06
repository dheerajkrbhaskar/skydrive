import { Link } from "react-router-dom"
import { CloudUpload } from "lucide-react"

const Title = () => {
    return (
        <div><Link
            to="/"
            className="group flex items-center gap-2 md:gap-3 rounded-lg pr-2 md:pr-3"
        >

            <CloudUpload
                className="w-8 h-8 md:w-10 md:h-10 text-indigo-600 transition-transform duration-200 group-hover:scale-[1.03]
                [&_*]:fill-none"
                strokeWidth={2.2}
            />


            <span
                className="text-3xl hidden lg:block font-semibold leading-none
               bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent
               tracking-tight"
            >
                SkyDrive
            </span>

        </Link></div>
    )
}

export default Title