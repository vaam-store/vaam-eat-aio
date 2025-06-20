import { Button } from '@app/components/button';
import { ListBlock } from '@app/components/list-block';
import { ListItem } from '@app/components/list-item';

type DownloadSectionProps = {
  downloadStatus: string;
  progress: number;
  onDownload: () => void;
};

export function DownloadSection({
  downloadStatus,
  progress,
  onDownload,
}: DownloadSectionProps) {
  return (
    <ListBlock title='Download'>
      <ListItem
        title='Download'
        endIcon={<Button onClick={onDownload}>Download</Button>}
      />
      <ListItem
        title='Download Status'
        description={
          typeof downloadStatus === 'string' ? downloadStatus : undefined
        }
      />
      <ListItem
        title='Progress'
        endIcon={
          <progress
            className='progress progress-primary w-56'
            value={progress}
            max='100'
            aria-label='Progress'
          />
        }
      />
    </ListBlock>
  );
}
