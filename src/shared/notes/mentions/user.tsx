import { useProfile } from "@utils/hooks/useProfile";
import { shortenKey } from "@utils/shortenKey";
import { Link } from "react-router-dom";

export function MentionUser({ pubkey }: { pubkey: string }) {
	const { user } = useProfile(pubkey);

	return (
		<Link
			to={`/app/user/${pubkey}`}
			className="text-fuchsia-500 hover:text-fuchsia-600 no-underline font-normal"
		>
			@{user?.name || user?.displayName || shortenKey(pubkey)}
		</Link>
	);
}
