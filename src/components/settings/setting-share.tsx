'use client';

import { ListItem } from '@app/components/list-item';
import { showErrorToast } from '@app/utils/error-handler';
import { Share2 } from 'react-feather';

export function SettingShare() {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Vaam Eat AIO',
          text: 'Check out Vaam Eat AIO for amazing food!',
          url: window.location.href,
        });
      } catch (error) {
        showErrorToast(error, 'Could not share');
      }
    } else {
      showErrorToast(null, 'Web Share API is not supported in your browser');
    }
  };

  return (
    <ListItem
      as='button'
      type='button'
      title='Share'
      description='Share this app with your friends'
      icon={<Share2 />}
      onClick={handleShare}
    />
  );
}
