import { useEffect, useRef, useState, type CSSProperties } from "react";

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
}: {
  onFinish: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [buffering, setBuffering] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const finishRef = useRef(false);
  const finish = () => {
    if (finishRef.current) return;
    finishRef.current = true;
    setLeaving(true);
    window.setTimeout(onFinish, 900);
  };

  useEffect(() => {
    void videoRef.current?.play().catch(finish);
    // Never trap a guest on the intro, even if loading or playback stalls.
    const id = window.setTimeout(finish, 12000);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 bg-foreground transition-opacity duration-[900ms] ${
        leaving ? "opacity-0" : "opacity-100"
      }`}
    >
      <video
        ref={videoRef}
        src="/video/wedding-intro.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
        onPlaying={() => setBuffering(false)}
        onWaiting={() => setBuffering(true)}
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
        {buffering ? (
          <p className="mt-4 text-xs tracking-[0.18em] text-white/75" role="status">
            ვიდეო იტვირთება…
          </p>
        ) : null}
      </div>

      <button
        type="button"
        onClick={finish}
        className="absolute right-5 top-5 border border-white/50 bg-black/25 px-4 py-2 text-[0.6rem] uppercase tracking-[0.25em] text-white"
      >
        გამოტოვება
      </button>
    </div>
  );
}
