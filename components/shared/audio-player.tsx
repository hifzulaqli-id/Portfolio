"use client";

import * as React from "react";
import { Play, Pause, Volume2, VolumeX, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

interface AudioPlayerProps {
  url: string;
  className?: string;
  title?: string;
}

export function AudioPlayer({ url, className, title }: AudioPlayerProps) {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [volume, setVolume] = React.useState(1);
  const [isMuted, setIsMuted] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => {
      setDuration(audio.duration);
      setLoading(false);
    };
    const handleEnded = () => setIsPlaying(false);
    const handleError = () => {
      setError(true);
      setLoading(false);
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("canplay", () => setLoading(false));

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, []);

  React.useEffect(() => {
    setError(false);
    setLoading(true);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
  }, [url]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      if (isPlaying) {
        audio.pause();
      } else {
        await audio.play();
      }
    } catch {
      setError(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = Number(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newVolume = Number(e.target.value);
    audio.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isMuted) {
      audio.volume = volume || 1;
      audio.muted = false;
      setIsMuted(false);
    } else {
      audio.muted = true;
      setIsMuted(true);
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (error) {
    return (
      <div className={cn("flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-8 text-center", className)}>
        <AlertCircle className="mx-auto h-12 w-12 mb-3 text-amber-500/70" />
        <p className="text-sm font-medium text-muted-foreground">
          Gagal memuat audio
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Buka audio di tab baru ↗
        </a>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-emerald-500/10 via-card to-card p-6 sm:p-8", className)}>
      <audio ref={audioRef} src={url} preload="metadata" />

      {/* Waveform-like decoration */}
      <div className="pointer-events-none absolute inset-0 flex items-end justify-center gap-[3px] opacity-[0.07]">
        {Array.from({ length: 48 }).map((_, i) => (
          <div
            key={i}
            className="w-1 rounded-full bg-emerald-500"
            style={{
              height: `${20 + Math.abs(Math.sin(i * 0.7)) * 60}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col gap-5">
        {/* Title + Play button row */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={togglePlay}
            disabled={loading}
            aria-label={isPlaying ? "Pause" : "Play"}
            className={cn(
              "flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 hover:shadow-emerald-500/40 active:scale-95",
              loading && "opacity-60"
            )}
          >
            {loading ? (
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : isPlaying ? (
              <Pause className="h-6 w-6" fill="currentColor" />
            ) : (
              <Play className="h-6 w-6 translate-x-0.5" fill="currentColor" />
            )}
          </button>
          <div className="min-w-0 flex-1">
            {title && (
              <h3 className="font-display text-base font-bold leading-snug text-foreground line-clamp-1">
                {title}
              </h3>
            )}
            <p className="mt-0.5 font-mono text-xs text-muted-foreground">
              {isPlaying ? "Sedang diputar" : loading ? "Memuat..." : "Voice Over Sample"}
            </p>
          </div>
        </div>

        {/* Seek bar */}
        <div className="flex items-center gap-3">
          <span className="w-10 shrink-0 text-right font-mono text-xs text-muted-foreground">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            aria-label="Seek"
            className="audio-seek-range flex-1"
            style={{
              background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${progress}%, hsl(var(--muted)) ${progress}%, hsl(var(--muted)) 100%)`,
            }}
          />
          <span className="w-10 shrink-0 font-mono text-xs text-muted-foreground">
            {formatTime(duration)}
          </span>
        </div>

        {/* Volume control */}
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute" : "Mute"}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={isMuted ? 0 : volume}
            onChange={handleVolume}
            aria-label="Volume"
            className="audio-volume-range w-24"
            style={{
              background: `linear-gradient(to right, hsl(var(--foreground)) 0%, hsl(var(--foreground)) ${(isMuted ? 0 : volume) * 100}%, hsl(var(--muted)) ${(isMuted ? 0 : volume) * 100}%, hsl(var(--muted)) 100%)`,
            }}
          />
        </div>
      </div>

      <style jsx>{`
        .audio-seek-range,
        .audio-volume-range {
          -webkit-appearance: none;
          appearance: none;
          height: 6px;
          border-radius: 9999px;
          cursor: pointer;
          outline: none;
        }
        .audio-seek-range::-webkit-slider-thumb,
        .audio-volume-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 9999px;
          background: hsl(var(--primary));
          border: 2px solid hsl(var(--background));
          box-shadow: 0 0 0 1px hsl(var(--primary) / 0.3);
          transition: transform 0.15s;
        }
        .audio-seek-range::-webkit-slider-thumb:hover,
        .audio-volume-range::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
        .audio-seek-range::-moz-range-thumb,
        .audio-volume-range::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 9999px;
          background: hsl(var(--primary));
          border: 2px solid hsl(var(--background));
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
