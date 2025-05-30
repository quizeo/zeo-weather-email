import { useEffect, useState, type FormEvent } from "react";
import axios from "axios";
import SendHistory from "./component/SendHistory";

interface WeatherLog {
  _id: string;
  city: string;
  email: string;
  dateSent: string;
  weather: string;
}

const App = () => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<WeatherLog[]>([]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const city = formData.get("city") as string;
    const email = formData.get("email") as string;

    if (!city || !email) {
      setMessage("City and email are required.");
      return;
    }

    try {
      setIsLoading(true);
      setMessage("");

      const response = await axios.post(
        `https://server-weather-workflow.onrender.com/api/weather`,
        {
          city,
          email,
        }
      );
      setMessage(response.data.message || "Weather sent!");

      // Reset form
      form.reset();

      await fetchLogs();
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await axios.get(
        `https://server-weather-workflow.onrender.com/api/weather/logs`
      );
      setLogs(res.data);
    } catch (err) {
      console.error("Error fetching logs", err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const deleteLog = async (id: string) => {
    console.log(`Deleting log with ID: ${id}`);
    try {
      await axios.delete(
        `https://server-weather-workflow.onrender.com/api/weather/delete/${id}`
      );
      setLogs((prevLogs) => prevLogs.filter((log) => log._id !== id));
      setMessage("Log deleted successfully.");
    } catch (error) {
      console.error("Error deleting log", error);
      setMessage("Failed to delete log.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 to-indigo-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                />
              </svg>
              Zeo Weather Email
            </h2>
          </div>

          {/* Form Section */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700"
                >
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  name="city"
                  placeholder="Enter city name..."
                  disabled={isLoading}
                  required
                  className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-75"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter email address..."
                  disabled={isLoading}
                  required
                  className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-75"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white font-medium 
                  ${
                    isLoading
                      ? "bg-blue-400"
                      : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  }`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  "Send Weather Email"
                )}
              </button>

              {message && (
                <div
                  className={`mt-4 p-4 rounded-md ${
                    message.includes("error") || message.includes("wrong")
                      ? "bg-red-50 text-red-700"
                      : "bg-green-50 text-green-700"
                  }`}
                >
                  {message}
                </div>
              )}

              {isLoading && (
                <div className="mt-2 text-sm text-gray-500 flex items-center justify-center">
                  <svg
                    className="animate-pulse mr-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Processing your request...
                </div>
              )}
            </form>
          </div>

          {/* History Section */}
          <div className="border-t border-gray-200">
            <SendHistory logs={logs} deleteLog={deleteLog} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
