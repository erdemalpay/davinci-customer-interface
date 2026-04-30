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
      ...urls.map(item => [item.locationName, item.tableName, item.fullUrl].join(","))
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
    <div className="min-h-screen p-6" style={{ backgroundColor: "#F7F3ED" }}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-body font-bold text-davinci-black mb-8 text-center">
          QR Kod Listesi
        </h1>

        {/* Base URL Input */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6" style={{ border: "1px solid rgba(31,41,55,0.1)" }}>
          <label className="block text-lg font-body font-semibold text-davinci-black mb-2">
            Base URL:
          </label>
          <input
            type="text"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            className="w-full px-4 py-2 border border-davinci-gray-300 rounded-lg focus:outline-none focus:border-davinci-red font-body"
            placeholder="https://kafe.davinciboardgame.com"
          />
        </div>

        {/* Export Buttons */}
        <div className="flex gap-4 mb-8 justify-center flex-wrap">
          {[
            { label: "CSV İndir", handler: handleExportCSV },
            { label: "TXT İndir", handler: handleExportText },
            {
              label: "Tümünü Kopyala",
              handler: () => {
                navigator.clipboard.writeText(urls.map(u => u.fullUrl).join("\n"));
                alert("Tüm URL'ler kopyalandı!");
              }
            },
          ].map((btn) => (
            <button
              key={btn.label}
              onClick={btn.handler}
              className="px-6 py-3 text-white rounded-full font-body font-semibold transition-all duration-200 hover:brightness-90"
              style={{ background: "var(--red, #A80000)", boxShadow: "0 4px 20px rgba(168,0,0,0.25)" }}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Tables Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[
            { title: `Bahçeli (Location 1) — ${bahceliTables.length} Masa`, tables: bahceliTables, offset: 0 },
            { title: `Neorama (Location 2) — ${neoramaTables.length} Masa`, tables: neoramaTables, offset: bahceliTables.length },
          ].map(({ title, tables, offset }) => (
            <div key={title} className="bg-white rounded-xl shadow-md p-6" style={{ border: "1px solid rgba(31,41,55,0.1)" }}>
              <h2 className="text-2xl font-body font-bold text-davinci-black mb-4 border-b border-davinci-gray-200 pb-2">
                {title}
              </h2>
              <div className="space-y-2">
                {tables.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg transition-colors"
                    style={{ backgroundColor: "#F7F3ED" }}
                  >
                    <div className="flex-1">
                      <span className="font-body font-semibold text-davinci-black">
                        Masa {item.tableName}:
                      </span>
                      <span className="ml-2 text-sm text-davinci-gray-600 break-all">
                        {item.fullUrl}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(item.fullUrl, index + offset)}
                      className="ml-4 px-3 py-1 text-white rounded-full text-sm font-body transition-all duration-200 hover:brightness-90"
                      style={{ background: "var(--red, #A80000)" }}
                    >
                      {copiedIndex === index + offset ? "✓" : "Kopyala"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-8 rounded-xl p-4" style={{ backgroundColor: "rgba(168,0,0,0.05)", border: "1px solid rgba(168,0,0,0.15)" }}>
          <p className="text-sm text-davinci-black/70 font-body">
            <strong>Not:</strong> Bu URL'leri QR kod basım servisinize gönderin.
            Her masa için karşısındaki URL'e yönlendiren QR kod oluşturmaları gerekiyor.
          </p>
        </div>
      </div>
    </div>
  );
}
