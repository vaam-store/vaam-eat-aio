'use client';

import Link from "next/link";
import { Share2 } from 'react-feather';
import { SettingCard } from "./setting-card";
import { showErrorToast } from "@app/services/error-handler";

export function ShareSection() {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Vaam Eat AIO',
          text: 'Check out Vaam Eat AIO for amazing food!',
          url: window.location.href,
        });
        console.log('Content shared successfully');
      } catch (error) {
        showErrorToast(error, 'Could not share');
      }
    } else {
      showErrorToast(null, 'Web Share API is not supported in your browser. You can manually share this page: ' + window.location.href);
    }
  };

  return (
    <SettingCard title="Share">
      <Link href="#" onClick={handleShare} className="btn btn-accent">
        <Share2 size={16} /> Share This App
      </Link>
    </SettingCard>
  );
}