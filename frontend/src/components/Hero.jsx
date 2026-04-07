export default function Hero() {
  return (
    <div className="bg-white border-b border-gray-200 py-16">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Your marketplace for your <br />
          <span className="bg-linear-to-r bg-clip-text text-transparent from-indigo-500 to-purple-500">all-day products</span>.
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          Discover amazing products curated just for you.
        </p>
        <button
          onClick={() =>
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: "smooth",
            })
          }
          className="bg-linear-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-600 transition"
        >
          Browse Products
        </button>
      </div>
    </div>
  );
}
