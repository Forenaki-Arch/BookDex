"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, CameraOff, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface BarcodeScannerProps {
  onScan: (isbn: string) => void;
  onClose?: () => void;
}

// Scanner ISBN tramite fotocamera: usa @zxing/library e richiede HTTPS
export function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Pulizia risorse: fondamentale per non tenere la camera accesa
  const cleanup = useCallback(() => {
    readerRef.current?.reset();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    readerRef.current = null;
    setIsScanning(false);
  }, []);

  // Avvia la camera e la scansione continua
  const startScanning = useCallback(async () => {
    setError(null);
    setSuccess(false);

    try {
      // Preferiamo la fotocamera posteriore su mobile
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });

      streamRef.current = stream;

      if (!videoRef.current) return;
      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      // Inizializza zxing e decodifica in continuo
      const reader = new BrowserMultiFormatReader();
      readerRef.current = reader;
      setIsScanning(true);

      reader.decodeFromVideoElement(videoRef.current, (result, err) => {
        if (result) {
          const code = result.getText();
          const clean = code.replace(/[-\s]/g, "");
          // Validazione ISBN: 10 o 13 cifre (eventualmente EAN-13 iniziante 978/979)
          if (/^(97(8|9))?\d{9}(\d|X)$/i.test(clean)) {
            setSuccess(true);
            cleanup();
            // Piccolo delay per mostrare l'animazione di successo
            setTimeout(() => onScan(clean), 600);
          }
        }
        // NotFoundException è normale: significa "nessun codice visibile"
        if (err && !(err instanceof NotFoundException)) {
          console.error("Errore decodifica:", err);
        }
      });
    } catch (err: unknown) {
      const e = err as DOMException;
      let message = "Impossibile accedere alla fotocamera.";
      if (e.name === "NotAllowedError") {
        message = "Permesso fotocamera negato. Abilitalo dalle impostazioni del browser.";
      } else if (e.name === "NotFoundError") {
        message = "Nessuna fotocamera trovata su questo dispositivo.";
      } else if (e.name === "NotReadableError") {
        message = "La fotocamera è già in uso da un'altra applicazione.";
      } else if (e.name === "SecurityError") {
        message = "Accesso alla fotocamera bloccato. Richiede HTTPS.";
      }
      setError(message);
      toast.error("Errore Scanner", { description: message });
    }
  }, [cleanup, onScan]);

  // Start all'apertura del componente, cleanup all'unmount
  useEffect(() => {
    startScanning();
    return cleanup;
  }, [startScanning, cleanup]);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden rounded-2xl min-h-[420px]">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        muted
      />

      <div className="absolute inset-0 bg-black/40" />

      {isScanning && !success && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-4/5 max-w-sm aspect-[3/2] rounded-xl">
            {/* Angoli decorativi animati */}
            {[
              "top-0 left-0 border-l-4 border-t-4 rounded-tl-xl",
              "top-0 right-0 border-r-4 border-t-4 rounded-tr-xl",
              "bottom-0 left-0 border-l-4 border-b-4 rounded-bl-xl",
              "bottom-0 right-0 border-r-4 border-b-4 rounded-br-xl",
            ].map((cls, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 1.3 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08 }}
                className={`absolute w-10 h-10 border-primary ${cls}`}
              />
            ))}
            {/* Linea di scansione */}
            <motion.div
              className="absolute inset-x-0 h-0.5 bg-primary shadow-[0_0_16px_hsl(var(--primary))]"
              initial={{ top: "10%" }}
              animate={{ top: ["10%", "90%", "10%"] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
      )}

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-green-500/20 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 12, stiffness: 200 }}
              className="rounded-full bg-green-500 p-6 shadow-2xl"
            >
              <CheckCircle2 className="w-16 h-16 text-white" strokeWidth={2.5} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white gap-3 bg-black/80">
          <CameraOff className="w-12 h-12 text-destructive" />
          <p className="text-sm max-w-xs">{error}</p>
          <Button variant="secondary" onClick={startScanning}>
            <Camera className="w-4 h-4 mr-2" /> Riprova
          </Button>
        </div>
      )}

      <div className="absolute top-0 inset-x-0 safe-top p-4 flex justify-between items-start z-10">
        <div className="bg-black/60 backdrop-blur-md text-white text-xs px-3 py-2 rounded-full">
          Inquadra il codice a barre ISBN
        </div>
        {onClose && (
          <Button
            size="icon"
            variant="secondary"
            onClick={() => {
              cleanup();
              onClose();
            }}
            className="rounded-full"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
