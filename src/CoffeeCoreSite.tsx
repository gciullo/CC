import React, { useMemo, useState } from "react";

/**
 * Coffee Core — Single Page Website (Single React Component)
 * ---------------------------------------------------------
 * - TailwindCSS utility classes for styling
 * - Montserrat font imported via <style> tag
 * - Color palette inspired by the two images the user provided
 * - "Fake door" CTA on products: opens a modal and sends a POST to `/api/notify`
 *   so you can wire a serverless function (e.g., Netlify / Vercel) to email the admin
 * - If the POST fails, we gracefully fallback to a `mailto:` link for manual reporting
 *
 * How to wire the email notification (example):
 *   1) Create an endpoint at `/api/notify` that accepts `{ product, email, ts }`.
 *   2) In that function, send an email to your admin (e.g., with SendGrid, SES, Mailgun).
 *   3) Return { ok: true } on success.
 */

export default function CoffeeCoreSite() {
  const [open, setOpen] = useState(false);
  const [clickedProduct, setClickedProduct] = useState(null as null | Product);
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState<string | null>(null);

  type Product = {
    id: string;
    name: string;
    status: "presente" | "futuro";
    summary: string;
    tag: string;
    color: string; // tailwind bg-*
  };

  const palette = {
    darkBrown: "#684330",
    leafGreen: "#57992D",
    cream: "#FBEFD9",
    terracotta: "#DE7C5A",
    teal: "#3B7080",
    sage: "#B3D69B",
    forest: "#455D51",
    straw: "#D8C27A",
    plum: "#5F464B",
    brick: "#8E4A49",
  } as const;

  const products = useMemo<Product[]>(
    () => [
      {
        id: "polifenoli",
        name: "Polifenoli & Bioattivi (upcycled)",
        status: "presente",
        summary:
          "Estratti ad alto valore da scarti di caffè per nutraceutica, food & beverage e cosmetica.",
        tag: "Core",
        color: "bg-[#57992D]",
      },
      {
        id: "pellet",
        name: "Pellet da scarti di caffè",
        status: "futuro",
        summary:
          "Combustibile sostenibile e tracciabile ottenuto dal residuo di lavorazione.",
        tag: "R&D",
        color: "bg-[#8E4A49]",
      },
      {
        id: "bevande",
        name: "Bevande con bioattivi aggiunti",
        status: "futuro",
        summary:
          "Linea di drink funzionali con antiossidanti naturali estratti dal caffè.",
        tag: "R&D",
        color: "bg-[#3B7080]",
      },
      {
        id: "oli-cosmesi",
        name: "Oli per la cosmesi",
        status: "futuro",
        summary:
          "Oli e lipidi da fondi di caffè per skincare e haircare con ingredienti circolari.",
        tag: "R&D",
        color: "bg-[#D8C27A]",
      },
    ],
    []
  );

  const jumpAndHighlight = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    // aggiunge un'animazione di evidenziazione temporanea
    el.classList.add("cc-highlight");
    window.setTimeout(() => el.classList.remove("cc-highlight"), 1000);
    };

  const handleFakeDoor = async (p: Product) => {
    setClickedProduct(p);
    setOpen(true);
    setSubmitting(true);
    setSubmitMsg(null);

    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: p.id,
          email: "info@coffeecore.it", // TODO: sostituire con email admin reale
          ts: new Date().toISOString(),
        }),
      });
      if (res.ok) {
        setSubmitMsg(
          "Grazie! Abbiamo registrato il tuo interesse e avvisato l'amministratore."
        );
      } else {
        setSubmitMsg(null);
        throw new Error("notify failed");
      }
    } catch (e) {
      // Fallback: proponi mailto
      setSubmitMsg(null);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FBEFD9]" style={{ fontFamily: "Montserrat, ui-sans-serif, system-ui" }}>
      {/* Import Montserrat */}
      <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;500;700&display=swap');
      @keyframes ccPulse { 0%{box-shadow:0 0 0 0 rgba(87,153,45,0.4)} 70%{box-shadow:0 0 0 12px rgba(87,153,45,0)} 100%{box-shadow:0 0 0 0 rgba(87,153,45,0)} }
      .cc-highlight{ border-radius:1rem; animation: ccPulse 1.2s ease-in-out 1; background: rgba(179,214,155,0.18); }
      `}</style>

      {/* NAVBAR */}
      <header className="sticky top-0 z-30 backdrop-blur bg-white/60 border-b border-black/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="Coffee Core" className="h-8 w-8 rounded-2xl" />
            <span className="text-xl font-bold tracking-tight text-[#684330]">Coffee Core</span>
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-sm">
            <a href="#mission" className="hover:underline">Missione</a>
            <a href="#process" className="hover:underline">Processo</a>
            <a href="#prodotti" className="hover:underline">Prodotti</a>
            <a href="#contatti" className="hover:underline">Contatti</a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" aria-hidden>
          <svg className="w-[140%] h-[140%] -translate-x-12 -translate-y-8" viewBox="0 0 800 600" fill="none">
            <circle cx="150" cy="150" r="120" fill={palette.leafGreen} />
            <circle cx="350" cy="220" r="180" fill={palette.teal} />
            <circle cx="700" cy="100" r="110" fill={palette.straw} />
          </svg>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="grid md:grid-cols-2 items-center gap-10">
            <div>
              <h1 className="text-4xl sm:text-6xl font-bold leading-tight text-[#455D51]">
                Diamo una <span className="text-[#57992D]">seconda vita</span> al caffè
              </h1>
              <p className="mt-6 text-lg text-[#5F464B] max-w-prose">
                Coffee Core è una <strong>green company</strong> che trasforma gli scarti di caffè in ingredienti funzionali:
                <em> polifenoli, bioattivi e oli</em>. L'upcycling è il nostro core business: dal rifiuto, valore reale.
              </p>
              <div className="mt-8 flex gap-4">
                <a href="#prodotti" className="px-5 py-3 rounded-2xl bg-[#57992D] text-white font-medium shadow hover:translate-y-0.5 transition">
                  Esplora i prodotti
                </a>
                <a href="#cta" className="px-5 py-3 rounded-2xl bg-white text-[#3B7080] border border-[#3B7080]/20 font-medium shadow-sm hover:bg-[#3B7080]/5 transition">
                  Parliamo di partnership
                </a>
              </div>
            </div>
            <aside className="rounded-3xl p-6 sm:p-8 bg-white/70 border border-black/5 shadow-xl">
              <h3 className="text-xl font-semibold text-[#684330]">Impatto circolare</h3>
              <ul className="mt-4 space-y-3 text-[#5F464B]">
                <li>♻️ Upcycling degli scarti di caffè</li>
                <li>🌿 Ingredienti naturali per nutraceutica e cosmetica</li>
                <li>⚗️ Estrazioni a basso impatto energetico</li>
                <li>📦 Filiera tracciabile e partnering con torrefazioni</li>
              </ul>
            </aside>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section id="mission" className="scroll-mt-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h2 className="text-3xl font-bold text-[#455D51]">Missione</h2>
            <p className="mt-4 text-[#5F464B] leading-7">
              Ridurre gli sprechi alimentari valorizzando i sottoprodotti del caffè. Con tecnologie
              di estrazione mirate, isoliamo <strong>polifenoli</strong> e composti <strong>bioattivi</strong> per
              applicazioni che spaziano dal food alla cosmetica, in un'ottica di <em>economia circolare</em>.
            </p>
          </div>
          <div className="rounded-2xl p-6 bg-[#B3D69B] text-[#455D51] shadow">
            <p className="font-medium">Numeri attesi</p>
            <ul className="mt-2 space-y-1 text-sm">
              <li>−60% rifiuti organici conferiti</li>
              <li>+45% resa di estrazione target</li>
              <li>0 solventi clorurati nei processi</li>
            </ul>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="scroll-mt-20 bg-white/70 border-y border-black/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
          <h2 className="text-3xl font-bold text-[#455D51]">Dal fondo al valore</h2>
          <div className="mt-8 grid md:grid-cols-4 gap-6">
            {[
              {
                title: "Raccolta",
                text: "Scarti da torrefazioni e bar, con logistica tracciata.",
                color: palette.straw,
              },
              {
                title: "Pre-trattamento",
                text: "Essiccazione e selezione per massima resa.",
                color: palette.terracotta,
              },
              { title: "Estrazione", text: "Processi a basso impatto.", color: palette.leafGreen },
              { title: "Formulazione", text: "Ingredienti per diversi settori.", color: palette.teal },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl p-5 shadow border border-black/5" style={{ background: s.color }}>
                <p className="text-lg font-semibold text-white drop-shadow-sm">{s.title}</p>
                <p className="mt-2 text-white/90 text-sm leading-6">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="prodotti" className="scroll-mt-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-bold text-[#455D51]">Prodotti</h2>
            <p className="mt-2 text-[#5F464B]">Presenti e futuri: raccontiamo dove siamo e dove andiamo.</p>
          </div>
        </div>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {products.map((p) => (
            <article key={p.id} className={`rounded-3xl border border-black/5 shadow overflow-hidden ${p.color}`}>
              <div className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white drop-shadow-sm">{p.name}</h3>
                  {/* <span className={`text-xs px-2 py-1 rounded-full bg-white/30 text-white backdrop-blur`}>{p.status}</span> */}
                </div>
                <p className="mt-3 text-white/90 leading-6 flex-1">{p.summary}</p>
                <div className="mt-6 flex items-center justify-between">
                  {/* <span className="text-xs uppercase tracking-wide text-white/70">{p.tag}</span> */}
                  <button
                    onClick={() => handleFakeDoor(p)}
                    className="justify-self-start md:justify-self-end px-5 py-3 rounded-2xl bg-white text-[#455D51] font-medium shadow hover:translate-y-0.5 transition"
                  >
                    Scopri di più →
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section id="cta" className="bg-[#455D51]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-bold text-white">Vuoi diventare partner di filiera?</h3>
            <p className="mt-2 text-white/80">
              Cerchiamo torrefazioni, bar e marchi che vogliono trasformare uno scarto in opportunità.
            </p>
          </div>
          <button onClick={() => jumpAndHighlight('contatti')} className="justify-self-start md:justify-self-end px-5 py-3 rounded-2xl bg-white text-[#455D51] font-medium shadow hover:translate-y-0.5 transition">
            Scrivici
            </button>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contatti" className="scroll-mt-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-3xl font-bold text-[#455D51]">Contatti</h2>
            <p className="mt-3 text-[#5F464B]">Parliamo del tuo caso d'uso o di una possibile collaborazione.</p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget as HTMLFormElement);
                const name = String(fd.get("name") || "");
                const email = String(fd.get("email") || "");
                const msg = String(fd.get("message") || "");
                fetch("/api/notify", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ product: "contact", email, name, msg, ts: new Date().toISOString() }),
                }).catch(() => {});
                (e.currentTarget as HTMLFormElement).reset();
                alert("Grazie! Ti ricontatteremo al più presto.");
              }}
              className="mt-6 grid sm:grid-cols-2 gap-4"
            >
              <input name="name" required placeholder="Nome" className="px-4 py-3 rounded-xl bg-white border border-black/10" />
              <input name="email" required type="email" placeholder="Email" className="px-4 py-3 rounded-xl bg-white border border-black/10" />
              <textarea name="message" required placeholder="Messaggio" rows={5} className="sm:col-span-2 px-4 py-3 rounded-xl bg-white border border-black/10" />
              <button className="sm:col-span-2 justify-self-start px-5 py-3 rounded-2xl bg-[#57992D] text-white font-medium shadow hover:translate-y-0.5 transition">
                Invia
              </button>
            </form>
          </div>
          <aside className="rounded-2xl p-6 bg-white border border-black/5 shadow">
            <p className="font-semibold text-[#684330]">Dati aziendali</p>
            <ul className="mt-3 text-sm text-[#5F464B] space-y-1">
              <li><strong>Coffee Core s.r.l. SB</strong></li>
              <li>P.IVA: 02792950699</li>
              <li>Email: info@coffeecore.it</li>
              <li>Sede: Via Primo Mazzolari SNC, 66100 Chieti (presso il Parco Scientifico e Tecnologico d'Abruzzo)
              </li>
            </ul>
          </aside>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-black/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 text-sm text-[#5F464B] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Coffee Core — Upcycled by design.</p>
          <div className="flex gap-2">
            {/* <a href="#" className="underline decoration-dotted">Privacy</a>
            <span>·</span>
            <a href="#" className="underline decoration-dotted">Cookie</a> */}
          </div>
        </div>
      </footer>

      {/* MODAL: Fake Door */}
      {open && clickedProduct && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 grid place-items-center p-4" role="dialog" aria-modal>
          <div className="w-full max-w-lg rounded-3xl bg-white shadow-xl border border-black/5 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-[#455D51]">{clickedProduct.name}</h3>
                <p className="text-sm text-[#5F464B] mt-1">Funzionalità in arrivo: grazie per l'interesse!</p>
              </div>
              <button onClick={() => setOpen(false)} className="p-2 rounded-xl bg-black/5 hover:bg-black/10">✕</button>
            </div>

            <div className="mt-5 space-y-4">
              <p className="text-[#5F464B]">
                Stiamo raccogliendo i clic per dare priorità allo sviluppo. Lascia la tua email se vuoi essere tra i primi a provarlo.
              </p>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget as HTMLFormElement);
                  const email = String(fd.get("email") || "");
                  setSubmitting(true);
                  setSubmitMsg(null);
                  try {
                    const res = await fetch("/api/notify", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ product: clickedProduct.id, email, ts: new Date().toISOString() }),
                    });
                    if (res.ok) {
                      setSubmitMsg("Perfetto! Ti avviseremo appena disponibile.");
                    } else {
                      setSubmitMsg(null);
                      throw new Error("fail");
                    }
                  } catch (err) {
                    setSubmitMsg(null);
                    // show mailto fallback
                    const subject = encodeURIComponent(`Interesse: ${clickedProduct.name}`);
                    const body = encodeURIComponent("Vorrei saperne di più su questo prodotto quando sarà pronto.");
                    window.location.href = `mailto:admin@coffeecore.example?subject=${subject}&body=${body}`;
                  } finally {
                    setSubmitting(false);
                  }
                }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <input name="email" type="email" required placeholder="La tua email" className="flex-1 px-4 py-3 rounded-xl bg-[#FBEFD9] border border-black/10" />
                <button disabled={submitting} className="px-5 py-3 rounded-2xl bg-[#57992D] text-white font-medium shadow disabled:opacity-60">
                  {submitting ? "Invio…" : "Avvisami"}
                </button>
              </form>
              {submitMsg && <p className="text-sm text-[#455D51]">{submitMsg}</p>}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
