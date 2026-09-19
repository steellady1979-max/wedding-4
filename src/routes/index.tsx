import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { VideoIntro } from "@/components/wedding/VideoIntro";
import { submitRsvp, submitWish } from "@/lib/rsvp.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronDown,
  Church,
  HeartHandshake,
  type LucideIcon,
  MapPin,
  Pause,
  Play,
  UtensilsCrossed,
  Wine,
} from "lucide-react";
import villaAsset from "@/assets/vila-mosavali.jpg.asset.json";
import sioniAsset from "@/assets/sioni-cathedral.jpg.asset.json";
import ceremonyAsset from "@/assets/outdoor-ceremony.jpg.asset.json";
import waltzStillAsset from "@/assets/waltz-still.jpg.asset.json";
import galaDinnerAsset from "@/assets/gala-dinner.jpg.asset.json";
import dressCodeAsset from "@/assets/dress-code-guests.png.asset.json";
import champagneTowerAsset from "@/assets/champagne-tower.png.asset.json";
import petalFieldAsset from "@/assets/rose-petal-field.png.asset.json";
import envelopeVideoAsset from "@/assets/wedding-envelope.mp4.asset.json";
import magicalWaltzAsset from "@/assets/magical-waltz.mp4.asset.json";
import coupleSealAsset from "@/assets/couple-seal.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ლევანი & თამთა — 18 ოქტომბერი, ვილა მოსავალი" },
      {
        name: "description",
        content:
          "ლევანისა და თამთას ქორწილი 18 ოქტომბერს ვილა მოსავალში. დღის განრიგი, დრესკოდი და დასწრების დადასტურება.",
      },
      { property: "og:title", content: "ლევანი & თამთა — 18 ოქტომბერი" },
      {
        property: "og:description",
        content: "გეპატიჟებით ჩვენს ქორწილზე ვილა მოსავალში, 18 ოქტომბერს.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const WEDDING_DATE = new Date("2026-10-18T14:00:00+04:00");

type TimelineItem = {
  time: string;
  title: string;
  icon: LucideIcon;
  image: string;
  imageAlt: string;
  mapUrl?: string;
  imageClassName?: string;
};

const TIMELINE: TimelineItem[] = [
  {
    time: "14:00",
    title: "ჯვრისწერა",
    icon: Church,
    image: sioniAsset.url,
    imageAlt: "თბილისის სიონის ტაძრის აკვარელური ილუსტრაცია",
    mapUrl:
      "https://www.google.com/maps/place/%E1%83%A1%E1%83%98%E1%83%9D%E1%83%9C%E1%83%98%E1%83%A1+%E1%83%A2%E1%83%90%E1%83%AB%E1%83%90%E1%83%A0%E1%83%98/@41.6913325,44.802684,650m/data=!3m1!1e3!4m10!1m2!2m1!1z4YOX4YOR4YOY4YOa4YOY4YOh4YOYIOGDoeGDmOGDneGDnOGDmOGDoSDhg6Lhg5Dhg6vhg5Dhg6Dhg5g!3m6!1s0x40440d0079a63b3f:0xd68818f2272b606d!8m2!3d41.6913325!4d44.8074476!15sCjvhg5fhg5Hhg5jhg5rhg5jhg6Hhg5gg4YOh4YOY4YOd4YOc4YOY4YOhIOGDouGDkOGDq-GDkOGDoOGDmJIBBmNodXJjaOABAA!16s%2Fg%2F11z5v57p68?entry=ttu&g_ep=EgoyMDI2MDkxNS4wIKXMDSoASAFQAw%3D%3D",
  },
  {
    time: "16:30",
    title: "სტუმრების მიღება",
    icon: Wine,
    image: waltzStillAsset.url,
    imageAlt: "ლევანისა და თამთას საქორწილო ვალსი",
    imageClassName:
      "mx-auto block h-auto max-h-[16rem] w-auto max-w-[62%] rounded-sm object-contain sm:max-h-[18rem] sm:max-w-[12rem]",
  },
  {
    time: "17:00",
    title: "ხელმოწერის ცერემონია",
    icon: HeartHandshake,
    image: ceremonyAsset.url,
    imageAlt: "ღია ცის ქვეშ ხელის მოწერის ცერემონიის აკვარელური ილუსტრაცია",
  },
  {
    time: "18:00",
    title: "გალა ვახშამი",
    icon: UtensilsCrossed,
    image: galaDinnerAsset.url,
    imageAlt: "ელეგანტურად გაფორმებული საქორწილო სუფრა",
  },
];

function Reveal({
  children,
  className = "",
  fromRight = false,
}: {
  children: ReactNode;
  className?: string;
  fromRight?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${fromRight ? "reveal-dance" : "reveal-soft"} ${visible ? "is-visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

function LandingPetals() {
  return (
    <div className="landing-petals" aria-hidden="true">
      <img src={petalFieldAsset.url} alt="" className="landing-petal-sheet" />
      <img src={petalFieldAsset.url} alt="" className="landing-petal-sheet landing-petal-sheet-delayed" />
    </div>
  );
}

function Itinerary() {
  const [openItem, setOpenItem] = useState<string | null>(null);

  return (
    <div className="w-full border-y border-border">
      {TIMELINE.map((item) => {
        const Icon = item.icon;
        const isOpen = openItem === item.time;
        const panelId = `itinerary-${item.time.replace(":", "-")}`;

        return (
          <article key={item.time} className="border-b border-border last:border-b-0">
            <Button
              type="button"
              variant="ghost"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenItem(isOpen ? null : item.time)}
              className="grid h-auto w-full grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-4 rounded-none px-1 py-5 text-left text-primary hover:bg-primary/5 hover:text-primary sm:grid-cols-[3rem_minmax(0,1fr)_auto] sm:px-3"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-primary/30">
                <Icon aria-hidden="true" strokeWidth={1.2} className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <time className="block text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground">
                  {item.time}
                </time>
                <span className="mt-1 block font-display text-xl leading-snug text-foreground sm:text-2xl">
                  {item.title}
                </span>
              </span>
              <ChevronDown
                aria-hidden="true"
                className={`h-4 w-4 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
              />
            </Button>

            <div
              id={panelId}
              className={`itinerary-panel ${isOpen ? "is-open" : ""}`}
            >
              <div className="itinerary-panel-inner">
                <div className="pb-6 pl-[4.25rem] pr-1 sm:pl-[5.75rem] sm:pr-3">
                  <img
                    src={item.image}
                    alt={item.imageAlt}
                    loading="lazy"
                    decoding="async"
                    className={
                      item.imageClassName ??
                      "block h-auto w-full rounded-sm object-contain"
                    }
                  />
                  {item.mapUrl ? (
                    <Button
                      asChild
                      variant="ghost"
                      className="mt-3 h-10 rounded-none px-0 text-[0.62rem] uppercase tracking-[0.22em] text-primary hover:bg-transparent hover:text-primary/80"
                    >
                      <a href={item.mapUrl} target="_blank" rel="noopener noreferrer">
                        <MapPin className="h-4 w-4" />
                        იხილე რუკაზე
                      </a>
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function useCountdown(target: Date) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return useMemo(() => {
    if (!now) return null;
    const diff = Math.max(0, target.getTime() - now.getTime());
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff / 3600000) % 24),
      minutes: Math.floor((diff / 60000) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }, [now, target]);
}

function SectionTitle({ children }: { children: string }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <span className="text-[0.6rem] uppercase tracking-[0.5em] text-muted-foreground">
        {children}
      </span>
      <div className="hairline w-16" />
    </div>
  );
}

function Countdown({ onHero = false }: { onHero?: boolean }) {
  const c = useCountdown(WEDDING_DATE);
  const items = [
    { label: "დღე", value: c?.days },
    { label: "საათი", value: c?.hours },
    { label: "წუთი", value: c?.minutes },
    { label: "წამი", value: c?.seconds },
  ];

  return (
    <div className="grid w-full max-w-xl grid-cols-4 gap-2 sm:gap-6">
      {items.map((i) => (
        <div key={i.label} className="flex flex-col items-center gap-2">
          <span
            className={`font-display text-4xl sm:text-5xl ${
              onHero ? "text-white" : "text-foreground"
            }`}
          >
            {i.value === undefined ? "—" : String(i.value).padStart(2, "0")}
          </span>
          <span
            className={`text-[0.55rem] uppercase tracking-[0.35em] ${
              onHero ? "text-white/75" : "text-muted-foreground"
            }`}
          >
            {i.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function Rsvp() {
  const [name, setName] = useState("");
  const [answer, setAnswer] = useState<"yes" | "no" | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const submit = useServerFn(submitRsvp);

  const mutation = useMutation({
    mutationFn: () =>
      submit({
        data: {
          name: name.trim(),
          attending: answer ?? "no",
          company: honeypot,
        },
      }),
  });

  if (mutation.isSuccess) {
    return (
      <div className="max-w-sm py-10 text-center" aria-live="polite">
        <p className="font-display text-3xl text-foreground">მადლობა, {name.trim()}</p>
        <p className="mt-3 text-sm text-muted-foreground">თქვენი პასუხი მიღებულია</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (!name.trim() || !answer) return;
        mutation.mutate();
      }}
      className="flex w-full max-w-sm flex-col items-center gap-6"
    >
      <Input
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="სახელი / გვარი"
        aria-label="სახელი / გვარი"
        maxLength={80}
        className="h-12 rounded-none border-0 border-b border-border bg-transparent text-center text-base shadow-none focus-visible:ring-0"
      />

      <input
        type="text"
        name="company"
        value={honeypot}
        onChange={(event) => setHoneypot(event.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0"
      />

      <div className="flex w-full gap-3">
        {(
          [
            { key: "yes", label: "დავესწრები" },
            { key: "no", label: "ვერ დავესწრები" },
          ] as const
        ).map((option) => (
          <Button
            key={option.key}
            type="button"
            variant="outline"
            onClick={() => setAnswer(option.key)}
            className={`h-12 flex-1 rounded-none px-3 text-[0.65rem] uppercase tracking-[0.2em] ${
              answer === option.key
                ? "border-primary bg-primary text-primary-foreground"
                : "border-primary/40 bg-transparent text-foreground hover:bg-primary/10"
            }`}
          >
            {option.label}
          </Button>
        ))}
      </div>

      <Button
        type="submit"
        disabled={!name.trim() || !answer || mutation.isPending}
        className="h-12 w-full rounded-none bg-primary text-[0.65rem] uppercase tracking-[0.35em] text-primary-foreground hover:bg-primary/90"
      >
        {mutation.isPending ? "იგზავნება…" : "დადასტურება"}
      </Button>

      {mutation.isError ? (
        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          პასუხის შენახვა ვერ მოხერხდა. გთხოვთ, სცადოთ თავიდან.
        </p>
      ) : null}
    </form>
  );
}

function WishForm() {
  const [name, setName] = useState("");
  const [wish, setWish] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const submit = useServerFn(submitWish);
  const mutation = useMutation({
    mutationFn: () => submit({ data: { name: name.trim(), wish: wish.trim(), company: honeypot } }),
  });

  if (mutation.isSuccess) {
    return (
      <div className="relative flex min-h-72 w-full max-w-md items-center justify-center text-center" aria-live="polite">
        <span className="wish-star wish-star-new" aria-hidden="true" />
        <span className="wish-heart" aria-hidden="true">♡</span>
        <div className="relative z-10 mt-40 max-w-sm">
          <p className="font-display text-3xl text-starlight">{name.trim()}</p>
          <p className="mt-3 text-sm leading-relaxed text-night-muted">შენი სურვილი ცაზე ვარსკვლავად აინთო</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={(event) => { event.preventDefault(); if (name.trim() && wish.trim()) mutation.mutate(); }} className="flex w-full max-w-sm flex-col gap-5">
      <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="სახელი / გვარი" aria-label="სურვილის ავტორი" maxLength={80} className="h-12 rounded-none border-0 border-b border-starlight/30 bg-transparent text-center text-starlight shadow-none placeholder:text-night-muted focus-visible:ring-0" />
      <textarea value={wish} onChange={(event) => setWish(event.target.value)} placeholder="დაწერე სურვილი..." aria-label="სურვილი" minLength={2} maxLength={500} rows={4} className="w-full resize-none rounded-none border border-starlight/25 bg-night/40 px-4 py-3 text-sm leading-relaxed text-starlight outline-none transition-colors placeholder:text-night-muted focus:border-starlight/60" />
      <input type="text" name="website" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="pointer-events-none absolute h-0 w-0 opacity-0" />
      <Button type="submit" disabled={!name.trim() || !wish.trim() || mutation.isPending} className="h-12 rounded-none bg-primary text-[0.65rem] uppercase tracking-[0.3em] text-primary-foreground hover:bg-primary/90">{mutation.isPending ? "ინთება…" : "აანთე ვარსკვლავი"}</Button>
      {mutation.isError ? <p className="text-center text-xs text-night-muted">სურვილის შენახვა ვერ მოხერხდა. გთხოვთ, სცადოთ თავიდან.</p> : null}
    </form>
  );
}

function RsvpSection() {
  return (
    <section className="relative z-10 border-t border-border px-6 py-24">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-9 text-center">
        <SectionTitle>დასწრების დადასტურება</SectionTitle>
        <Reveal className="w-full max-w-[12rem]"><img src={champagneTowerAsset.url} alt="შამპანურის ბოკალების სადღესასწაულო ილუსტრაცია" loading="lazy" decoding="async" className="h-auto w-full object-contain" /></Reveal>
        <Rsvp />
      </div>
    </section>
  );
}

function WishSky() {
  return (
    <section className="wish-sky relative z-10 overflow-hidden border-t border-starlight/15 bg-night px-6 py-24 text-starlight">
      <div className="wish-stars" aria-hidden="true">
        {Array.from({ length: 26 }, (_, index) => (
          <span key={index} className="wish-star" />
        ))}
      </div>
      <div className="relative z-10 mx-auto flex max-w-xl flex-col items-center gap-10 text-center">
        <span className="text-[0.6rem] uppercase tracking-[0.5em] text-night-muted">
          სურვილების ცა
        </span>
        <div>
          <h2 className="font-display text-4xl leading-tight text-starlight sm:text-5xl">
            დატოვე სურვილი ცაზე
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-night-muted">
            გაგვიზიარე შენი თბილი სურვილი და აანთე ახალი ვარსკვლავი ჩვენს ცაზე
          </p>
        </div>
        <WishForm />
      </div>
    </section>
  );
}

function WaltzVideo() {
  return (
    <section className="relative z-10 border-t border-border bg-background px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto w-full max-w-sm overflow-hidden rounded-sm">
        <video
          src={magicalWaltzAsset.url}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="ჯადოსნური საქორწილო ვალსი"
          className="block aspect-[9/16] h-auto w-full object-contain"
        />
      </div>
    </section>
  );
}

function MusicPlayer({ started }: { started: boolean }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [playing, setPlaying] = useState(started);

  useEffect(() => setPlaying(started), [started]);

  if (!started) return null;

  const sendCommand = (command: "playVideo" | "pauseVideo") => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func: command, args: [] }),
      "https://www.youtube-nocookie.com",
    );
  };

  return (
    <>
      <iframe
        ref={iframeRef}
        title="საქორწილო მუსიკა"
        src="https://www.youtube-nocookie.com/embed/GfAb0gNPy6s?autoplay=1&loop=1&playlist=GfAb0gNPy6s&enablejsapi=1&controls=0&playsinline=1"
        allow="autoplay; encrypted-media"
        className="pointer-events-none fixed h-px w-px opacity-0"
      />
      <Button
        type="button"
        size="icon"
        variant="outline"
        onClick={() => {
          const nextPlaying = !playing;
          sendCommand(nextPlaying ? "playVideo" : "pauseVideo");
          setPlaying(nextPlaying);
        }}
        aria-label={playing ? "მუსიკის შეჩერება" : "მუსიკის ჩართვა"}
        title={playing ? "მუსიკის შეჩერება" : "მუსიკის ჩართვა"}
        className="fixed right-5 top-5 z-40 h-11 w-11 rounded-full border-primary bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:text-primary-foreground"
      >
        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
    </>
  );
}

function Index() {
  const [introDone, setIntroDone] = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);

  useEffect(() => {
    document.body.style.overflow = introDone ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [introDone]);

  useEffect(() => {
    const startMusic = () => setMusicStarted(true);
    document.addEventListener("pointerdown", startMusic, { once: true });
    return () => document.removeEventListener("pointerdown", startMusic);
  }, []);

  return (
    <>
      <MusicPlayer started={musicStarted} />
      {!introDone && (
        <VideoIntro
          onFinish={() => setIntroDone(true)}
          onFirstInteraction={() => setMusicStarted(true)}
        />
      )}

      <main className="relative min-h-screen overflow-hidden bg-background">
        <LandingPetals />
        {/* Hero */}
        <section className="relative flex min-h-screen flex-col items-center justify-center gap-8 overflow-hidden px-6 py-24 text-center">
          <img
            src={villaAsset.url}
            alt="ვილა მოსავლის აკვარელური ილუსტრაცია"
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-foreground/35" />

          <div className="relative flex flex-col items-center gap-8">
            <p className="text-[0.6rem] uppercase tracking-[0.5em] text-white/80">
              გეპატიჟებით
            </p>
            <h1 className="sparkle-heading font-display text-6xl leading-[1.05] text-white sm:text-7xl md:text-8xl">
              ლევანი &amp; თამთა
            </h1>
            <div className="hairline w-24" />
            <div className="flex flex-col items-center gap-2 text-sm tracking-[0.2em] text-white/85">
              <span>18 ოქტომბერი</span>
              <span>ვილა მოსავალი</span>
            </div>
            <Countdown onHero />
          </div>
        </section>

        {/* Wedding envelope */}
        <section className="relative z-10 border-t border-border px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-sm overflow-hidden rounded-sm">
            <video
              src={envelopeVideoAsset.url}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="საქორწილო კონვერტის ანიმაცია"
              className="block aspect-[808/1138] w-full object-cover"
            />
          </div>
        </section>

        {/* Location */}
        <section className="relative z-10 border-t border-border px-6 py-24">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 text-center">
            <SectionTitle>ლოკაცია</SectionTitle>
            <h2 className="sparkle-heading font-display text-4xl text-foreground sm:text-5xl">
               ვილა მოსავალი
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
               ცერემონია გაიმართება ღია ცის ქვეშ.
            </p>
            <div className="aspect-[4/3] w-full overflow-hidden border border-border sm:aspect-[16/9]">
              <iframe
                title="ვილა მოსავალი რუკაზე"
                src="https://www.google.com/maps?q=Mosavali%20Event%20Hall&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full border-0"
              />
            </div>
            <Button
              asChild
              variant="outline"
              className="h-12 rounded-none border-primary bg-primary px-8 text-[0.65rem] uppercase tracking-[0.35em] text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
            >
              <a
                 href="https://maps.app.goo.gl/evaofQxhjzTiQbQw8?g_st=ic"
                target="_blank"
                rel="noopener noreferrer"
              >
                რუკაზე ნახვა
              </a>
            </Button>
          </div>
        </section>

        {/* Timeline */}
        <section className="relative z-10 border-t border-border px-6 py-24">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-12">
            <SectionTitle>დღის განრიგი</SectionTitle>
            <Itinerary />
          </div>
        </section>

        {/* Dress code */}
        <section className="relative z-10 border-t border-border px-6 py-24">
          <div className="mx-auto flex max-w-xl flex-col items-center gap-8 text-center">
            <SectionTitle>დრესკოდი</SectionTitle>
            <h2 className="sparkle-heading font-display text-4xl text-foreground">
              კლასიკური ელეგანტურობა
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              ძვირფასო სტუმრებო, გთხოვთ აირჩიოთ კლასიკური და ელეგანტური სამოსი
            </p>
            <Reveal fromRight className="mt-2 w-full max-w-sm">
              <img
                src={dressCodeAsset.url}
                alt="კლასიკური და ელეგანტური საქორწილო სამოსის აკვარელური ილუსტრაცია"
                loading="lazy"
                decoding="async"
                className="h-auto w-full object-contain"
              />
            </Reveal>
          </div>
        </section>

        <RsvpSection />
        <WaltzVideo />
        <WishSky />

        <footer className="relative z-10 border-t border-primary/30 bg-primary px-6 py-12 text-center text-primary-foreground">
          <img
            src={coupleSealAsset.url}
            alt="ლევანისა და თამთას მონოგრამა"
            loading="lazy"
            decoding="async"
            className="mx-auto mb-5 h-28 w-28 object-contain mix-blend-screen sm:h-32 sm:w-32"
          />
          <p className="font-display text-2xl text-primary-foreground">ლევანი &amp; თამთა</p>
          <p className="mt-2 text-[0.6rem] uppercase tracking-[0.4em] text-primary-foreground/70">
             18.10 · ვილა მოსავალი
          </p>
        </footer>
      </main>
    </>
  );
}
