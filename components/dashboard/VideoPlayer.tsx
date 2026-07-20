"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Loader2, Settings, RotateCw, Check } from "lucide-react";
import { cn } from "@/lib/utils";

function fmt(t: number) {
    if (!isFinite(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
}

const RATES = [0.5, 0.75, 1, 1.25, 1.5, 2];

export type VideoQuality = { label: string; src: string };

/**
 * Custom HTML5 video player for self-hosted lesson videos (Supabase Storage now, S3 later).
 * Supports playback-speed control, a quality menu (pass multiple `sources` for real
 * quality switching; a single MP4 shows "Auto"), and a mobile rotate-to-fullscreen button.
 */
export function VideoPlayer({
    src,
    poster,
    sources,
}: {
    src: string;
    poster?: string | null;
    sources?: VideoQuality[];
}) {
    const qualities: VideoQuality[] = sources && sources.length ? sources : [{ label: "Auto", src }];

    const videoRef = useRef<HTMLVideoElement>(null);
    const wrapRef = useRef<HTMLDivElement>(null);
    const resumeRef = useRef<{ time: number; playing: boolean } | null>(null);

    const [playing, setPlaying] = useState(false);
    const [current, setCurrent] = useState(0);
    const [duration, setDuration] = useState(0);
    const [muted, setMuted] = useState(false);
    const [volume, setVolume] = useState(1);
    const [rate, setRate] = useState(1);
    const [qualityIdx, setQualityIdx] = useState(0);
    const [loading, setLoading] = useState(true);
    const [settingsOpen, setSettingsOpen] = useState(false);

    const toggle = useCallback(() => {
        const v = videoRef.current;
        if (!v) return;
        if (v.paused) v.play();
        else v.pause();
    }, []);

    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;
        const onPlay = () => setPlaying(true);
        const onPause = () => setPlaying(false);
        const onTime = () => setCurrent(v.currentTime);
        const onMeta = () => {
            setDuration(v.duration);
            setLoading(false);
            v.playbackRate = rate;
            // restore position after a quality switch
            if (resumeRef.current) {
                v.currentTime = resumeRef.current.time;
                if (resumeRef.current.playing) v.play().catch(() => {});
                resumeRef.current = null;
            }
        };
        const onWaiting = () => setLoading(true);
        const onPlaying = () => setLoading(false);
        v.addEventListener("play", onPlay);
        v.addEventListener("pause", onPause);
        v.addEventListener("timeupdate", onTime);
        v.addEventListener("loadedmetadata", onMeta);
        v.addEventListener("waiting", onWaiting);
        v.addEventListener("playing", onPlaying);
        return () => {
            v.removeEventListener("play", onPlay);
            v.removeEventListener("pause", onPause);
            v.removeEventListener("timeupdate", onTime);
            v.removeEventListener("loadedmetadata", onMeta);
            v.removeEventListener("waiting", onWaiting);
            v.removeEventListener("playing", onPlaying);
        };
    }, [rate, qualityIdx]);

    function seek(e: React.ChangeEvent<HTMLInputElement>) {
        const v = videoRef.current;
        if (!v) return;
        const t = (Number(e.target.value) / 100) * duration;
        v.currentTime = t;
        setCurrent(t);
    }

    function changeVolume(e: React.ChangeEvent<HTMLInputElement>) {
        const v = videoRef.current;
        if (!v) return;
        const vol = Number(e.target.value);
        v.volume = vol;
        v.muted = vol === 0;
        setVolume(vol);
        setMuted(vol === 0);
    }

    function toggleMute() {
        const v = videoRef.current;
        if (!v) return;
        v.muted = !v.muted;
        setMuted(v.muted);
    }

    function applyRate(r: number) {
        const v = videoRef.current;
        if (v) v.playbackRate = r;
        setRate(r);
    }

    function changeQuality(i: number) {
        if (i === qualityIdx) return;
        const v = videoRef.current;
        resumeRef.current = { time: v?.currentTime ?? 0, playing: !!v && !v.paused };
        setLoading(true);
        setQualityIdx(i);
    }

    function fullscreen() {
        wrapRef.current?.requestFullscreen?.();
    }

    async function rotate() {
        try {
            if (!document.fullscreenElement) await wrapRef.current?.requestFullscreen?.();
            const orient = (screen as unknown as { orientation?: { lock?: (o: string) => Promise<void> } }).orientation;
            await orient?.lock?.("landscape");
        } catch {
            /* orientation lock unsupported (e.g. desktop) — fullscreen still applied */
        }
    }

    const pct = duration ? (current / duration) * 100 : 0;

    return (
        <div
            ref={wrapRef}
            className="group relative aspect-video w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-black"
        >
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
                ref={videoRef}
                src={qualities[qualityIdx].src}
                poster={poster ?? undefined}
                onClick={toggle}
                className="h-full w-full"
                playsInline
                preload="metadata"
            />

            {loading && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <Loader2 className="size-8 animate-spin text-white/60" />
                </div>
            )}

            {!playing && !loading && (
                <button
                    onClick={toggle}
                    aria-label="Play"
                    className="absolute inset-0 flex items-center justify-center bg-black/20 transition"
                >
                    <span className="flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-600 to-red-600 text-white shadow-lg shadow-orange-900/40">
                        <Play className="size-7 fill-current" />
                    </span>
                </button>
            )}

            {/* Settings popover */}
            {settingsOpen && (
                <div className="absolute bottom-16 right-3 z-10 w-44 rounded-2xl border border-white/10 bg-black/85 p-2 text-sm text-white backdrop-blur-xl">
                    <p className="px-2 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40">Speed</p>
                    <div className="grid grid-cols-3 gap-1">
                        {RATES.map((r) => (
                            <button
                                key={r}
                                onClick={() => applyRate(r)}
                                className={cn("rounded-lg px-1.5 py-1 text-xs transition", r === rate ? "bg-[#f15906] text-white" : "hover:bg-white/10")}
                            >
                                {r}×
                            </button>
                        ))}
                    </div>
                    <p className="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40">Quality</p>
                    <div className="flex flex-col">
                        {qualities.map((q, i) => (
                            <button
                                key={q.label}
                                onClick={() => changeQuality(i)}
                                className="flex items-center justify-between rounded-lg px-2 py-1.5 text-xs transition hover:bg-white/10"
                            >
                                {q.label}
                                {i === qualityIdx && <Check className="size-3.5 text-[#f15906]" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Controls */}
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 bg-gradient-to-t from-black/80 to-transparent px-4 pb-3 pt-8 opacity-0 transition group-hover:opacity-100 data-[show=true]:opacity-100" data-show={!playing}>
                <input
                    type="range"
                    min={0}
                    max={100}
                    value={pct}
                    onChange={seek}
                    aria-label="Seek"
                    className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/20 accent-[#f15906]"
                    style={{ background: `linear-gradient(to right, #f15906 ${pct}%, rgba(255,255,255,0.2) ${pct}%)` }}
                />
                <div className="flex items-center gap-3 text-white">
                    <button onClick={toggle} aria-label={playing ? "Pause" : "Play"}>
                        {playing ? <Pause className="size-5" /> : <Play className="size-5 fill-current" />}
                    </button>
                    <div className="flex items-center gap-1.5">
                        <button onClick={toggleMute} aria-label="Mute">
                            {muted || volume === 0 ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
                        </button>
                        <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.05}
                            value={muted ? 0 : volume}
                            onChange={changeVolume}
                            aria-label="Volume"
                            className="hidden h-1 w-20 cursor-pointer appearance-none rounded-full bg-white/20 accent-[#f15906] sm:block"
                        />
                    </div>
                    <span className="text-xs tabular-nums text-white/80">
                        {fmt(current)} / {fmt(duration)}
                    </span>
                    <div className="ml-auto flex items-center gap-3">
                        <button
                            onClick={() => setSettingsOpen((o) => !o)}
                            aria-label="Settings"
                            className={cn("transition", settingsOpen ? "text-[#f15906]" : "hover:text-white")}
                        >
                            <Settings className="size-5" />
                        </button>
                        {/* Rotate to landscape — most useful on mobile */}
                        <button onClick={rotate} aria-label="Rotate to fullscreen" className="sm:hidden">
                            <RotateCw className="size-5" />
                        </button>
                        <button onClick={fullscreen} aria-label="Fullscreen">
                            <Maximize className="size-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/** True when a URL is a YouTube/Vimeo embed rather than a direct video file. */
export function isEmbedUrl(url: string) {
    return /youtube\.com|youtu\.be|vimeo\.com|player\./i.test(url);
}
