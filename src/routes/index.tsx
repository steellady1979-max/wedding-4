import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { VideoIntro } from "@/components/wedding/VideoIntro";
import { submitRsvp } from "@/lib/rsvp.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Moon, Sun } from "lucide-react";
import chateauAsset from "@/assets/chateau-mukhrani.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ლევანი & თამთა — 17 სექტემბერი, შატო მუხრანი" },
      {
        name: "description",
        content:
          "ლევანისა და თამთას ქორწილი 17 სექტემბერს შატო მუხრანში. დღის განრიგი, დრესკოდი და დასწრების დადასტურება.",
      },
      { property: "og:title", content: "ლევანი & თამთა — 17 სექტემბერი" },
      {
        property: "og:description",
        content: "მოგვიწვევთ ჩვენს ქორწილზე შატო მუხრანში, 17 სექტემბერს.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const WEDDING_DATE = new Date("2026-09-17T17:00:00+04:00");

const TIMELINE = [
  { time: "17:00", title: "სტუმრების მიღება", note: "შამპანური და მისალმება" },
  { time: "18:00", title: "ცერემონია", note: "ჩატო მუხრანის ბაღი" },
  { time: "19:30", title: "სადილი", note: "ვახშამი და სადღეგრძელოები" },
  { time: "22:00", title: "ცეკვა", note: "პირველი ცეკვა და მუსიკა" },
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
          ? `გმადლობთ, ${name.trim()}. მოუთმენლად გელოდებით 17 სექტემბერს.`
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
        placeholder="თქვენი სახელი"
        aria-label="თქვენი სახელი"
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

function NightToggle() {
  const [night, setNight] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("night", night);
  }, [night]);

  return (
    <button
      onClick={() => setNight((n) => !n)}
      aria-label={night ? "დღის რეჟიმი" : "ღამის რეჟიმი"}
      className="fixed right-5 top-5 z-[60] flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-black/25 text-white backdrop-blur-sm transition-colors hover:bg-black/40"
    >
      {night ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

function Index() {
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    document.body.style.overflow = introDone ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [introDone]);

  return (
    <>
      <NightToggle />
      {!introDone && <VideoIntro onFinish={() => setIntroDone(true)} />}

      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="relative flex min-h-screen flex-col items-center justify-center gap-8 overflow-hidden px-6 py-24 text-center">
          <img
            src={chateauAsset.url}
            alt="შატო მუხრანის აკვარელური ილუსტრაცია"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/35 transition-colors duration-1000 [.night_&]:bg-[#0b1020]/65" />
          <div className="starfield" aria-hidden />

          <div className="relative flex flex-col items-center gap-8">
            <p className="text-[0.6rem] uppercase tracking-[0.5em] text-white/80">
              გეპატიჟებით
            </p>
            <h1 className="font-display text-6xl leading-[1.05] text-white sm:text-7xl md:text-8xl">
              ლევანი &amp; თამთა
            </h1>
            <div className="hairline w-24" />
            <div className="flex flex-col items-center gap-2 text-sm tracking-[0.2em] text-white/85">
              <span>17 სექტემბერი</span>
              <span>შატო მუხრანი</span>
            </div>
            <Countdown onHero />
          </div>
        </section>


        {/* Location */}
        <section className="border-t border-border px-6 py-24">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 text-center">
            <SectionTitle>ლოკაცია</SectionTitle>
            <h2 className="font-display text-4xl text-foreground sm:text-5xl">
              შატო მუხრანი
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              მუხრანი, მცხეთა-მთიანეთი. ცერემონია გაიმართება ისტორიულ ბაღში.
            </p>
            <Button
              asChild
              variant="outline"
              className="h-12 rounded-none border-gold px-8 text-[0.65rem] uppercase tracking-[0.35em]"
            >
              <a
                href="https://maps.google.com/?q=Chateau+Mukhrani"
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
                  className="flex items-baseline gap-6 border-b border-border py-6 last:border-0"
                >
                  <span className="w-16 shrink-0 text-xs tracking-[0.2em] text-gold">
                    {t.time}
                  </span>
                  <span className="flex-1">
                    <span className="block font-display text-2xl text-foreground">
                      {t.title}
                    </span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {t.note}
                    </span>
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
              ჰაეროვანი ელეგანტურობა
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              კრემისფერი, ქვიშისფერი და პასტელური ტონები. მსუბუქი ქსოვილები,
              დახვეწილი ხაზები. გთხოვთ, თავი შეიკავოთ თეთრი და მუქი ფერებისგან.
            </p>
            <div className="flex gap-3 pt-2">
              {["#FBF9F5", "#EFE7DA", "#E3D9CB", "#D9C8B4", "#C9BFAF"].map((c) => (
                <span
                  key={c}
                  aria-hidden
                  className="h-10 w-10 rounded-full border border-border"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
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
            17.09 · შატო მუხრანი
          </p>
        </footer>
      </main>
    </>
  );
}
