export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center m-20">
      <h1 className="text-4xl font-bold mb-4">404 – Page Not Found</h1>
      <p className="text-lg text-gray-500 mb-6">
        The page you are looking for does not exist.
      </p>

      <a
        href="/"
        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700"
      >
        Go back home
      </a>
    </div>
  );
}
