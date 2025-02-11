import { usePublish } from "@libs/ndk";
import { LoaderIcon } from "@shared/icons";
import { ArrowRightCircleIcon } from "@shared/icons/arrowRightCircle";
import { User } from "@shared/user";
import { useAccount } from "@utils/hooks/useAccount";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function OnboardingScreen() {
	const publish = usePublish();
	const navigate = useNavigate();

	const { status, account } = useAccount();
	const [loading, setLoading] = useState(false);

	const submit = async () => {
		try {
			setLoading(true);

			// publish event
			publish({
				content:
					"Running Lume, fighting for better future, join us here: https://lume.nu",
				kind: 1,
				tags: [],
			});

			// redirect to home
			setTimeout(() => navigate("/", { replace: true }), 1200);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="flex h-full w-full items-center justify-center">
			<div className="mx-auto w-full max-w-md">
				<div className="mb-8 text-center">
					<h1 className="mb-2 text-xl font-semibold text-zinc-100">
						👋 Hello, welcome you to Lume
					</h1>
					<p className="text-sm text-zinc-300">
						You're a part of better future that we're fighting
					</p>
					<p className="text-sm text-zinc-300">
						If Lume gets your attention, please help us spread via button below
					</p>
				</div>
				<div className="w-full border-t border-zinc-800/50 bg-zinc-900 rounded-xl">
					<div className="h-min w-full px-5 py-3">
						{status === "success" && (
							<User
								pubkey={account.pubkey}
								time={Math.floor(Date.now() / 1000)}
							/>
						)}
						<div className="-mt-6 pl-[49px] select-text whitespace-pre-line	break-words text-base text-zinc-100">
							<p>Running Lume, fighting for better future</p>
							<p>
								join us here:{" "}
								<a
									href="https://lume.nu"
									className="text-fuchsia-500 hover:text-fuchsia-600 no-underline font-normal"
									target="_blank"
									rel="noreferrer"
								>
									https://lume.nu
								</a>
							</p>
						</div>
					</div>
				</div>
				<div className="mt-4 w-full flex flex-col gap-2">
					<button
						type="button"
						onClick={() => submit()}
						className="inline-flex h-12 w-full items-center justify-between gap-2 rounded-lg px-6 font-medium text-zinc-100 bg-fuchsia-500 hover:bg-fuchsia-600"
					>
						{loading ? (
							<>
								<span className="w-5" />
								<LoaderIcon className="h-4 w-4 animate-spin text-black dark:text-zinc-100" />
								<span className="w-5" />
							</>
						) : (
							<>
								<span className="w-5" />
								<span>Publish</span>
								<ArrowRightCircleIcon className="w-5 h-5" />
							</>
						)}
					</button>
					<Link
						to="/"
						className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg px-6 text-sm font-medium text-zinc-200"
					>
						Skip for now
					</Link>
				</div>
			</div>
		</div>
	);
}
