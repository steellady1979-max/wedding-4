import { useEffect, useRef, useState, type CSSProperties } from "react";
import videoAsset from "@/assets/wedding-levani-tamta-intro.mp4.asset.json";

const PETALS = [
  { left: "4%", delay: "0s", duration: "9s", size: "0.7rem" },
  { left: "13%", delay: "-4s", duration: "11s", size: "0.9rem" },
  { left: "24%", delay: "-7s", duration: "13s", size: "0.65rem" },
  { left: "36%", delay: "-2s", duration: "10s", size: "1rem" },
  { left: "48%", delay: "-8s", duration: "14s", size: "0.75rem" },
  { left: "59%", delay: "-5s", duration: "12s", size: "0.9rem" },
  { left: "70%", delay: "-1s", duration: "10.5s", size: "0.7rem" },
  { left: "81%", delay: "-6s", duration: "13.5s", size: "1rem" },
  { left: "91%", delay: "-3s", duration: "11.5s", size: "0.8rem" },
] as const;

export function VideoIntro({
  onFinish,
  onFirstInteraction,
}: {
  onFinish: () => void;
  onFirstInteraction: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [leaving, setLeaving] = useState(false);

  const finishRef = useRef(false);
  const finish = () => {
    if (finishRef.current) return;
    finishRef.current = true;
    setLeaving(true);
    window.setTimeout(onFinish, 900);
  };

  const handleInteraction = () => {
    onFirstInteraction();
    finish();
  };

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
    // Safety net: never trap the guest on the intro if the video stalls.
    const id = window.setTimeout(finish, 8000);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      onClick={handleInteraction}
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

      <div className="petal-field" aria-hidden>
        {PETALS.map((petal, index) => (
          <span
            key={petal.left}
            className="rose-petal"
            style={{
              left: petal.left,
              animationDelay: petal.delay,
              animationDuration: petal.duration,
              width: petal.size,
              height: `calc(${petal.size} * 1.35)`,
              "--petal-drift": `${index % 2 === 0 ? 1 : -1}8vw`,
            } as CSSProperties}
          />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-6 bg-black/25 px-6 text-center">
        <p className="animate-fade-in text-[0.7rem] uppercase tracking-[0.55em] text-white/80">
          18 ოქტომბერი
        </p>
        <h1 className="animate-fade-in font-display text-5xl leading-tight text-white sm:text-7xl md:text-8xl">
          ლევანი &amp; თამთა
        </h1>
        <div className="hairline w-28 opacity-80" />
      </div>
    </div>
  );
}
