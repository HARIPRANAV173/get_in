import React, { useState, useRef, useEffect } from 'react';
import { QrCode, Camera, CheckCircle, AlertCircle } from 'lucide-react';
import { useAttendance } from '../../contexts/AttendanceContext';
import { useAuth } from '../../contexts/AuthContext';

// Type definitions for the experimental BarcodeDetector API
interface BarcodeDetectorOptions {
  formats: string[];
}
interface DetectedBarcode {
  rawValue: string;
}
interface BarcodeDetector {
  detect(image: ImageBitmapSource): Promise<DetectedBarcode[]>;
}
declare global {
  interface Window {
    BarcodeDetector: {
      new(options?: BarcodeDetectorOptions): BarcodeDetector;
    };
  }
}

interface ScannedData {
  subject: string;
  classId: string;
  timestamp: number;
}

const QRScanner: React.FC = () => {
  const { user } = useAuth();
  const { markAttendance } = useAttendance();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [manualInput, setManualInput] = useState("");
  type CameraConfig = { facingMode: string };
  type Html5QrcodeConfig = { fps: number; qrbox: number };
  type Html5QrcodeType = {
    start: (
      cameraConfig: CameraConfig,
      config: Html5QrcodeConfig,
      onSuccess: (decodedText: string) => void,
      onError: (errorMessage: string) => void
    ) => void;
    stop: () => Promise<void>;
    clear?: () => Promise<void>;
  };
  const html5QrcodeRef = useRef<Html5QrcodeType | null>(null);

  const stopScan = async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (html5QrcodeRef.current) {
      try {
        await html5QrcodeRef.current.stop();
        if (html5QrcodeRef.current.clear) await html5QrcodeRef.current.clear();
      } catch {
        // ignore cleanup errors
      }
      html5QrcodeRef.current = null;
      const regionElem = document.getElementById("html5qr-code-full-region");
      if (regionElem) regionElem.style.display = "none";
    }
    setIsScanning(false);
  };

  const startScan = async () => {
    setIsScanning(true);
    setScanResult(null);
    setLoading(true);

    if (!window.BarcodeDetector) {
      // Fallback to html5-qrcode
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        const qrRegionId = "html5qr-code-full-region";
        const regionElem = document.getElementById(qrRegionId);
        if (regionElem) regionElem.style.display = "block";
       html5QrcodeRef.current = new Html5Qrcode(qrRegionId) as unknown as Html5QrcodeType;
        html5QrcodeRef.current.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: 250,
          },
          (decodedText: string) => {
            setLoading(false);
            handleScan(decodedText);
            stopScan();
          },
          (errorMessage: string) => {
            setLoading(false);
            setScanResult({ success: false, message: `Camera error: ${errorMessage}` });
            stopScan();
          }
        );
      } catch {
        setLoading(false);
        setScanResult({
          success: false,
          message: "Camera access failed or QR code scanning is not supported by this browser. You can enter the QR code manually below."
        });
        setIsScanning(false);
      }
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      const barcodeDetector = new window.BarcodeDetector({
        formats: ["qr_code"],
      });

      intervalRef.current = setInterval(async () => {
        if (!videoRef.current || videoRef.current.paused || !streamRef.current?.active) return;
        try {
          // Use canvas to grab a frame for barcode detection
          const canvas = document.createElement('canvas');
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            // BarcodeDetector expects an ImageBitmapSource (Canvas is valid)
            const barcodes = await barcodeDetector.detect(canvas);
            if (barcodes.length > 0) {
              handleScan(barcodes[0].rawValue);
              stopScan();
            }
          }
        } catch {
          // Detection error can be ignored
        }
      }, 200);
    } catch {
      setScanResult({ success: false, message: "Camera access denied. Please enable camera permissions in your browser settings." });
      setIsScanning(false);
    } finally {
      setLoading(false);
    }
  };

  const handleScan = async (data: string) => {
  try {
    const parsedData: ScannedData = JSON.parse(data);
    if (parsedData.subject && parsedData.classId && parsedData.timestamp) {
      const now = Date.now();
      if (now - parsedData.timestamp > 60000) { // 60s validity
        setScanResult({ success: false, message: "QR code has expired." });
        return;
      }

      // 🔹 Send to Flask backend
      const res = await fetch("http://127.0.0.1:5000/mark_attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: user?.id || "STU001",
          name: user?.name || "Unknown",
          subject: parsedData.subject,
          classId: parsedData.classId,
          status: "present",
        }),
      });

      const result = await res.json();
      if (res.ok) {
        setScanResult({ success: true, message: `Attendance marked for ${parsedData.subject}.` });
      } else {
        setScanResult({ success: false, message: result.error || "Failed to mark attendance." });
      }
      return;
    }
  } catch {
    // 🔹 Fallback: manual/short code
    if (/^[a-z0-9]{8}$/i.test(data.trim())) {
      const res = await fetch("http://127.0.0.1:5000/mark_attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: user?.id || "STU001",
          name: user?.name || "Unknown",
          subject: "Manual Entry",
          classId: "N/A",
          status: "present",
        }),
      });

      const result = await res.json();
      if (res.ok) {
        setScanResult({ success: true, message: `Attendance marked using short code.` });
      } else {
        setScanResult({ success: false, message: result.error || "Failed to mark attendance." });
      }
    } else {
      setScanResult({ success: false, message: "Invalid QR code or short code format." });
    }
  }
};


  useEffect(() => {
    return () => {
      stopScan(); // Cleanup on component unmount
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">QR Code Scanner</h3>
        <div className="max-w-md mx-auto">
          <div className="relative bg-gray-100 rounded-xl p-4 mb-6">
            {/* BarcodeDetector video */}
            <video
              ref={videoRef}
              className={`w-full aspect-square rounded-lg ${!isScanning ? 'hidden' : ''}`}
              style={{ transform: "scaleX(-1)" }}
              playsInline
            ></video>
            {/* html5-qrcode region: always render, control visibility via JS */}
            <div id="html5qr-code-full-region" style={{ width: "100%", display: "none" }}></div>
            {!isScanning && (
              <div className="aspect-square bg-white rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                <div className="text-center">
                  <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Camera is off</p>
                </div>
              </div>
            )}
          </div>
          <div className="space-y-4">
            {!isScanning ? (
              <button
                onClick={startScan}
                className="w-full flex items-center justify-center px-6 py-3 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                <Camera className="h-5 w-5 mr-2" />
                Start Camera Scan
              </button>
            ) : (
              <button
                onClick={stopScan}
                className="w-full flex items-center justify-center px-6 py-3 rounded-lg font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors"
              >
                <Camera className="h-5 w-5 mr-2" />
                Stop Camera Scan
              </button>
            )}
            {loading && (
              <div className="w-full text-center py-2 text-blue-600 font-semibold">Initializing camera, please wait...</div>
            )}
          </div>
          {/* Manual QR code input fallback */}
          {!isScanning && (
            <div className="mt-6">
              <label className="block text-gray-700 mb-2">Enter QR code manually:</label>
              <input
                type="text"
                value={manualInput}
                onChange={e => setManualInput(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg mb-2"
                placeholder="Paste QR code data here"
              />
              <button
                onClick={() => handleScan(manualInput)}
                className="w-full px-4 py-2 rounded-lg bg-green-600 text-white font-semibold"
              >Submit</button>
            </div>
          )}
          {scanResult && (
            <div className={`mt-6 p-4 rounded-lg flex items-center ${scanResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {scanResult.success ? <CheckCircle className="h-5 w-5 mr-3" /> : <AlertCircle className="h-5 w-5 mr-3" />}
              {scanResult.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRScanner;