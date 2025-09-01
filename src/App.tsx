import { CheckCircle, Clock, Coffee, MessageSquare, User } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { ButtonCallTypeEnum } from "./types";
import { callHelp, createFeedback } from "./utils/apis";

function App() {
  const { location, tableName } = useParams<{
    location: string;
    tableName: string;
  }>();

  const [activeRequest, setActiveRequest] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  if (!location || !tableName) {
    return <div className="text-red-500">Invalid parameters</div>;
  }
  const handleGameMasterCall = () => {
    setActiveRequest("gamemaster");
    callHelp({
      location: Number(location),
      type: ButtonCallTypeEnum.GAMEMASTERCALL,
      tableName: tableName,
      hour: new Date().toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    });
    setTimeout(() => setActiveRequest(null), 3000);
  };

  const handleServiceCall = () => {
    setActiveRequest("service");
    callHelp({
      location: Number(location),
      type: ButtonCallTypeEnum.ORDERCALL,
      tableName: tableName,
      hour: new Date().toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    });
    setTimeout(() => setActiveRequest(null), 3000);
  };

  const handleFeedbackSubmit = () => {
    if (feedback.trim() && rating > 0) {
      createFeedback({
        location: 2, // this will be dynamic in a real app
        tableName: "1", // this will be dynamic in a real app
        starRating: rating,
        comment: feedback,
      });
      setActiveRequest("feedback");
      setTimeout(() => {
        setActiveRequest(null);
        setShowFeedbackForm(false);
        setFeedback("");
        setRating(0);
      }, 2000);
    }
  };

  const renderStars = () => {
    return [...Array(5)].map((_, index) => (
      <button
        key={index}
        onClick={() => setRating(index + 1)}
        className={`text-2xl transition-colors duration-200 ${
          index < rating ? "text-yellow-400" : "text-gray-300"
        } hover:text-yellow-400`}
      >
        ★
      </button>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Da Vinci Board Game Cafe
            </h1>
          </div>
          <p className="text-xl text-blue-200">
            Masa {tableName} - Hoş Geldiniz!
          </p>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full mb-8">
          {/* Game Master Call */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
            <div className="text-center">
              <div className="bg-green-500/20 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <User className="w-10 h-10 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Oyun Yardımı
              </h3>
              <p className="text-blue-200 mb-6">
                Oyun kuralları için yardım isteyin
              </p>
              <button
                onClick={handleGameMasterCall}
                disabled={activeRequest === "gamemaster"}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                {activeRequest === "gamemaster" ? (
                  <>
                    <Clock className="w-5 h-5 animate-spin" />
                    Çağrılıyor...
                  </>
                ) : (
                  "Game Master Çağır"
                )}
              </button>
            </div>
          </div>

          {/* Service Call */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
            <div className="text-center">
              <div className="bg-orange-500/20 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Coffee className="w-10 h-10 text-orange-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Sipariş</h3>
              <p className="text-blue-200 mb-6">
                Sipariş vermek için servis personeli çağırın
              </p>
              <button
                onClick={handleServiceCall}
                disabled={activeRequest === "service"}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                {activeRequest === "service" ? (
                  <>
                    <Clock className="w-5 h-5 animate-spin" />
                    Çağrılıyor...
                  </>
                ) : (
                  "Sipariş Ver"
                )}
              </button>
            </div>
          </div>

          {/* Feedback */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
            <div className="text-center">
              <div className="bg-blue-500/20 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <MessageSquare className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Geri Bildirim
              </h3>
              <p className="text-blue-200 mb-6">
                Memnun kaldınız mı? Deneyiminizi bizimle paylaşın
              </p>
              <button
                onClick={() => setShowFeedbackForm(true)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200"
              >
                Geri Bildirim Ver
              </button>
            </div>
          </div>
        </div>

        {/* Quick Status */}
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
          <p className="text-center text-blue-200">
            Aktif Oyun Zamanı:{" "}
            {new Date().toLocaleTimeString("tr-TR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedbackForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            {activeRequest === "feedback" ? (
              <div className="text-center">
                <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Teşekkürler!
                </h3>
                <p className="text-gray-600">
                  Geri bildiriminiz başarıyla gönderildi.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  Geri Bildiriminiz
                </h3>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deneyiminizi değerlendirin:
                  </label>
                  <div className="flex justify-center gap-1">
                    {renderStars()}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Yorumunuz:
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={4}
                    placeholder="Deneyiminizi bizimle paylaşın..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowFeedbackForm(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleFeedbackSubmit}
                    disabled={!feedback.trim() || rating === 0}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                  >
                    Gönder
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
