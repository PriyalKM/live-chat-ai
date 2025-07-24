import Button from "@/components/custom/Button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { summarySections } from "@/data/data";
import { GUEST_IMAGE1, PLUS_ICON, VOICE_ICON } from "@/lib/images";
import { cn } from "@/lib/utils";
import AddToConversation from "@/modal/AddToConversation";
import { useState } from "react";
import useWebSocket from "@/hooks/useWebSocket";
import useAgent from "@/hooks/useAgent";
import { useNavigate } from "react-router";

const Discuss = () => {
    const { disconnectAvatar, connectionStatus, currentSessionId, currentStreamId, playIdleVideo } = useWebSocket();
    const { stopListening } = useAgent();
    const navigate = useNavigate();
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
                <div className="flex flex-col lg:h-[calc(100vh-130px)] space-y-6">
                    <ScrollArea className="flex flex-col flex-1  bg-dark px-3.5 sm:px-5  rounded-[24px] overflow-auto">
                        <div>
                            <div className=" py-4 sm:py-5 border-b sticky top-0 bg-dark border-[#E9E9E9]">
                                <h2 className="text-primary font-semibold text-[20px] sm:text-[24px]">AI-Generated Meeting Notes</h2>
                            </div>
                            <div className="bg-[#F7F7F7] rounded-2xl space-y-7 sm:space-y-8 py-5">
                                {summarySections.map(section => (
                                    <div key={section.label} className="space-y-4">
                                        <div className="">
                                            <span className="bg-[#E9E9E9] text-[#3B4753] px-3 py-1 rounded-[8px] font-medium text-base">{section.label}</span>
                                        </div>
                                        <div className="flex flex-col gap-4">
                                            {section.items.map((item, idx) => (
                                                <div key={item.text} className="w-full md:w-[80%] xl:w-[70%] 2xl:w-1/2">
                                                    {section.label === "Key Points" ? (
                                                        <div className="inline-block bg-white rounded-[24px] rounded-tl-none px-4 py-2 text-primary font-medium text-base">
                                                            {item.text}
                                                        </div>
                                                    ) : (
                                                        <div className={cn("bg-white rounded-[24px] rounded-tl-none px-4 py-3 text-primary font-medium text-base", section.label === "Action Items" && "rounded-none")}>
                                                            <div>{item.text}</div>
                                                            {item.subtext && (
                                                                <div className="text-secondary italic text-sm mt-1">{item.subtext}</div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </ScrollArea>
                    <div className="space-y-6 sm:space-y-4">
                        <div className="flex items-center gap-4">
                            {participants.map((participant, index) => (
                                <div key={index} className="rounded-[20px]w-[180px] h-[130px] relative">
                                    <div className="bg-primary/35 size-[30px]  backdrop-blur-[6px] rounded-full flex justify-center items-center absolute top-2 right-2">
                                        <img src={VOICE_ICON} alt="voice" />
                                    </div>
                                    <div className="absolute bottom-0 left-0 w-full pb-3 flex items-center justify-center">
                                        <span className="bg-primary/35 text-white rounded-[20px] px-3 py-1 backdrop-blur-[6px] text-sm">Guest {index + 1}</span>
                                    </div>
                                    <img className="w-full h-full object-cover rounded-[20px]" src={participant.image} alt={`Guest ${index + 1}`} />
                                </div>
                            ))}
                            <div onClick={() => setAddConversation({ open: true, data: null })} className="w-[180px] h-[130px] bg-[#1455D21F] rounded-[20px] flex items-center gap-1 cursor-pointer justify-center">
                                <img src={PLUS_ICON} alt="plus" />
                                <span className="font-semibold text-main text-lg">Invite</span>
                            </div>
                        </div>
                        {connectionStatus === 'connected' && currentSessionId && currentStreamId && <div className="flex justify-center">
                            <Button onClick={() => {
                                disconnectAvatar();
                                stopListening();
                                navigate('/home')
                            }} className="bg-[#FF3B30] rounded-[12px] max-sm:text-sm max-sm:py-3 w-max px-7">
                                End Conversation
                            </Button>
                        </div>}
                    </div>
                </div>
            </div>
            <AddToConversation data={addConversation} setData={setAddConversation} />
        </>
    )
}

export default Discuss;
