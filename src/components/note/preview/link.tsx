import Image from 'next/image';
import Link from 'next/link';

export default function LinkCard({ data }: { data: any }) {
  return (
    <Link
      href={data['url']}
      target={'_blank'}
      className="relative flex flex-col overflow-hidden rounded-lg border border-zinc-700"
    >
      <div className="relative aspect-video h-auto w-full">
        <Image src={data['image']} alt="image preview" fill={true} className="object-cover" />
      </div>
      <div className="flex flex-col gap-2 p-4">
        <div>
          <h5 className="font-semibold leading-tight">{data['title']}</h5>
          <p className="text-sm text-zinc-300">{data['description']}</p>
        </div>
        <span className="text-sm text-zinc-500">{data['url']}</span>
      </div>
    </Link>
  );
}
