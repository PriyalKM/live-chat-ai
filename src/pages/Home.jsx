import RadialChart from "@/components/chart/RadialChart";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cards } from "@/data/data";
import { ARROW_ICON, FIANANCE_ICON, GUEST_IMAGE1, USERS_ICON } from "@/lib/images";
import AddToConversation from "@/modal/AddToConversation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";

const Home = () => {
    const { active } = useSelector((state) => state.agent);
    const dispatch = useDispatch();
    const [addConversation, setAddConversation] = useState({
        open: false,
        data: null
    });
    const [participants, setParticipants] = useState([
        {
            id: 1,
            image: GUEST_IMAGE1
        }
    ]);
    return (
        <>
            <div className='lg:flex-1 flex flex-col lg:overflow-hidden'>
                <ScrollArea className="flex flex-col lg:h-[calc(100vh-130px)] rounded-2xl">
                    <div className="bg-dark flex-1 px-5 sm:px-6 2xl:px-10 pt-7 sm:pt-8 2xl:pt-14 pb-8 rounded-2xl space-y-7 2xl:space-y-9">
                        <div className="space-y-2.5">
                            <p className="text-center text-primary font-bold text-[24px] 2xl:text-[28px]">Good Morning, CEO!</p>
                            <p className="text-center text-secondary text-lg">Here’s a quick snapshot of how you need to start your day</p>
                        </div>
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 2xl:gap-10">
                                <div className="bg-white p-6 rounded-2xl">
                                    <div>
                                        <p className="text-primary font-bold text-[20px] 2xl:text-[22px]">Operational Readiness</p>
                                    </div>
                                    <div className="relative">
                                        <RadialChart value={84} />
                                        <div className="absolute top-0 2xl:top-2 left-0 w-full h-full flex flex-col gap-2 2xl:gap-4 items-center justify-center">
                                            <div className="w-12 h-12  bg-light rounded-[20px] flex items-center justify-center">
                                                <img src={USERS_ICON} alt="fianance" />
                                            </div>
                                            <div className="text-primary font-bold text-[24px] 2xl:text-[30px]">
                                                68
                                            </div>
                                        </div>
                                        <p className="text-secondary relative 2xl:-top-4 2xl:px-6 text-base 2xl:text-lg text-center">Great day yesterday and all of last week, with some ares to improve on Marketing and Pricing</p>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl">
                                    <div>
                                        <p className="text-primary font-bold text-[20px] 2xl:text-[22px]">Financial Health</p>
                                    </div>
                                    <div className="relative">
                                        <RadialChart value={79} />
                                        <div className="absolute top-0 2xl:top-2 left-0 w-full h-full flex flex-col gap-2 2xl:gap-4 items-center justify-center">
                                            <div className="w-12 h-12  bg-light rounded-[20px] flex items-center justify-center">
                                                <img src={FIANANCE_ICON} alt="fianance" />
                                            </div>
                                            <div className="text-primary font-bold text-[24px] 2xl:text-[30px]">
                                                82
                                            </div>
                                        </div>
                                        <p className="text-secondary relative 2xl:-top-4 2xl:px-6 text-base 2xl:text-lg text-center">Focus is needed on the topline numbers to ensure the gap is closed to plan for rest of quarter</p>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                                {
                                    cards.map((card, index) => (
                                        <div
                                            key={index}
                                            className="flex-1 bg-white rounded-[24px] p-4 sm:p-6 flex flex-col justify-between"
                                        >
                                            <div className="space-y-0.5 sm:space-y-1">
                                                <div className="font-bold text-lg text-primary">{card.title}</div>
                                                <div className="text-secondary text-base">{card.subtitle}</div>
                                            </div>
                                            <div className="flex justify-end">
                                                <Link to={card.to} className="bg-light rounded-[12px] sm:rounded-[18px] p-1">
                                                    <img className="max-sm:w-8" src={ARROW_ICON} alt="" />
                                                </Link>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>

                </ScrollArea>
            </div>
            <AddToConversation data={addConversation} setData={setAddConversation} />
        </>
    )
}

export default Home;
