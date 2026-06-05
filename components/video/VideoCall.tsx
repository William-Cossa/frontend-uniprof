"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import Peer from "simple-peer";
import {
  Mic, MicOff, Video, VideoOff, PhoneOff, Monitor, MonitorOff, Maximize, Minimize
} from "lucide-react";

interface VideoCallProps {
  agendamentoId: string;
  token: string;
  userName: string;
  /** Token de sessão gerado pelo VideoService. Quando presente, é usado
   *  em vez do JWT principal para autenticar no Socket.io (acesso via link). */
  sessionToken?: string;
}

type CallStatus = "connecting" | "waiting" | "connected" | "ended" | "error";

export default function VideoCall({ agendamentoId, token, sessionToken, userName: _userName }: VideoCallProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const peerRef = useRef<Peer.Instance | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  const [status, setStatus] = useState<CallStatus>("connecting");
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [remotePeerName, setRemotePeerName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);

  const cleanup = useCallback(() => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    screenStreamRef.current?.getTracks().forEach((t) => t.stop());
    peerRef.current?.destroy();
    socketRef.current?.disconnect();
    peerRef.current = null;
    socketRef.current = null;
  }, []);

  useEffect(() => {
    let mounted = true;

    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (!mounted) { stream.getTracks().forEach(t => t.stop()); return; }

        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        const wsUrl = process.env.NEXT_PUBLIC_API_WS_URL || "http://localhost:4400";

        // Modo autenticação:
        // - sessionToken → acesso via link de mentor (sem cookie)
        // - token → utilizador autenticado normalmente
        const socketAuth = sessionToken
          ? { sessionToken }
          : { token };

        const socket = io(wsUrl, {
          path: "/ws",
          auth: socketAuth,
        });

        socketRef.current = socket;

        socket.on("connect", () => {
          if (!mounted) return;
          socket.emit("join-room", agendamentoId);
          setStatus("waiting");
        });

        socket.on("connect_error", (err) => {
          if (!mounted) return;
          setErrorMsg(err.message || "Erro de conexão");
          setStatus("error");
        });

        socket.on("error-msg", (msg: string) => {
          if (!mounted) return;
          setErrorMsg(msg);
          setStatus("error");
        });

        socket.on("room-joined", ({ peers }: { peers: Array<{ peerId: string; userName: string }> }) => {
          if (!mounted || peers.length === 0) return;
          const remotePeer = peers[0];
          setRemotePeerName(remotePeer.userName);
          createPeer(socket, stream, remotePeer.peerId, true);
        });

        socket.on("peer-joined", ({ peerId, userName: peerName }: { peerId: string; userName: string }) => {
          if (!mounted) return;
          setRemotePeerName(peerName);
          createPeer(socket, stream, peerId, false);
        });

        socket.on("signal", ({ from, signal }: { from: string; signal: any }) => {
          if (!mounted) return;
          if (peerRef.current) {
            peerRef.current.signal(signal);
          }
        });

        socket.on("peer-left", () => {
          if (!mounted) return;
          peerRef.current?.destroy();
          peerRef.current = null;
          if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
          setStatus("waiting");
          setRemotePeerName("");
        });

      } catch (err: any) {
        if (!mounted) return;
        setErrorMsg(err.message || "Erro ao acessar câmera/microfone");
        setStatus("error");
      }
    }

    function createPeer(socket: Socket, stream: MediaStream, remotePeerId: string, initiator: boolean) {
      if (peerRef.current) {
        peerRef.current.destroy();
      }

      const peer = new Peer({
        initiator,
        trickle: true,
        stream,
        config: {
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" },
          ],
        },
      });

      peer.on("signal", (signal) => {
        socket.emit("signal", { to: remotePeerId, signal });
      });

      peer.on("stream", (remoteStream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
        setStatus("connected");
      });

      peer.on("close", () => {
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
        setStatus("waiting");
      });

      peer.on("error", (err) => {
        console.error("Peer error:", err);
      });

      peerRef.current = peer;
    }

    start();

    return () => {
      mounted = false;
      cleanup();
    };
  }, [agendamentoId, token, cleanup]);

  // Controles
  const toggleMute = () => {
    const audioTrack = localStreamRef.current?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
    }
  };

  const toggleCamera = () => {
    const videoTrack = localStreamRef.current?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsCameraOff(!videoTrack.enabled);
    }
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      const camTrack = localStreamRef.current?.getVideoTracks()[0];
      if (camTrack && peerRef.current) {
        const sender = (peerRef.current as any)._pc
          ?.getSenders()
          ?.find((s: RTCRtpSender) => s.track?.kind === "video");
        if (sender) sender.replaceTrack(camTrack);
      }
      screenStreamRef.current?.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
      setIsScreenSharing(false);
    } else {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenStreamRef.current = screenStream;
        const screenTrack = screenStream.getVideoTracks()[0];

        if (peerRef.current) {
          const sender = (peerRef.current as any)._pc
            ?.getSenders()
            ?.find((s: RTCRtpSender) => s.track?.kind === "video");
          if (sender) sender.replaceTrack(screenTrack);
        }

        screenTrack.onended = () => {
          toggleScreenShare();
        };

        setIsScreenSharing(true);
      } catch {
        // Utilizador cancelou
      }
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const endCall = () => {
    cleanup();
    setStatus("ended");
    window.location.href = "/perfil";
  };

  const statusMessages: Record<CallStatus, string> = {
    connecting: "Conectando...",
    waiting: "Aguardando o outro participante...",
    connected: `Em chamada com ${remotePeerName}`,
    ended: "Chamada encerrada",
    error: errorMsg || "Erro na conexão",
  };

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "calc(100vh - 100px)",
        minHeight: "500px",
        backgroundColor: "#0a0a0f",
        borderRadius: "16px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* ═══ Área de vídeo principal ═══ */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {/* Vídeo remoto */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            backgroundColor: "#0a0a0f",
          }}
        />

        {/* Overlay de status quando não conectado */}
        {status !== "connected" && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(10, 10, 15, 0.95)",
              zIndex: 10,
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                border: `3px solid ${status === "error" ? "#ef4444" : "#10b981"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
                animation: status !== "error" ? "pulse 2s infinite" : "none",
              }}
            >
              {status === "error" ? (
                <PhoneOff style={{ width: 36, height: 36, color: "#ef4444" }} />
              ) : (
                <Video style={{ width: 36, height: 36, color: "#10b981" }} />
              )}
            </div>
            <p style={{ color: "#fff", fontSize: "18px", fontWeight: 500, marginBottom: "4px" }}>
              {statusMessages[status]}
            </p>
            {status === "waiting" && (
              <p style={{ color: "#9ca3af", fontSize: "14px" }}>
                Partilhe o link desta sessão com o outro participante
              </p>
            )}
            {status === "error" && (
              <button
                onClick={() => window.location.reload()}
                style={{
                  marginTop: "16px",
                  padding: "10px 24px",
                  backgroundColor: "#10b981",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                Tentar Novamente
              </button>
            )}
          </div>
        )}

        {/* Preview vídeo local (canto inferior direito) */}
        <div
          style={{
            position: "absolute",
            bottom: "16px",
            right: "16px",
            width: "200px",
            height: "150px",
            borderRadius: "12px",
            overflow: "hidden",
            backgroundColor: "#1e1e2e",
            boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
            border: "2px solid rgba(255,255,255,0.1)",
            zIndex: 20,
          }}
        >
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: "scaleX(-1)",
            }}
          />
          {isCameraOff && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "#1e1e2e",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <VideoOff style={{ width: 32, height: 32, color: "#6b7280" }} />
            </div>
          )}
          <div
            style={{
              position: "absolute",
              bottom: "6px",
              left: "8px",
              fontSize: "11px",
              color: "rgba(255,255,255,0.7)",
              backgroundColor: "rgba(0,0,0,0.5)",
              padding: "2px 6px",
              borderRadius: "4px",
            }}
          >
            Você
          </div>
        </div>

        {/* Nome do participante remoto */}
        {status === "connected" && remotePeerName && (
          <div
            style={{
              position: "absolute",
              top: "16px",
              left: "16px",
              fontSize: "14px",
              color: "#fff",
              backgroundColor: "rgba(0,0,0,0.5)",
              padding: "6px 12px",
              borderRadius: "8px",
              backdropFilter: "blur(8px)",
              zIndex: 20,
            }}
          >
            {remotePeerName}
          </div>
        )}
      </div>

      {/* ═══ Barra de controles (sempre visível, fixa no fundo) ═══ */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          padding: "16px 24px",
          backgroundColor: "#111118",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          flexShrink: 0,
        }}
      >
        <ControlButton
          onClick={toggleMute}
          active={isMuted}
          activeColor="#ef4444"
          title={isMuted ? "Ativar microfone" : "Silenciar"}
          icon={isMuted ? <MicOff size={20} /> : <Mic size={20} />}
        />

        <ControlButton
          onClick={toggleCamera}
          active={isCameraOff}
          activeColor="#ef4444"
          title={isCameraOff ? "Ligar câmera" : "Desligar câmera"}
          icon={isCameraOff ? <VideoOff size={20} /> : <Video size={20} />}
        />

        <ControlButton
          onClick={toggleScreenShare}
          active={isScreenSharing}
          activeColor="#10b981"
          title={isScreenSharing ? "Parar partilha" : "Partilhar ecrã"}
          icon={isScreenSharing ? <MonitorOff size={20} /> : <Monitor size={20} />}
        />

        <ControlButton
          onClick={toggleFullscreen}
          active={false}
          activeColor=""
          title={isFullscreen ? "Sair de ecrã inteiro" : "Ecrã inteiro"}
          icon={isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
        />

        {/* Botão vermelho de encerrar */}
        <button
          onClick={endCall}
          title="Encerrar chamada"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "56px",
            height: "44px",
            borderRadius: "24px",
            backgroundColor: "#dc2626",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            marginLeft: "8px",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#b91c1c")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#dc2626")}
        >
          <PhoneOff size={20} />
        </button>
      </div>

      {/* Pulse animation */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

/* ─── Componente reutilizável de botão de controle ─── */
function ControlButton({
  onClick,
  active,
  activeColor,
  title,
  icon,
}: {
  onClick: () => void;
  active: boolean;
  activeColor: string;
  title: string;
  icon: React.ReactNode;
}) {
  const bgDefault = "#2a2a3a";
  const bgHover = "#3a3a4a";
  const bgActive = active ? `${activeColor}22` : bgDefault;
  const textColor = active ? activeColor : "#ffffff";

  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "44px",
        height: "44px",
        borderRadius: "12px",
        backgroundColor: bgActive,
        color: textColor,
        border: active ? `1px solid ${activeColor}44` : "1px solid transparent",
        cursor: "pointer",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.backgroundColor = bgHover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = bgActive;
      }}
    >
      {icon}
    </button>
  );
}
