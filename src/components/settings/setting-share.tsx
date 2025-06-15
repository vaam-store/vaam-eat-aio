"use client";

import { Share2 } from "react-feather";
import { showErrorToast } from "@app/services/error-handler";
import { ListItem } from "../list-item/list-item";

export function SettingShare() {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Vaam Eat AIO",
          text: "Check out Vaam Eat AIO for amazing food!",
          url: window.location.href,
        });
        console.log("Content shared successfully");
      } catch (error) {
        showErrorToast(error, "Could not share");
      }
    } else {
      showErrorToast(
        null,
        "Web Share API is not supported in your browser. You can manually share this page: " +
          window.location.href,
      );
    }
  };

  return (
    <ListItem
      title="Share"
      description="Share this app with your friends"
      icon={<Share2 />}
      href="#"
      onClick={handleShare}
    />
  );
}
