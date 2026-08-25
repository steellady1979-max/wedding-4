import { useEffect, useRef, useState } from "react";
import videoAsset from "@/assets/wedding-intro.mp4.asset.json";

export function VideoIntro({ onFinish }: { onFinish: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [leaving, setLeaving] = useState(false);

  const finish = () => {
    if (leaving) return;
    setLeaving(true);
    window.setTimeout(onFinish, 900);
  };

  useEffect(() => {
    const v = videoRef.current;
    v?.play().catch(() => {});
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 bg-foreground transition-opacity duration-[900ms] ${
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
        className="h-full w-full object-cover opacity-90"
      />

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-6 bg-foreground/25 px-6 text-center">
        <p className="animate-fade-in text-[0.7rem] uppercase tracking-[0.55em] text-background/80">
          17 სექტემბერი
        </p>
        <h1 className="animate-fade-in font-display text-5xl leading-tight text-background sm:text-7xl md:text-8xl">
          ნინი &amp; ტატო
        </h1>
        <div className="hairline w-28 opacity-80" />
      </div>

      <button
        onClick={finish}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full border border-background/40 px-6 py-2 text-[0.65rem] uppercase tracking-[0.35em] text-background/90 transition-colors hover:bg-background/10"
      >
        გამოტოვება
      </button>
    </div>
  );
}
