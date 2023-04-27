import { DEFAULT_AVATAR } from '@lume/stores/constants';
import { useProfile } from '@lume/utils/hooks/useProfile';
import { shortenKey } from '@lume/utils/shortenKey';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const MessageUser = ({ pubkey, time }: { pubkey: string; time: number }) => {
  const profile = useProfile(pubkey);

  return (
    <div className="group flex items-start gap-3">
      <div className="relative h-9 w-9 shrink rounded-md">
        <img
          src={profile?.picture || DEFAULT_AVATAR}
          alt={pubkey}
          className="h-9 w-9 rounded-md object-cover"
          loading="lazy"
          fetchpriority="high"
        />
      </div>
      <div className="flex w-full flex-1 items-start justify-between">
        <div className="flex items-baseline gap-2 text-sm">
          <span className="font-semibold leading-none text-zinc-200 group-hover:underline">
            {profile?.display_name || profile?.name || shortenKey(pubkey)}
          </span>
          <span className="leading-none text-zinc-500">·</span>
          <span className="leading-none text-zinc-500">{dayjs().to(dayjs.unix(time))}</span>
        </div>
      </div>
    </div>
  );
};
