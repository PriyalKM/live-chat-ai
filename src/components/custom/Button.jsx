import { cn } from "@/lib/utils"

const Button = ({ type = "button", className = "", children, ...props }) => {
    return (
        <button type={type} className={cn("bg-main flex font-semibold justify-center items-center text-center px-5 disabled:bg-main/70 text-white cursor-pointer  w-full rounded-[10px] py-3.5", className)} {...props}>
            {children}
        </button>
    )
}

export default Button;
