import { Image } from "@shared/image";
import { DEFAULT_AVATAR } from "@stores/constants";
import { useProfile } from "@utils/hooks/useProfile";
import { shortenKey } from "@utils/shortenKey";

export function User({
	pubkey,
	fallback,
}: { pubkey: string; fallback?: string }) {
	const { status, user } = useProfile(pubkey, fallback);

	if (status === "loading") {
		return (
			<div className="flex items-center gap-2">
				<div className="relative h-10 w-10 shrink-0 rounded-md bg-zinc-800 animate-pulse" />
				<div className="flex w-full flex-1 flex-col items-start gap-1 text-start">
					<span className="w-1/2 h-4 rounded bg-zinc-800 animate-pulse" />
					<span className="w-1/3 h-3 rounded bg-zinc-800 animate-pulse" />
				</div>
			</div>
		);
	}

	return (
		<div className="flex items-center gap-2">
			<div className="relative h-10 w-10 shrink rounded-md">
				<Image
					src={user.picture || user.image}
					fallback={DEFAULT_AVATAR}
					alt={pubkey}
					className="h-10 w-10 rounded-md object-cover"
				/>
			</div>
			<div className="flex w-full flex-1 flex-col items-start text-start">
				<span className="truncate font-medium leading-tight text-zinc-100">
					{user.name || user.displayName || user.display_name}
				</span>
				<span className="text-base leading-tight text-zinc-400">
					{user.nip05?.toLowerCase() || shortenKey(pubkey)}
				</span>
			</div>
		</div>
	);
}
