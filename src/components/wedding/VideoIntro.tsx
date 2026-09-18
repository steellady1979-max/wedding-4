import { useEffect, useRef, useState } from "react";
import videoAsset from "@/assets/wedding-intro.mp4.asset.json";

export function VideoIntro({ onFinish }: { onFinish: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [leaving, setLeaving] = useState(false);

  const finishRef = useRef(false);
  const finish = () => {
    if (finishRef.current) return;
    finishRef.current = true;
    setLeaving(true);
    window.setTimeout(onFinish, 900);
  };

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
    // Safety net: never trap the guest on the intro if the video stalls.
    const id = window.setTimeout(finish, 12000);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      onClick={finish}
      className={`fixed inset-0 z-50 cursor-pointer bg-foreground transition-opacity duration-[900ms] ${
        leaving ? "opacity-0" : "opacity-100"
      }`}
    >
      <video
        ref={videoRef}
        src={videoAsset.url}
        autoPlay
        muted
        playsInline
        onEnded={finish}
        onError={finish}
        className="h-full w-full object-cover opacity-90"
      />

      <div className="starfield" aria-hidden />

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-6 bg-black/25 px-6 text-center">
        <p className="animate-fade-in text-[0.7rem] uppercase tracking-[0.55em] text-white/80">
          17 სექტემბერი
        </p>
        <h1 className="animate-fade-in font-display text-5xl leading-tight text-white sm:text-7xl md:text-8xl">
          ლევანი &amp; თამთა
        </h1>
        <div className="hairline w-28 opacity-80" />
      </div>
    </div>
  );
}
