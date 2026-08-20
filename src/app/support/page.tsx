export default function Support() {
  return (
    <main className="wrap py-10 max-w-2xl">
      <h1 className="text-4xl">Support</h1>
      <p className="mt-3 text-[var(--muted)]">24/7 chat in production. This demo is the desk.</p>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <a className="card p-5" href="mailto:felix@localhost">I&apos;m a customer</a>
        <a className="card p-5" href="/dash/account">I&apos;m a crew</a>
        <a className="card p-5" href="/merchant">I&apos;m a business</a>
        <a className="card p-5" href="/ops">Ops / admin</a>
      </div>
    </main>
  );
}
