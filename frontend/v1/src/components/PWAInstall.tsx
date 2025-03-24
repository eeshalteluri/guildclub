"use client";

import React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "./ui/card";

interface BeforeInstallPromptEvent extends Event {
  prompt(): void;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const PWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handler = (event: Event) => {
        const e = event as BeforeInstallPromptEvent
      event.preventDefault();
      setDeferredPrompt(e);
      setShowButton(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("PWA Installed");
    }

    setDeferredPrompt(null);
    setShowButton(false);
  };
   
  return (
    <div>
      {showButton && (
        <Card className="fixed top-2 left-1/2 transform -translate-x-1/2 max-w-2xl m-2 p-4 bg-gray-100 rounded flex justify-between items-center gap-4">
        <p>Add app to Home screen</p>
          <Button onClick={handleInstall}>
            Install
          </Button>
        </Card>
        
      )}
    </div>
  );
 };

export default PWAInstall;



