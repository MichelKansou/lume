import NoteReply from '@lume/app/newsfeed/components/metadata/reply';
import ZapIcon from '@lume/shared/icons/zap';
import { RelayContext } from '@lume/shared/relayProvider';
import { READONLY_RELAYS } from '@lume/stores/constants';

import { useContext, useState } from 'react';
import useSWRSubscription from 'swr/subscription';

import NoteLike from '../metadata/like';
import NoteRepost from '../metadata/repost';

export default function NoteMetadata({ id, eventPubkey }: { id: string; eventPubkey: string }) {
  const pool: any = useContext(RelayContext);

  const [replies, setReplies] = useState(0);
  const [likes, setLikes] = useState(0);
  const [reposts, setReposts] = useState(0);

  useSWRSubscription(id ? ['metadata', id] : null, ([, key], {}) => {
    const unsubscribe = pool.subscribe(
      [
        {
          '#e': [key],
          since: 0,
          kinds: [1, 6, 7],
          limit: 20,
        },
      ],
      READONLY_RELAYS,
      (event: any) => {
        switch (event.kind) {
          case 1:
            setReplies(replies + 1);
            break;
          case 6:
            setReposts(reposts + 1);
            break;
          case 7:
            if (event.content === '🤙' || event.content === '+') {
              setLikes(likes + 1);
            }
            break;
          default:
            break;
        }
      }
    );

    return () => {
      unsubscribe();
    };
  });

  return (
    <div className="flex items-center gap-16">
      <NoteReply id={id} replies={replies} />
      <NoteLike id={id} pubkey={eventPubkey} likes={likes} />
      <NoteRepost id={id} pubkey={eventPubkey} reposts={reposts} />
      <button className="inline-flex w-min items-center gap-1.5">
        <ZapIcon width={20} height={20} className="text-zinc-400" />
        <span className="text-sm leading-none text-zinc-400">{0}</span>
      </button>
    </div>
  );
}
