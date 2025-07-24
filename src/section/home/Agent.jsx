import Button from "@/components/custom/Button";
import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from "react-router";
import { AI_AGENT_IMAGE, STOP_RECORD_ICON } from "@/lib/images";
import useAgent from "@/hooks/useAgent";
import useWebSocket from "@/hooks/useWebSocket";
import { useEffect } from "react";
import { Bars, ThreeDots } from "react-loader-spinner";

export default function Agent({ isAgentNotInclude }) {
  const { startListening, stopListening, listening, loading } = useAgent();
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const {
    connectionStatus,
    backendStatus,
    currentStreamId,
    currentSessionId,
    wsConfig,
    idleImageRef,
    idleVideoRef,
    streamVideoRef,
    connectWebSocket,
    backendAvailable,
    showIdleState
  } = useWebSocket();


  useEffect(() => {
    showIdleState();
  }, [showIdleState]);

  useEffect(() => {
    if (wsConfig && wsConfig.thumbnail_url && idleImageRef.current) {
     // idleImageRef.current.src = AI_AGENT_IMAGE;
    } else if (idleImageRef.current) {
      //idleImageRef.current.src = AI_AGENT_IMAGE;
    }
  }, [wsConfig, idleImageRef]);

  const handleConnect = async () => {
    const result = await connectWebSocket();

  };


  return (
    <div className="rounded-[24px] relative ai-agent-bg flex-1">
      <img
        ref={idleImageRef}
        className="absolute top-0 left-0 min-w-full h-full rounded-[24px]  z-[-1] object-cover"
        style={{ opacity: 1 }}
        alt="Avatar"
      />

      <video
        ref={idleVideoRef}
        autoPlay
        className="absolute top-0 left-0 min-w-full h-full rounded-[24px]  z-[-1] object-cover"
        loop
        muted
        playsInline
        style={{ opacity: 0 }}
      />
      <video
        ref={streamVideoRef}
        className="absolute top-0 left-0 min-w-full h-full rounded-[24px]  z-[-1] object-cover"
        autoPlay
        playsInline
        style={{ opacity: 0 }}
      />

      <div className="absolute top-4 left-4 px-6 py-2 rounded-[100px] bg-primary/35 text-white">
        AHA
      </div>
      <div className="absolute bottom-0 left-0 w-full p-5 space-y-4">
        <div className="flex items-center justify-between">
          <button className="flex items-center gap-2 bg-primary/35 text-white px-4 py-2.5 rounded-full font-medium text-base shadow">
            <span className={cn("w-2 h-2 rounded-full inline-block", connectionStatus === "connected" ? "bg-[#34C759]" : "bg-[#FFCC00]")}></span>
            {connectionStatus === "connected" ? "Active" : "Inactive"}
          </button>
          <button className="flex items-center gap-2 bg-primary/35 bg-opacity-80 text-white px-4 py-2.5 rounded-full font-medium text-base shadow">
            <span className="w-5 h-5 flex items-center justify-center rounded-full border border-white">
              <span className="block w-2.5 h-2.5 bg-white rounded-full"></span>
            </span>
            Record
          </button>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => {
            if (isAgentNotInclude && connectionStatus === "disconnected") {
              handleConnect();
              navigate('/discuss')
            } else {
              if (connectionStatus === "connected") {
                startListening();
              } else {
                handleConnect();
              }
            }
          }} disabled={listening || loading || !backendAvailable || backendStatus !== "connected" || connectionStatus === "connecting" || !(pathname.includes("/discuss") || pathname.includes('/home'))} className="flex-1 disabled:!cursor-default max-sm:py-3.5 max-sm:text-sm disabled:bg-[#4F80DD]">
            {
              connectionStatus === "disconnected" ?
                "Let's Discuss!" :
                connectionStatus === "connecting" ?
                  <div className="flex items-center gap-2">
                    <span className="font-normal text-white/70">Connecting</span>
                    <ThreeDots
                      visible={true}
                      height="30"
                      width="30"
                      color="#FFFFFFB3"
                      radius="15"
                      ariaLabel="three-dots-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                    />
                  </div>
                  :
                  connectionStatus == "connected" && (!currentStreamId || !currentSessionId) ?
                    <div className="flex items-center gap-2">
                      <span className="font-normal text-white/70">Configuring</span>
                      <ThreeDots
                        visible={true}
                        height="30"
                        width="30"
                        color="#FFFFFFB3"
                        radius="15"
                        ariaLabel="three-dots-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                      />
                    </div>
                    :
                    listening ?
                      <div>
                        <Bars
                          height="28"
                          width="28"
                          color="white"
                          ariaLabel="bars-loading"
                          wrapperStyle={{}}
                          wrapperClass=""
                          visible
                        />
                      </div> :
                      loading ?
                        <div className="flex items-center gap-2">
                          <span className="font-normal text-white/70">Thinking</span>
                          <ThreeDots
                            visible={true}
                            height="30"
                            width="30"
                            color="#FFFFFFB3"
                            radius="15"
                            ariaLabel="three-dots-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                          />
                        </div> : "Speak to AHA"}
          </Button>
          {
            listening && connectionStatus === 'connected' && <button onClick={stopListening} className="flex items-center justify-center" type="button">
              <img className="size-[32px]" src={STOP_RECORD_ICON} alt="" />
            </button>
          }
        </div>
      </div>
    </div>
  );
} 