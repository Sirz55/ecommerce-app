import Image from "next/image";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <Image
          src="/maintenance.svg"
          alt="Maintenance"
          width={200}
          height={200}
          className="mx-auto mb-8"
        />
        <h1 className="text-3xl font-bold mb-4">Site Maintenance</h1>
        <p className="text-gray-600 mb-8">
          We're currently performing scheduled maintenance. We'll be back online shortly!
        </p>
        <div className="flex justify-center space-x-4">
          <a
            href="https://twitter.com/yourcompany"
            className="text-gray-600 hover:text-gray-800"
          >
            Follow us on Twitter
          </a>
          <a
            href="https://facebook.com/yourcompany"
            className="text-gray-600 hover:text-gray-800"
          >
            Follow us on Facebook
          </a>
        </div>
      </div>
    </div>
  );
}
