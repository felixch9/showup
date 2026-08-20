export default function StoreListing() {
  return (
    <main className="wrap py-12 max-w-2xl space-y-5 text-sm leading-6">
      <h1 className="text-4xl">App Store / Play listing</h1>

      <section>
        <h2 className="text-2xl">Name</h2>
        <p>SHOWUP</p>
        <h2 className="text-2xl mt-4">Subtitle (30 chars)</h2>
        <p>See the crew. Price locked.</p>
        <h2 className="text-2xl mt-4">Promotional text (170)</h2>
        <p>
          Book lawn, pressure wash, and gutters in Columbia, SC. Locked price from grass height and photos. Watch the truck. Crews get paid per job.
        </p>
      </section>

      <section>
        <h2 className="text-2xl">Description</h2>
        <pre className="whitespace-pre-wrap card p-4 text-xs">
{`SHOWUP is home services you can see coming.

Book lawn mowing, pressure washing, gutter cleaning, and yard work like a delivery. You describe the job (how tall is the grass, what siding, photos), the price locks, a nearby crew accepts, and you watch them on the way.

WHY IT’S AN APP
• Camera for job photos and crew ID selfies
• Location to match crews near you
• Push for “crew accepted” and “on the way”
• Full-screen home-screen app (not a Safari tab)

CUSTOMERS
Pick a service → set job conditions → add photos → locked quote → deposit → live tracking → before/after proof.

CREWS
Apply in minutes. See what you earn before you accept. Bring your own mower or washer — we only send jobs your kit can do.

First market: Columbia, South Carolina. Other cities show crews as we launch.

Demo mode: no real charges until you and SHOWUP both go live.`}
        </pre>
      </section>

      <p><b>Keywords:</b> lawn mowing, pressure washing, gutters, Columbia SC, home services, book a crew, yard work</p>
      <p><b>Category:</b> Lifestyle (secondary: Business)</p>
      <p><b>Age:</b> 16+ · crews 18+</p>
      <p><b>Support:</b> https://showup-wheat.vercel.app/support</p>
      <p><b>Privacy:</b> https://showup-wheat.vercel.app/privacy</p>
      <p><b>Marketing:</b> https://showup-wheat.vercel.app</p>
      <p><b>Screenshots:</b> run <code>scripts/store-screenshots.ps1</code> → <code>qa/store/</code></p>
    </main>
  );
}
