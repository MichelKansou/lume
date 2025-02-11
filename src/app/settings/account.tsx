import { EyeOffIcon, EyeOnIcon } from "@shared/icons";
import { useAccount } from "@utils/hooks/useAccount";
import { useState } from "react";

export function AccountSettingsScreen() {
	const { status, account } = useAccount();
	const [type, setType] = useState("password");

	const showPrivateKey = () => {
		if (type === "password") {
			setType("text");
		} else {
			setType("password");
		}
	};

	return (
		<div className="w-full h-full px-3 pt-12">
			<div className="flex flex-col gap-2">
				<h1 className="text-lg font-semibold text-zinc-100">Account</h1>
				<div className="">
					{status === "loading" ? (
						<p>Loading...</p>
					) : (
						<div className="flex flex-col gap-4">
							<div className="flex flex-col gap-1">
								<label className="text-base font-semibold text-zinc-400">
									Public Key
								</label>
								<input
									readOnly
									value={account.pubkey}
									className="relative w-2/3 rounded-lg py-3 pl-3.5 pr-11 !outline-none placeholder:text-zinc-400 bg-zinc-800 text-zinc-100"
								/>
							</div>
							<div className="flex flex-col gap-1">
								<label className="text-base font-semibold text-zinc-400">
									Npub
								</label>
								<input
									readOnly
									value={account.npub}
									className="relative w-2/3 rounded-lg py-3 pl-3.5 pr-11 !outline-none placeholder:text-zinc-400 bg-zinc-800 text-zinc-100"
								/>
							</div>
							<div className="flex flex-col gap-1">
								<label className="text-base font-semibold text-zinc-400">
									Private Key
								</label>
								<div className="relative w-2/3">
									<input
										readOnly
										type={type}
										value={account.privkey}
										className="relative w-full rounded-lg py-3 pl-3.5 pr-11 !outline-none placeholder:text-zinc-400 bg-zinc-800 text-zinc-100"
									/>
									<button
										type="button"
										onClick={() => showPrivateKey()}
										className="group absolute right-2 top-1/2 -translate-y-1/2 transform rounded p-1 hover:bg-zinc-700"
									>
										{type === "password" ? (
											<EyeOffIcon
												width={20}
												height={20}
												className="text-zinc-500 group-hover:text-zinc-100"
											/>
										) : (
											<EyeOnIcon
												width={20}
												height={20}
												className="text-zinc-500 group-hover:text-zinc-100"
											/>
										)}
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
