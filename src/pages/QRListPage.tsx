import { useState } from "react";
import { generateAllEncodedUrls } from "../utils/qrEncoding";

export default function QRListPage() {
  const [baseUrl, setBaseUrl] = useState("https://kafe.davinciboardgame.com");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const urls = generateAllEncodedUrls(baseUrl);

  const handleCopy = (url: string, index: number) => {
    navigator.clipboard.writeText(url);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleExportCSV = () => {
    const csvContent = [
      ["Location", "Table", "Full URL"].join(","),
      ...urls.map(item =>
        [item.locationName, item.tableName, item.fullUrl].join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "davinci-qr-codes.csv";
    link.click();
  };

  const handleExportText = () => {
    const textContent = urls
      .map(item => `${item.locationName} - Masa ${item.tableName}: ${item.fullUrl}`)
      .join("\n");

    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "davinci-qr-codes.txt";
    link.click();
  };

  const bahceliTables = urls.filter(u => u.locationId === 1);
  const neoramaTables = urls.filter(u => u.locationId === 2);

  return (
    <div className="min-h-screen bg-cream-bg p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-germania text-dark-brown mb-8 text-center">
          QR Kod Listesi
        </h1>

        {/* Base URL Input */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <label className="block text-lg font-merriweather text-dark-brown mb-2">
            Base URL:
          </label>
          <input
            type="text"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-light-brown"
            placeholder="https://kafe.davinciboardgame.com"
          />
        </div>

        {/* Export Buttons */}
        <div className="flex gap-4 mb-8 justify-center flex-wrap">
          <button
            onClick={handleExportCSV}
            className="px-6 py-3 bg-light-brown text-white rounded-lg hover:bg-dark-brown transition-colors font-merriweather"
          >
            📊 CSV İndir
          </button>
          <button
            onClick={handleExportText}
            className="px-6 py-3 bg-light-brown text-white rounded-lg hover:bg-dark-brown transition-colors font-merriweather"
          >
            📄 TXT İndir
          </button>
          <button
            onClick={() => {
              const allUrls = urls.map(u => u.fullUrl).join("\n");
              navigator.clipboard.writeText(allUrls);
              alert("Tüm URL'ler kopyalandı!");
            }}
            className="px-6 py-3 bg-light-brown text-white rounded-lg hover:bg-dark-brown transition-colors font-merriweather"
          >
            📋 Tümünü Kopyala
          </button>
        </div>

        {/* Tables Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bahçeli */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-germania text-dark-brown mb-4 border-b pb-2">
              Bahçeli (Location 1) - {bahceliTables.length} Masa
            </h2>
            <div className="space-y-2">
              {bahceliTables.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-cream-bg rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <span className="font-merriweather text-dark-brown font-semibold">
                      Masa {item.tableName}:
                    </span>
                    <span className="ml-2 text-sm text-gray-600 break-all">
                      {item.fullUrl}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(item.fullUrl, index)}
                    className="ml-4 px-3 py-1 bg-light-brown text-white rounded hover:bg-dark-brown transition-colors text-sm"
                  >
                    {copiedIndex === index ? "✓" : "📋"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Neorama */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-germania text-dark-brown mb-4 border-b pb-2">
              Neorama (Location 2) - {neoramaTables.length} Masa
            </h2>
            <div className="space-y-2">
              {neoramaTables.map((item, index) => (
                <div
                  key={index + bahceliTables.length}
                  className="flex items-center justify-between p-3 bg-cream-bg rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <span className="font-merriweather text-dark-brown font-semibold">
                      Masa {item.tableName}:
                    </span>
                    <span className="ml-2 text-sm text-gray-600 break-all">
                      {item.fullUrl}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(item.fullUrl, index + bahceliTables.length)}
                    className="ml-4 px-3 py-1 bg-light-brown text-white rounded hover:bg-dark-brown transition-colors text-sm"
                  >
                    {copiedIndex === index + bahceliTables.length ? "✓" : "📋"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <p className="text-sm text-yellow-800 font-merriweather">
            <strong>Not:</strong> Bu URL'leri QR kod basım servisinize gönderin.
            Her masa için karşısındaki URL'e yönlendiren QR kod oluşturmaları gerekiyor.
          </p>
        </div>
      </div>
    </div>
  );
}
