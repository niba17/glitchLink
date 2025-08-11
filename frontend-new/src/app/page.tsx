export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white px-6">
      <section className="text-center max-w-2xl">
        <h1 className="text-5xl font-extrabold mb-4">
          Welcome to <span className="text-blue-400">glitchLink</span>
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          The modern platform for connecting ideas, people, and projects
          seamlessly.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/dashboard"
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition"
          >
            Go to Dashboard
          </a>
          <a
            href="#features"
            className="border border-gray-500 hover:border-gray-300 text-gray-300 hover:text-white font-medium py-3 px-6 rounded-lg transition"
          >
            Learn More
          </a>
        </div>
      </section>

      <section id="features" className="mt-20 max-w-4xl text-center space-y-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Why glitchLink?</h2>
          <p className="text-gray-400">
            We bring you a fast, modern, and reliable way to collaborate.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2">⚡ Fast</h3>
            <p className="text-gray-400">
              Optimized for performance and speed.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2">🔒 Secure</h3>
            <p className="text-gray-400">Your data stays safe with us.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2">🌎 Accessible</h3>
            <p className="text-gray-400">Works on any device, anywhere.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
