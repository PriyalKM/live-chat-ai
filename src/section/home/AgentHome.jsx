import Button from "@/components/custom/Button";
import { useSelector } from "react-redux";
import { cn } from "@/lib/utils";
import {  useNavigate } from "react-router";
import { BACKGROUND_VIDEO } from "@/lib/images";

export default function AgentHome() {
  const { active } = useSelector((state) => state.agent);

  const navigate = useNavigate();

  return (
    <div className="rounded-[24px] relative ai-agent-bg flex-1">
      <video
        loop
        playsInline
        className="absolute top-0 left-0 min-w-full h-full rounded-[24px]  z-[-1] object-cover"
      >
        <source src={BACKGROUND_VIDEO} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute top-4 left-4 px-6 py-2 rounded-[100px] bg-primary/35 text-white">
        AHA
      </div>
      <div className="absolute bottom-0 left-0 w-full p-5 space-y-4">
        <div className="flex items-center justify-between">
          <button className="flex items-center gap-2 bg-primary/35 text-white px-4 py-2.5 rounded-full font-medium text-base shadow">
            <span className={cn("w-2 h-2 rounded-full inline-block", active ? "bg-[#34C759]" : "bg-[#FFCC00]")}></span>
            {active ? "Active" : "Inactive"}
          </button>
          <button className="flex items-center gap-2 bg-primary/35 bg-opacity-80 text-white px-4 py-2.5 rounded-full font-medium text-base shadow">
            <span className="w-5 h-5 flex items-center justify-center rounded-full border border-white">
              <span className="block w-2.5 h-2.5 bg-white rounded-full"></span>
            </span>
            Record
          </button>
        </div>
        <Button onClick={() => {
          navigate('/discuss')
        }} disabled={active} className="w-full disabled:!cursor-default max-sm:py-3.5 max-sm:text-sm disabled:bg-[#4F80DD]">
          Let's Discuss!
        </Button>
      </div>
    </div>
  );
} 