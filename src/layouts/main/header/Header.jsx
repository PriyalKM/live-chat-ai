import Button from "@/components/custom/Button";
import { HEADER_LOGO, HEADER_LOGO_SMALL } from "@/lib/images";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useLocation } from "react-router";
import { cn } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { endCall, startCall } from "@/redux/slice/agent.slice";
import useAgent from "@/hooks/useAgent";

export default function Header() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { togglePlayback } = useAgent();
    const [isOpen, setIsOpen] = useState(false);
    const { pathname } = useLocation();
    const navItems = [
        { path: "/questions", label: "Q&As" },
        { path: "/follow_ups", label: "Follow-Ups" },
        { path: "/alerts", label: "Alerts" }
    ];

    return (
        <>
            <header className="">
                <div className="bs-container-xl max-xl:px-8 max-sm:px-4">
                    <div className="bg-light rounded-2xl flex flex-row items-center justify-between gap-4 px-4 py-2 sm:py-3 sm:pl-7">
                        <div className="flex items-center gap-3 min-w-max">
                            <Link  to="/home">
                                <img src={HEADER_LOGO} alt="AHA Logo" className="hidden md:block" />
                                <img src={HEADER_LOGO_SMALL} alt="AHA Logo" className="block md:hidden size-[30px]" />
                            </Link>
                        </div>
                        <div className="flex items-center gap-3 md:gap-8 lg:gap-12">
                            <nav className="md:flex hidden gap-8 lg:gap-8 text-secondary font-semibold text-lg">
                                {navItems.map((item, index) => (
                                    <Link
                                        key={index}
                                        to={item.path}
                                        data-active={pathname == item.path}
                                        className="hover:text-white transition hover:bg-main data-[active=true]:bg-main py-2.5 text-[15px] px-5 rounded-md data-[active=true]:text-white"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>
                            <div className={cn("min-w-max", (pathname !== "/" && pathname !== "/home") && "hidden")}>
                                <Button onClick={()=>{
                                    dispatch(startCall({
                                        toggle: togglePlayback
                                    }))
                                    navigate('/discuss')
                                }} className="py-2 sm:py-3 px-4 sm:px-7 max-sm:text-[15px] font-medium">
                                    Speak to AHA
                                </Button>
                            </div>
                            <button type="button" onClick={() => setIsOpen(true)} className="md:hidden"><Menu size={24} color="black" /></button>
                        </div>
                    </div>
                </div>
            </header>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: '-100%' }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: '-100%' }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="fixed inset-0 z-[1000] bg-white justify-between items-center flex flex-col"
                    >
                        <button type="button" onClick={() => setIsOpen(false)} className="place-self-end p-1 rounded-full mt-3 mr-3 bg-[#0D0D0D] w-max"><X size={18} color="white" /></button>
                        <nav className="flex-1 flex items-center">
                            <ul className="space-y-3 text-center">
                                {navItems.map((item, index) => (
                                    <motion.li
                                        key={index}
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Link
                                            to={item.path}
                                            data-active={pathname == item.path}
                                            className="font-semibold text-black hover:text-main data-[active=true]:text-main text-xl transition-colors"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {item.label}
                                        </Link>
                                    </motion.li>
                                ))}
                            </ul>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
} 