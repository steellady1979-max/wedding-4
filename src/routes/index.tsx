import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useRef, useState } from "react";
import { VideoIntro } from "@/components/wedding/VideoIntro";
import { submitRsvp } from "@/lib/rsvp.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pause, Play } from "lucide-react";
import villaAsset from "@/assets/vila-mosavali.jpg.asset.json";
import sioniAsset from "@/assets/sioni-cathedral.jpg.asset.json";
import ceremonyAsset from "@/assets/outdoor-ceremony.jpg.asset.json";
import welcomeDrinksAsset from "@/assets/welcome-drinks.jpg.asset.json";
import galaDinnerAsset from "@/assets/gala-dinner.jpg.asset.json";
import dressCodeAsset from "@/assets/dress-code.png.asset.json";

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

const TIMELINE = [
  {
    time: "14:00",
    title: "ჯვრისწერა",
    note: "თბილისი, სიონის ტაძარი",
    image: sioniAsset.url,
    imageAlt: "თბილისის სიონის ტაძრის აკვარელური ილუსტრაცია",
  },
  {
    time: "16:30",
    title: "Welcome Drinks",
    image: welcomeDrinksAsset.url,
    imageAlt: "ვილა მოსავლის ტერასა და მისასალმებელი სასმელები",
  },
  {
    time: "17:00",
    title: "ხელის მოწერის ცერემონია",
    image: ceremonyAsset.url,
    imageAlt: "ღია ცის ქვეშ ხელის მოწერის ცერემონიის აკვარელური ილუსტრაცია",
  },
  {
    time: "18:00",
    title: "გალა ვახშამი",
    image: galaDinnerAsset.url,
    imageAlt: "ელეგანტურად გაფორმებული საქორწილო სუფრა",
  },
];

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
        data: { name: name.trim(), attending: answer ?? "no", company: honeypot },
      }),
  });

  if (mutation.isSuccess) {
    return (
      <p className="max-w-md text-center text-sm leading-relaxed text-muted-foreground">
        {answer === "yes"
          ? `გმადლობთ, ${name.trim()}. მოუთმენლად გელოდებით 18 ოქტომბერს.`
          : `გმადლობთ პასუხისთვის, ${name.trim()}. ვწუხვართ, რომ ვერ შეხვდებით.`}
      </p>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim() || !answer) return;
        mutation.mutate();
      }}
      className="flex w-full max-w-sm flex-col items-center gap-6"
    >
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="სახელი / გვარი"
        aria-label="სახელი / გვარი"
        className="h-12 rounded-none border-0 border-b border-border bg-transparent text-center text-base shadow-none focus-visible:ring-0"
      />

      {/* Anti-spam field: invisible to guests. */}
      <input
        type="text"
        name="company"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0"
      />

      <div className="flex w-full gap-3">
        {(
          [
            { key: "yes", label: "დავესწრები" },
            { key: "no", label: "ვერ დავესწრები" },
          ] as const
        ).map((o) => (
          <button
            key={o.key}
            type="button"
            onClick={() => setAnswer(o.key)}
            className={`flex-1 border px-4 py-3 text-[0.65rem] uppercase tracking-[0.25em] transition-colors ${
              answer === o.key
                ? "border-gold bg-accent text-accent-foreground"
                : "border-border text-muted-foreground hover:bg-secondary"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      <Button
        type="submit"
        disabled={!name.trim() || !answer || mutation.isPending}
        className="h-12 w-full rounded-none text-[0.65rem] uppercase tracking-[0.35em]"
      >
        {mutation.isPending ? "იგზავნება…" : "დადასტურება"}
      </Button>

      {mutation.isError ? (
        <p className="text-center text-xs leading-relaxed text-destructive">
          პასუხის შენახვა ვერ მოხერხდა. გთხოვთ, სცადოთ თავიდან.
        </p>
      ) : null}
    </form>
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
        src="https://www.youtube-nocookie.com/embed/J123lM0RvzM?autoplay=1&loop=1&playlist=J123lM0RvzM&enablejsapi=1&controls=0&playsinline=1"
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
        className="fixed right-5 top-5 z-40 h-11 w-11 rounded-full border-border bg-background/90 shadow-sm"
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

      <main className="min-h-screen bg-background">
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
            <h1 className="font-display text-6xl leading-[1.05] text-white sm:text-7xl md:text-8xl">
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


        {/* Location */}
        <section className="border-t border-border px-6 py-24">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 text-center">
            <SectionTitle>ლოკაცია</SectionTitle>
            <h2 className="font-display text-4xl text-foreground sm:text-5xl">
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
              className="h-12 rounded-none border-gold px-8 text-[0.65rem] uppercase tracking-[0.35em]"
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
        <section className="border-t border-border px-6 py-24">
          <div className="mx-auto flex max-w-xl flex-col items-center gap-12">
            <SectionTitle>დღის განრიგი</SectionTitle>
            <ul className="w-full">
              {TIMELINE.map((t) => (
                <li
                  key={t.time}
                  className="grid grid-cols-[4rem_1fr] items-start gap-x-6 gap-y-5 border-b border-border py-8 last:border-0"
                >
                  <span className="w-16 shrink-0 text-xs tracking-[0.2em] text-gold">
                    {t.time}
                  </span>
                   <span>
                    <span className="block font-display text-2xl text-foreground">
                      {t.title}
                   </span>
                  {t.image ? (
                    <img
                      src={t.image}
                      alt={t.imageAlt}
                      loading="lazy"
                      decoding="async"
                      className="col-span-2 mt-1 aspect-[4/3] w-full object-cover sm:col-start-2 sm:aspect-[16/9]"
                    />
                  ) : null}
                    {t.note ? (
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {t.note}
                      </span>
                    ) : null}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Dress code */}
        <section className="border-t border-border px-6 py-24">
          <div className="mx-auto flex max-w-xl flex-col items-center gap-8 text-center">
            <SectionTitle>დრესკოდი</SectionTitle>
            <h2 className="font-display text-4xl text-foreground">
              კლასიკური ელეგანტურობა
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              ძვირფასო სტუმრებო, გთხოვთ აირჩიოთ კლასიკური და ელეგანტური სამოსი
            </p>
            <img
              src={dressCodeAsset.url}
              alt="კლასიკური და ელეგანტური საქორწილო სამოსის აკვარელური ილუსტრაცია"
              loading="lazy"
              decoding="async"
              className="mt-2 h-auto w-full max-w-xs object-contain"
            />
          </div>
        </section>

        {/* RSVP */}
        <section className="border-t border-border px-6 py-24">
          <div className="mx-auto flex max-w-xl flex-col items-center gap-10 text-center">
            <SectionTitle>დასწრების დადასტურება</SectionTitle>
            <h2 className="font-display text-4xl text-foreground">
              გვაცნობეთ თქვენი პასუხი
            </h2>
            <Rsvp />
          </div>
        </section>

        <footer className="border-t border-border px-6 py-12 text-center">
          <p className="font-display text-2xl text-foreground">ლევანი &amp; თამთა</p>
          <p className="mt-2 text-[0.6rem] uppercase tracking-[0.4em] text-muted-foreground">
             18.10 · ვილა მოსავალი
          </p>
        </footer>
      </main>
    </>
  );
}
