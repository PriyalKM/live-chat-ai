import useWebSocket from "@/hooks/useWebSocket";
import { createContext, useEffect, useRef, useState } from "react";

const AgentContext = createContext();

const AgentProvider = ({ children }) => {
  const [microphonePermission, setMicrophonePermission] = useState("prompt");
  const { sendChatMessage, stopAllStreams, stopVideo } = useWebSocket();
  const [microphoneSupported, setMicrophoneSupported] = useState(false);
  const [supportChecking, setSupportChecking] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);

  const play = () => {
    const video = videoRef.current;
    if (!video) return;
    video.play();
    setIsPlaying(true);
  };

  const pause = () => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    setIsPlaying(false);
  };

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const checkSupport = async () => {
      try {
        if (navigator.mediaDevices?.getUserMedia) {
          const result = await navigator.permissions.query({
            name: "microphone",
          });
          setMicrophonePermission(result.state);
          setMicrophoneSupported(true);
        } else {
          setMicrophoneSupported(false);
        }
      } catch (error) {
        setMicrophoneSupported(false);
      }
      setSupportChecking(false);
    };
    checkSupport();
  }, []);

  const startListening = async () => {
    setAudioUrl(null);
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new window.MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      // mediaRecorder.onstart = () => {
      //     console.log("started")
      //    if(stopVideo){
      //     stopVideo();
      //    }else{
      //     console.log("stopAllStreams not found")
      //    }
      // }
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        setAudioUrl(URL.createObjectURL(audioBlob));
        console.log("audioBlob", URL.createObjectURL(audioBlob));
        stream.getTracks().forEach((track) => track.stop());
        setLoading(true);
        sendChatMessage(audioBlob, false, setLoading);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setListening(true);
    } catch (error) {
      setMicrophoneSupported(false);
      if (error.name === "NotAllowedError") setMicrophonePermission("denied");
      else if (error.name === "NotFoundError")
        setMicrophonePermission("not-found");
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setListening(false);
      // Stop video streams when recording stops
      //   stopAllStreams("stop listening");
    }
  };

  return (
    <AgentContext.Provider
      value={{
        videoRef,
        isPlaying,
        play,
        pause,
        togglePlayback,
        startListening,
        stopListening,
        microphonePermission,
        microphoneSupported,
        supportChecking,
        isRecording,
        audioUrl,
        listening,
        setListening,
        loading,
        setLoading,
      }}
    >
      {children}
    </AgentContext.Provider>
  );
};

export default AgentProvider;

export { AgentContext };
