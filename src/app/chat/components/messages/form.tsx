import { ImagePicker } from "@shared/form/imagePicker";
import { RelayContext } from "@shared/relayProvider";

import { chatContentAtom } from "@stores/chat";
import { WRITEONLY_RELAYS } from "@stores/constants";

import { dateToUnix } from "@utils/date";
import { useActiveAccount } from "@utils/hooks/useActiveAccount";

import { useAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { getEventHash, getSignature, nip04 } from "nostr-tools";
import { useCallback, useContext } from "react";

export default function ChatMessageForm({
	receiverPubkey,
}: { receiverPubkey: string }) {
	const pool: any = useContext(RelayContext);
	const { account, isLoading, isError } = useActiveAccount();

	const [value, setValue] = useAtom(chatContentAtom);
	const resetValue = useResetAtom(chatContentAtom);

	const encryptMessage = useCallback(
		async (privkey: string) => {
			return await nip04.encrypt(privkey, receiverPubkey, value);
		},
		[receiverPubkey, value],
	);

	const submitEvent = () => {
		if (!isError && !isLoading && account) {
			encryptMessage(account.privkey)
				.then((encryptedContent) => {
					const event: any = {
						content: encryptedContent,
						created_at: dateToUnix(),
						kind: 4,
						pubkey: account.pubkey,
						tags: [["p", receiverPubkey]],
					};
					event.id = getEventHash(event);
					event.sig = getSignature(event, account.privkey);
					// publish note
					pool.publish(event, WRITEONLY_RELAYS);
					// reset state
					resetValue();
				})
				.catch(console.error);
		}
	};

	const handleEnterPress = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			submitEvent();
		}
	};

	return (
		<div className="relative h-24 w-full shrink-0 overflow-hidden before:pointer-events-none before:absolute before:-inset-1 before:rounded-[11px] before:border before:border-fuchsia-500 before:opacity-0 before:ring-2 before:ring-fuchsia-500/20 before:transition after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-white/5 after:transition focus-within:before:opacity-100 focus-within:after:shadow-fuchsia-500/100 dark:focus-within:after:shadow-fuchsia-500/20">
			<div>
				<textarea
					value={value}
					onChange={(e) => setValue(e.target.value)}
					onKeyDown={handleEnterPress}
					spellCheck={false}
					placeholder="Message"
					className="relative h-24 w-full resize-none rounded-lg border border-black/5 px-3.5 py-3 text-base shadow-input shadow-black/5 !outline-none placeholder:text-zinc-400 dark:bg-zinc-800 dark:text-white dark:shadow-black/10 dark:placeholder:text-zinc-500"
				/>
			</div>
			<div className="absolute bottom-2 w-full px-2">
				<div className="flex w-full items-center justify-between bg-zinc-800">
					<div className="flex items-center gap-2 divide-x divide-zinc-700">
						<ImagePicker type="chat" />
						<div className="flex items-center gap-2 pl-2" />
					</div>
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={() => submitEvent()}
							disabled={value.length === 0 ? true : false}
							className="inline-flex h-8 w-16 items-center justify-center rounded-md bg-fuchsia-500 px-4 text-base font-medium shadow-button hover:bg-fuchsia-600 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
						>
							Send
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
