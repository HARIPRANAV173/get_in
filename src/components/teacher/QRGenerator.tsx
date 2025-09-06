import React, { useState, useEffect, useRef } from "react";
import { QrCode, Download, Clock, Eye } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useAttendance } from "../../contexts/AttendanceContext";
import { QRCodeCanvas } from "qrcode.react";

const QRGenerator: React.FC = () => {
  const { attendanceRecords } = useAttendance();
  const [selectedSubject, setSelectedSubject] = useState("Data Structures");
  const [qrCodeValue, setQrCodeValue] = useState("");
  const [validityDuration, setValidityDuration] = useState(1); // in minutes
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const qrCodeRef = useRef<HTMLDivElement>(null);

  const subjects = [
    "Data Structures",
    "Database Management",
    "Web Development",
    "Computer Networks",
    "Operating Systems",
  ];

   
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((time) => time - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isActive) {
      setIsActive(false);
      setQrCodeValue(""); // Invalidate QR code
    }
    return () => clearInterval(interval);
  }, [isActive, timeRemaining]);

  // Generate a random short code
  const generateShortCode = (length = 8) => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const generateQRCode = () => {
  const shortCode = generateShortCode(8);
  setQrCodeValue(shortCode);
  setTimeRemaining(validityDuration * 60);
  setIsActive(true);
  const generateQRCode = async () => {
  const shortCode = generateShortCode(8);

  try {
    // Send QR info to backend
    const response = await fetch("http://127.0.0.1:5000/api/generate_qr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: selectedSubject,
        code: shortCode,
        expiry: Date.now() + validityDuration * 60 * 1000, // expiry in ms
      }),
    });

    const result = await response.json();
    if (result.success) {
      setQrCodeValue(shortCode);
      setTimeRemaining(validityDuration * 60);
      setIsActive(true);
    } else {
      alert("Error saving QR to backend.");
    }
  } catch (error) {
    console.error("Error generating QR:", error);
    alert("Error connecting to backend.");
  }
};

  };
  

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const downloadQR = () => {
    const canvas = qrCodeRef.current?.querySelector("canvas");
    if (canvas) {
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `${selectedSubject}-QR.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    }
  };

  const liveAttendance = attendanceRecords.filter(
    (record) =>
      record.markedBy === "QR Scan" && record.subject === selectedSubject
  );

  return (
    <div className="space-y-6">
      {/* QR Generator Controls */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          QR Code Generator
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="subject-select"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Select Subject
              </label>
              <select
                id="subject-select"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <button
                onClick={generateQRCode}
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <QrCode className="h-5 w-5 mr-2" />
                Generate New QR Code
              </button>

              {qrCodeValue && (
                <button
                  onClick={downloadQR}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download QR Code
                </button>
              )}
            </div>

            {/* Timer */}
            {isActive && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-green-800 font-medium">
                      QR Code Active
                    </span>
                  </div>
                  <div className="text-green-600 font-bold text-lg">
                    {formatTime(timeRemaining)}
                  </div>
                </div>
                <div className="mt-2 bg-green-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-1000"
                    style={{
                      width: `${
                        (timeRemaining / (validityDuration * 60)) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* QR Code Display */}
          <div className="flex items-center justify-center">
            <div className="bg-gray-100 p-8 rounded-xl" ref={qrCodeRef}>
              {qrCodeValue ? (
                <div className="text-center">
                  {/* Real QR Code */}
                  <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
                    <QRCodeCanvas value={qrCodeValue} size={192} />
                  </div>
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {isActive ? "Active" : "Expired"}
                  </div>
                  {/* Raw QR code string for manual entry */}
                  <div className="mt-6 text-left">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Short Code (for manual entry):</label>
                    <div className="flex items-center bg-gray-50 border rounded-lg p-2">
                      <input
                        type="text"
                        value={qrCodeValue}
                        readOnly
                        className="flex-1 bg-transparent border-none text-xs text-gray-800 px-2 py-1"
                        style={{ overflowWrap: 'anywhere' }}
                        onClick={e => (e.target as HTMLInputElement).select()}
                      />
                      <button
                        type="button"
                        className="ml-2 px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
                        onClick={() => navigator.clipboard.writeText(qrCodeValue)}
                      >Copy</button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Students without a camera can copy this code and paste it in their dashboard to mark attendance.</p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 p-12">
                  <QrCode className="h-16 w-16 mx-auto mb-4" />
                  <p>Click "Generate New QR Code" to create a QR code</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Live Attendance */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Eye className="h-5 w-5 text-green-600 mr-2" />
            <h4 className="text-lg font-semibold text-gray-900">
              Live Attendance
            </h4>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Real-time updates</span>
          </div>
        </div>

        {liveAttendance.length > 0 ? (
          <div className="space-y-3">
            {liveAttendance.map((record) => (
              <div
                key={(record.studentId || "") + (record.time || "")}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium">
                      {(record.name || record.studentId || "?")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-gray-900">
                      {record.name || record.studentId}
                    </p>
                    <p className="text-sm text-gray-600">{record.subject}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      record.status === "present"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {record.status}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">{record.time}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No live attendance data yet</p>
            <p className="text-sm">
              Students will appear here as they scan the QR code
            </p>
          </div>
        )}
      </div>

      {/* QR Settings */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          QR Code Settings
        </h4>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="validity-select"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Validity Duration (minutes)
            </label>
            <select
              id="validity-select"
              value={validityDuration}
              onChange={(e) => setValidityDuration(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="1">1 minute</option>
              <option value="5">5 minutes</option>
              <option value="10">10 minutes</option>
              <option value="15">15 minutes</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Late Arrival Grace Period
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
              <option value="5">5 minutes</option>
              <option value="10">10 minutes</option>
              <option value="15">15 minutes</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="autoExpire"
              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              defaultChecked
            />
            <label htmlFor="autoExpire" className="ml-2 text-sm text-gray-700">
              Automatically expire QR code after class time
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;
