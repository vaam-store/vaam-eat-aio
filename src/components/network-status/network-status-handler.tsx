"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Wifi, WifiOff } from "react-feather";
import {
  ErrorCategory,
  ErrorSeverity,
  showErrorToast,
} from "@app/services/error-handler";

export function NetworkStatusHandler() {
  const [isOnline, setIsOnline] = useState(true); // Assume online by default

  useEffect(() => {
    // Set initial status
    if (
      typeof window !== "undefined" &&
      typeof window.navigator !== "undefined"
    ) {
      setIsOnline(window.navigator.onLine);
    }

    const handleOnline = () => {
      setIsOnline(true);
      toast.success("You are back online!", {
        icon: <Wifi size={20} className="text-success" />,
        duration: 4000,
        id: "network-status-online",
      });
      // Dismiss any persistent offline notifications
      toast.dismiss("network-status-offline");
    };

    const handleOffline = () => {
      setIsOnline(false);
      // Using showErrorToast for a more persistent and styled notification
      showErrorToast(
        new Error(
          "You are currently offline. Please check your internet connection.",
        ),
        "You are currently offline. Some features may not be available.",
        {
          severity: ErrorSeverity.Warning, // Or Critical, depending on app needs
          category: ErrorCategory.Network,
        },
      );
      // Ensure the toast ID is consistent for potential manual dismissal or updates
      // The showErrorToast already uses the message as ID, but we can be explicit if needed
      // For a very persistent offline message, consider using toast options like duration: Infinity
      // and providing a manual dismiss button within the toast or a general "dismiss all" action.
      // For now, showErrorToast's default duration or a longer one for Critical/Warning will be used.
      // Let's use a specific ID to manage it better.
      toast.error(
        "You are currently offline. Please check your internet connection. Some features may be unavailable.",
        {
          icon: <WifiOff size={20} className="text-error" />,
          duration: Infinity, // Keep it until back online or manually dismissed
          id: "network-status-offline",
        },
      );
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      toast.dismiss("network-status-online");
      toast.dismiss("network-status-offline");
    };
  }, []);

  // This component doesn't render anything itself, it just handles global events
  return null;
}
