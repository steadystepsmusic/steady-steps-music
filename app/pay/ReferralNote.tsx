// Shown on every payment page. Only paying students reach these pages.
export default function ReferralNote() {
  return (
    <div className="max-w-4xl mx-auto px-6 pb-14">
      <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-6 text-center">
        <p className="text-slate-900 font-black text-lg mb-1">Know someone looking for lessons?</p>
        <p className="text-slate-600 leading-relaxed">
          Send them to{' '}
          <a href="https://steadystepsmusic.com" className="text-teal-700 font-semibold hover:underline">steadystepsmusic.com</a>
          {' '}and have them mention your name. They get a free intro lesson, and once they sign up, your next lesson is on me.
        </p>
      </div>
    </div>
  )
}
