import { ListBlock } from '@app/components/list-block';
import { ListItem } from '@app/components/list-item';

type EnableOfflineMapsToggleProps = {
  enabled: boolean;
  onToggle: () => void;
};

export function EnableOfflineMapsToggle({
  enabled,
  onToggle,
}: EnableOfflineMapsToggleProps) {
  return (
    <ListBlock title='Cache Settings'>
      <ListItem
        title='Enable Offline Maps'
        endIcon={
          <input
            type='checkbox'
            checked={enabled}
            onChange={onToggle}
            className='toggle'
            aria-label='Enable Offline Maps'
          />
        }
      />
    </ListBlock>
  );
}
