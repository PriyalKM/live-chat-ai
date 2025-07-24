import { WS_URL } from "@/lib/config";
import React, { createContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { BLANK_VIDEO } from "@/lib/images";
import { API } from "@/lib/endpoints";

const WebSocketContext = createContext(null);

const CONFIG_API_URL = `${WS_URL}${API.CONFIG_API_URL}`;

const WebSocketProvider = ({ children }) => {
  const [ws, setWs] = useState(null);
  const [currentStreamId, setCurrentStreamId] = useState(null);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [wsConfig, setWsConfig] = useState(null);
  const [backendAvailable, setBackendAvailable] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [backendStatus, setBackendStatus] = useState(null);

  const peerConnectionRef = useRef(null);
  const pcDataChannelRef = useRef(null);
  const streamVideoOpacityRef = useRef(0);
  const sessionIdRef = useRef(null);
  const statsIntervalIdRef = useRef(null);
  const videoIsPlayingRef = useRef(false);
  const lastBytesReceivedRef = useRef(0);
  const streamIdRef = useRef(null);
  const isStreamReadyRef = useRef(false);
  // Ref

  // Video Ref
  const streamVideoRef = useRef(null);
  const idleImageRef = useRef(null);
  const idleVideoRef = useRef(null);
  //

  const RTCPeerConnection = (
    window.RTCPeerConnection ||
    window.webkitRTCPeerConnection ||
    window.mozRTCPeerConnection
  ).bind(window);

  const checkBackend = async () => {
    try {
      const response = await fetch(CONFIG_API_URL);
      if (response.ok) {
        const config = await response.json();
        setWsConfig(config.data);
        setBackendAvailable(true);
        setBackendStatus("connected");
      } else {
        setBackendAvailable(false);
        setBackendStatus("disconnected");
      }
    } catch (error) {
      setBackendAvailable(false);
      setBackendStatus("error");
    }
  };

  useEffect(() => {
    checkBackend();
  }, []);

  const showIdleState = () => {
    //const isConnected = peerConnectionRef.current && peerConnectionRef?.current?.connectionState === 'connected';
    const isConnected = true;
    if (isConnected) {
      //if (idleImageRef.current) idleImageRef.current.style.opacity = 0;
      if (idleVideoRef.current) {
        idleVideoRef.current.style.opacity = 1;
        if (wsConfig) {
          idleVideoRef.current.src = BLANK_VIDEO;
        } else {
          idleVideoRef.current.src = BLANK_VIDEO;
        }
        // Explicitly play the video after setting src
        if (idleVideoRef.current.paused) {
          idleVideoRef.current
            .play()
            .catch((e) => console.warn("Idle video play error:", e));
        }
      }
    } else {
      if (idleImageRef.current) idleImageRef.current.style.opacity = 1;
      if (idleVideoRef.current) idleVideoRef.current.style.opacity = 0;
    }
  };

  const stopVideo = () => {
    if (idleImageRef.current) idleImageRef.current.style.opacity = 1;
    if (idleVideoRef.current) idleVideoRef.current.style.opacity = 0;
  };

  const stopAllStreams = () => {
    if (streamVideoRef.current && streamVideoRef.current.srcObject) {
      streamVideoRef.current.srcObject
        .getTracks()
        .forEach((track) => track.stop());
      streamVideoRef.current.srcObject = null;
      streamVideoOpacityRef.current = 0;
      streamVideoRef.current.style.opacity = 0;
    }

    showIdleState();
  };

  const sendMessage = (websocket, message) => {
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      websocket.send(JSON.stringify(message));
    } else {
      // Queue ICE candidates for later if WebSocket not ready
      if (message.type === "ice") {
        if (!window.iceCandidateQueue) {
          window.iceCandidateQueue = [];
        }
        window.iceCandidateQueue.push(message);
      }
      //console.log(message, "message")
      // console.log('WebSocket is not open. Cannot send message.');
    }
  };

  const onIceCandidate = (event) => {
    //console.log(event, "event")
    if (event.candidate) {
      const { candidate, sdpMid, sdpMLineIndex } = event.candidate;
      sendMessage(ws, {
        type: "ice",
        payload: {
          session_id: sessionIdRef.current,
          candidate,
          sdpMid,
          sdpMLineIndex,
        },
      });
    } else {
      sendMessage(ws, {
        type: "ice",
        payload: {
          stream_id: streamIdRef.current,
          session_id: sessionIdRef.current,
          presenter_type: "clip",
        },
      });
    }
  };

  const onConnectionStateChange = () => {
    const status = peerConnectionRef.current?.connectionState;
    if (status === "connected") {
      showIdleState();
      setTimeout(() => {
        if (!isStreamReadyRef.current) {
          isStreamReadyRef.current = true;
        }
      }, 3000);
    }
  };

  const onTrack = (event) => {
    if (!event.track) return;
    statsIntervalIdRef.current = setInterval(async () => {
      try {
        const stats = await peerConnectionRef.current.getStats(event.track);
        stats.forEach((report) => {
          if (report.type === "inbound-rtp" && report.kind === "video") {
            const videoStatusChanged =
              videoIsPlayingRef.current !==
              report.bytesReceived > lastBytesReceivedRef.current;

            if (videoStatusChanged) {
              videoIsPlayingRef.current =
                report.bytesReceived > lastBytesReceivedRef.current;
              onVideoStatusChange(videoIsPlayingRef.current, event.streams[0]);
            }
            lastBytesReceivedRef.current = report.bytesReceived;
          }
        });
      } catch (error) {
        console.warn("Stats error (can be ignored):", error.message);
      }
    }, 500);
  };

  const setStreamVideoElement = (stream) => {
    if (!stream || !streamVideoRef.current) return;

    streamVideoRef.current.srcObject = stream;
    streamVideoRef.current.loop = false;
    streamVideoRef.current.muted = !isStreamReadyRef.current;

    if (streamVideoRef.current.paused) {
      streamVideoRef.current
        .play()
        .then((_) => {})
        .catch((e) => console.warn("Video play error:", e));
    }
  };

  function onVideoStatusChange(videoIsPlaying, stream) {
    console.log(videoIsPlaying, "videoIsPlaying");
    if (videoIsPlaying) {
      streamVideoOpacityRef.current = isStreamReadyRef.current ? 1 : 0;
      setStreamVideoElement(stream);
    } else {
      streamVideoOpacityRef.current = 0;
    }

    if (streamVideoRef.current) {
      streamVideoRef.current.style.opacity = streamVideoOpacityRef.current;
    }

    if (streamVideoOpacityRef.current > 0) {
      if (idleImageRef.current) idleImageRef.current.style.opacity = 0;
      if (idleVideoRef.current) idleVideoRef.current.style.opacity = 0;
    } else {
      const isConnected =
        peerConnectionRef.current &&
        peerConnectionRef.current.connectionState === "connected";
      // if (idleImageRef.current) idleImageRef.current.style.opacity = isConnected ? 0 : 1;
      if (idleVideoRef.current)
        idleVideoRef.current.style.opacity = isConnected ? 1 : 0;
    }
  }

  const onStreamEvent = (message) => {
    if (
      pcDataChannelRef.current &&
      pcDataChannelRef.current.readyState === "open"
    ) {
      const [event, _] = message.data.split(":");

      if (event === "stream/ready") {
        setTimeout(() => {
          isStreamReadyRef.current = true;
        }, 1000);
      } else {
      }
    }
  };

  const createPeerConnection = async (offer, iceServers) => {
    if (!peerConnectionRef.current) {
      peerConnectionRef.current = new RTCPeerConnection({ iceServers });
      pcDataChannelRef.current =
        peerConnectionRef.current.createDataChannel("JanusDataChannel");

      peerConnectionRef.current.addEventListener(
        "icecandidate",
        onIceCandidate,
        true
      );
      peerConnectionRef.current.addEventListener(
        "iceconnectionstatechange",
        onIceConnectionStateChange,
        true
      );
      peerConnectionRef.current.addEventListener(
        "connectionstatechange",
        onConnectionStateChange,
        true
      );
      peerConnectionRef.current.addEventListener("track", onTrack, true);
      pcDataChannelRef.current.addEventListener("message", onStreamEvent, true);
    }

    await peerConnectionRef.current.setRemoteDescription(offer);

    const answer = await peerConnectionRef.current.createAnswer();

    await peerConnectionRef.current.setLocalDescription(answer);

    return answer;
  };

  const closePC = () => {
    if (!peerConnectionRef.current) return;
    peerConnectionRef.current.close();
    peerConnectionRef.current.removeEventListener(
      "icecandidate",
      onIceCandidate,
      true
    );
    peerConnectionRef.current.removeEventListener(
      "iceconnectionstatechange",
      onIceConnectionStateChange,
      true
    );
    peerConnectionRef.current.removeEventListener(
      "connectionstatechange",
      onConnectionStateChange,
      true
    );
    peerConnectionRef.current.removeEventListener("track", onTrack, true);
    if (pcDataChannelRef.current) {
      pcDataChannelRef.current.removeEventListener(
        "message",
        onStreamEvent,
        true
      );
    }
    clearInterval(statsIntervalIdRef.current);
    isStreamReadyRef.current = false;

    peerConnectionRef.current = null;
    pcDataChannelRef.current = null;

    // Clear ICE candidate queue
    if (window.iceCandidateQueue) {
      window.iceCandidateQueue = [];
    }
  };

  function onIceConnectionStateChange() {
    const status = peerConnectionRef.current?.iceConnectionState;
    if (status === "failed" || status === "closed") {
      stopAllStreams();
      closePC();
    }
  }

  const connectToWebSocket = async (url) => {
    return new Promise((resolve, reject) => {
      const websocket = new WebSocket(url);
      websocket.onopen = () => {
        resolve(websocket);
      };
      websocket.onerror = (err) => {
        console.error("WebSocket error:", err);
        reject(err);
      };
      websocket.onclose = () => {
        setConnectionStatus("disconnected");
      };
    });
  };

  const connectWebSocket = async (url) => {
    if (!wsConfig) {
      console.error("Backend configuration not available");
      return { success: false, message: "Backend configuration not available" };
    }

    if (
      peerConnectionRef.current &&
      peerConnectionRef.current.connectionState === "connected"
    ) {
      return { success: false, message: "Avatar already connected" };
    }
    stopAllStreams();
    closePC();
    try {
      setConnectionStatus("connecting");
      const websocket = await connectToWebSocket(wsConfig.websocket_url);
      setWs(websocket);

      // Flush any queued ICE candidates
      if (window.iceCandidateQueue && window.iceCandidateQueue.length > 0) {
        window.iceCandidateQueue.forEach((msg) => {
          websocket.send(JSON.stringify(msg));
        });
        window.iceCandidateQueue = [];
      }

      setConnectionStatus("connected");
      const initMessage = {
        type: "init-stream",
        payload: {
          presenter_id: wsConfig.presenter_id,
          driver_id: wsConfig.driver_id,
          presenter_type: "clip",
        },
      };
      sendMessage(websocket, initMessage);

      websocket.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        //console.log('WebSocket message received:', data);

        switch (data.messageType) {
          case "init-stream":
            const {
              id: newStreamId,
              offer,
              ice_servers: iceServers,
              session_id: newSessionId,
            } = data;
            streamIdRef.current = newStreamId;
            sessionIdRef.current = newSessionId;
            setCurrentStreamId(newStreamId);
            setCurrentSessionId(newSessionId);

            try {
              const sessionClientAnswer = await createPeerConnection(
                offer,
                iceServers
              );

              // Send SDP answer
              const sdpMessage = {
                type: "sdp",
                payload: {
                  answer: sessionClientAnswer,
                  session_id: sessionIdRef.current,
                  presenter_type: "clip",
                },
              };
              sendMessage(websocket, sdpMessage);
            } catch (e) {
              console.error("Error during streaming setup", e);
              stopAllStreams();
              closePC();
            }
            break;

          case "sdp":
            // console.log('SDP message received');
            break;

          case "delete-stream":
            // console.log('Stream deleted');
            break;

          case "stream-ready":
            // console.log('Stream ready, video should start playing');
            // The video stream should now be available through the peer connection
            break;

          case "stream-error":
            //console.error('Stream error:', data.error);
            break;

          default:
            //console.log('Unknown message type:', data.messageType);
            break;
        }
      };
    } catch (error) {
      console.error("WebSocket connection error:", error);
      setConnectionStatus("disconnected");
      return {
        success: false,
        message: "WebSocket connection failed: " + error.message,
      };
    }
  };

  const sendChatMessage = async (
    audioFile,
    showRawData = false,
    setLoading
  ) => {
    try {
      const formData = new FormData();
      formData.append("audio_file", audioFile);
      formData.append("stream_id", currentStreamId);
      formData.append("session_id", currentSessionId);
      formData.append("show_raw_data", showRawData);

      const response = await axios.post(`${WS_URL}${API.ASK}`, formData);
      // Validate response
      if (!response || !response.data.data) {
        console.error("Invalid response from server");
        setLoading(false);
        return { success: false, error: "Invalid response from server" };
      }

      const data = response.data.data;
      // console.log("Server response:", data);

      // Send messages if WebSocket is open and we have messages to send
      if (
        ws &&
        ws.readyState === WebSocket.OPEN &&
        currentStreamId &&
        data.did_response
      ) {
        const messages = data.did_response.messages || [];
        //console.log('Sending messages to WebSocket:', messages);

        for (const msg of messages) {
          try {
            //console.log('Sending message:', msg.type, msg.payload?.script?.input || 'no input');
            ws.send(JSON.stringify(msg));
            await new Promise((resolve) => setTimeout(resolve, 100));
          } catch (sendError) {
            console.error("Error sending message:", sendError);
          }
        }

        //console.log('All messages sent successfully. Video should start generating...');
      } else if (ws && ws.readyState !== WebSocket.OPEN) {
        console.error("WebSocket is not open. Cannot send message.");
      } else if (!data.did_response) {
        console.warn("No did_response in server response");
      }

      setLoading(false);
      return { success: true, data };
    } catch (error) {
      console.error("Error in sendChatMessage:", error);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  const disconnectAvatar = () => {
    if (ws && streamIdRef.current) {
      const streamMessage = {
        type: "delete-stream",
        payload: {
          session_id: sessionIdRef.current,
          stream_id: streamIdRef.current,
        },
      };
      sendMessage(ws, streamMessage);
    }

    if (ws) {
      ws.close();
      setWs(null);
    }

    stopAllStreams();
    closePC();
    setCurrentStreamId(null);
    setCurrentSessionId(null);
    setConnectionStatus("disconnected");
    showIdleState();
  };

  return (
    <WebSocketContext.Provider
      value={{
        ws,
        currentSessionId,
        currentStreamId,
        backendAvailable,
        wsConfig,
        connectionStatus,
        backendStatus,

        idleImageRef,
        idleVideoRef,
        streamVideoRef,

        connectWebSocket,
        checkBackend,
        showIdleState,
        sendChatMessage,
        stopAllStreams,
        closePC,
        stopVideo,
        disconnectAvatar,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;
export { WebSocketContext };
