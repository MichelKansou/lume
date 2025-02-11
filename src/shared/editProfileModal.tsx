import { Dialog, Transition } from "@headlessui/react";
import { usePublish } from "@libs/ndk";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { AvatarUploader } from "@shared/avatarUploader";
import { BannerUploader } from "@shared/bannerUploader";
import {
	CancelIcon,
	CheckCircleIcon,
	LoaderIcon,
	UnverifiedIcon,
} from "@shared/icons";
import { Image } from "@shared/image";
import { DEFAULT_AVATAR } from "@stores/constants";
import { useQueryClient } from "@tanstack/react-query";
import { fetch } from "@tauri-apps/api/http";
import { useAccount } from "@utils/hooks/useAccount";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export function EditProfileModal() {
	const queryClient = useQueryClient();
	const publish = usePublish();

	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [picture, setPicture] = useState(DEFAULT_AVATAR);
	const [banner, setBanner] = useState("");
	const [nip05, setNIP05] = useState({ verified: false, text: "" });

	const { account } = useAccount();
	const {
		register,
		handleSubmit,
		reset,
		setError,
		formState: { isValid, errors },
	} = useForm({
		defaultValues: async () => {
			const res: any = queryClient.getQueryData(["user", account.pubkey]);
			if (res.image) {
				setPicture(res.image);
			}
			if (res.banner) {
				setBanner(res.banner);
			}
			if (res.nip05) {
				setNIP05((prev) => ({ ...prev, text: res.nip05 }));
			}
			return res;
		},
	});

	const closeModal = () => {
		setIsOpen(false);
	};

	const openModal = () => {
		setIsOpen(true);
	};

	const verifyNIP05 = async (data: string) => {
		if (data) {
			const url = data.split("@");
			const username = url[0];
			const service = url[1];
			const verifyURL = `https://${service}/.well-known/nostr.json?name=${username}`;

			const res: any = await fetch(verifyURL, {
				method: "GET",
				timeout: 30,
				headers: {
					"Content-Type": "application/json; charset=utf-8",
				},
			});

			if (!res.ok) return false;
			if (res.data.names[username] === account.pubkey) {
				setNIP05((prev) => ({ ...prev, verified: true }));
				return true;
			} else {
				return false;
			}
		}
	};

	const onSubmit = async (data: any) => {
		// start loading
		setLoading(true);

		let event: NDKEvent;

		const content = {
			...data,
			username: data.name,
			display_name: data.name,
			bio: data.about,
			image: data.picture,
		};

		if (data.nip05) {
			const verify = await verifyNIP05(data.nip05);
			if (verify) {
				event = await publish({
					content: JSON.stringify({ ...content, nip05: data.nip05 }),
					kind: 0,
					tags: [],
				});
			} else {
				setNIP05((prev) => ({ ...prev, verified: false }));
				setError("nip05", {
					type: "manual",
					message: "Can't verify your Lume ID / NIP-05, please check again",
				});
			}
		} else {
			event = await publish({
				content: JSON.stringify(content),
				kind: 0,
				tags: [],
			});
		}

		if (event.id) {
			setTimeout(() => {
				// invalid cache
				queryClient.invalidateQueries(["user", account.pubkey]);
				// reset form
				reset();
				// reset state
				setLoading(false);
				setIsOpen(false);
				setPicture(DEFAULT_AVATAR);
				setBanner(null);
			}, 1200);
		} else {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (!nip05.verified && /\S+@\S+\.\S+/.test(nip05.text)) {
			verifyNIP05(nip05.text);
		}
	}, [nip05.text]);

	return (
		<>
			<button
				type="button"
				onClick={() => openModal()}
				className="inline-flex w-36 h-10 items-center justify-center rounded-md bg-zinc-900 hover:bg-fuchsia-500 text-sm font-medium"
			>
				Edit profile
			</button>
			<Transition appear show={isOpen} as={Fragment}>
				<Dialog as="div" className="relative z-10" onClose={closeModal}>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 z-50 bg-black bg-opacity-30 backdrop-blur-md" />
					</Transition.Child>
					<div className="fixed inset-0 z-50 flex min-h-full items-center justify-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<Dialog.Panel className="relative flex h-min w-full max-w-lg flex-col rounded-lg border-t border-zinc-800/50 bg-zinc-900">
								<div className="h-min w-full shrink-0 border-b border-zinc-800 px-5 py-5">
									<div className="flex items-center justify-between">
										<Dialog.Title
											as="h3"
											className="text-lg font-semibold leading-none text-zinc-100"
										>
											Edit profile
										</Dialog.Title>
										<button
											type="button"
											onClick={closeModal}
											className="inline-flex h-5 w-5 items-center justify-center rounded hover:bg-zinc-900"
										>
											<CancelIcon className="w-5 h-5 text-zinc-300" />
										</button>
									</div>
								</div>
								<div className="flex h-full w-full flex-col overflow-y-auto">
									<form onSubmit={handleSubmit(onSubmit)} className="mb-0">
										<input
											type={"hidden"}
											{...register("picture")}
											value={picture}
											className="relative h-10 w-full rounded-lg border border-black/5 px-3 py-2 shadow-input shadow-black/5 !outline-none placeholder:text-zinc-400 dark:bg-zinc-800 dark:text-zinc-100 dark:shadow-black/10 dark:placeholder:text-zinc-500"
										/>
										<input
											type={"hidden"}
											{...register("banner")}
											value={banner}
											className="relative h-10 w-full rounded-lg border border-black/5 px-3 py-2 shadow-input shadow-black/5 !outline-none placeholder:text-zinc-400 dark:bg-zinc-800 dark:text-zinc-100 dark:shadow-black/10 dark:placeholder:text-zinc-500"
										/>
										<div className="relative">
											<div className="relative w-full h-44 bg-zinc-800">
												<Image
													src={banner}
													fallback="https://void.cat/d/QY1myro5tkHVs2nY7dy74b.jpg"
													alt="user's banner"
													className="h-full w-full object-cover"
												/>
												<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-full h-full">
													<BannerUploader setBanner={setBanner} />
												</div>
											</div>
											<div className="px-4 mb-5">
												<div className="z-10 relative h-14 w-14 -mt-7">
													<Image
														src={picture}
														fallback={DEFAULT_AVATAR}
														alt="user's avatar"
														className="h-14 w-14 object-cover ring-2 ring-zinc-900 rounded-lg"
													/>
													<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-full h-full">
														<AvatarUploader setPicture={setPicture} />
													</div>
												</div>
											</div>
										</div>
										<div className="flex flex-col gap-4 px-4 pb-4">
											<div className="flex flex-col gap-1">
												<label className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
													Name
												</label>
												<input
													type={"text"}
													{...register("name", {
														required: true,
														minLength: 4,
													})}
													spellCheck={false}
													className="relative h-10 w-full rounded-lg px-3 py-2 !outline-none bg-zinc-800 text-zinc-100 placeholder:text-zinc-500"
												/>
											</div>
											<div className="flex flex-col gap-1">
												<label className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
													Lume ID / NIP-05
												</label>
												<div className="relative">
													<input
														{...register("nip05", {
															required: true,
															minLength: 4,
														})}
														spellCheck={false}
														className="relative h-10 w-full rounded-lg px-3 py-2 !outline-none bg-zinc-800 text-zinc-100 placeholder:text-zinc-500"
													/>
													<div className="absolute top-1/2 right-2 transform -translate-y-1/2">
														{nip05.verified ? (
															<span className="inline-flex items-center gap-1 rounded h-6 px-2 bg-green-500 text-sm font-medium">
																<CheckCircleIcon className="w-4 h-4 text-white" />
																Verified
															</span>
														) : (
															<span className="inline-flex items-center gap-1 rounded h-6 px-2 bg-red-500 text-sm font-medium">
																<UnverifiedIcon className="w-4 h-4 text-white" />
																Unverified
															</span>
														)}
													</div>
													{errors.nip05 && (
														<p className="mt-1 text-sm text-red-400">
															{errors.nip05.message.toString()}
														</p>
													)}
												</div>
											</div>
											<div className="flex flex-col gap-1">
												<label className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
													Bio
												</label>
												<textarea
													{...register("about")}
													spellCheck={false}
													className="relative resize-none h-20 w-full rounded-lg px-3 py-2 !outline-none bg-zinc-800 text-zinc-100 placeholder:text-zinc-500"
												/>
											</div>
											<div className="flex flex-col gap-1">
												<label className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
													Website
												</label>
												<input
													type={"text"}
													{...register("website", { required: false })}
													spellCheck={false}
													className="relative h-10 w-full rounded-lg px-3 py-2 !outline-none bg-zinc-800 text-zinc-100 placeholder:text-zinc-500"
												/>
											</div>
											<div>
												<button
													type="submit"
													disabled={!isValid}
													className="inline-flex items-center justify-center gap-1 transform active:translate-y-1 disabled:pointer-events-none disabled:opacity-50 focus:outline-none h-11 w-full bg-fuchsia-500 rounded-md font-medium text-zinc-100 hover:bg-fuchsia-600"
												>
													{loading ? (
														<LoaderIcon className="h-4 w-4 animate-spin text-black dark:text-zinc-100" />
													) : (
														"Update"
													)}
												</button>
											</div>
										</div>
									</form>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</Dialog>
			</Transition>
		</>
	);
}
