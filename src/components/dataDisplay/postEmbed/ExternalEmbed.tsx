import { getHostname } from "@/lib/utils/text";
import { AppBskyEmbedExternal } from "@atproto/api";
import Image from "next/image";
import Link from "next/link";
import FrameEmbed from "./FrameEmbed";

interface Props {
  embed: AppBskyEmbedExternal.View;
  depth: number;
}
export default function ExternalEmbed(props: Props) {
  const { embed, depth } = props;
  const CardEmbed = () => (
    <>
      {depth < 2 && (
        <div className="hover:brightness-95">
          <Link
            href={embed.external.uri}
            target="blank"
            onClick={(e) => e.stopPropagation()}
          >
            {embed.external.thumb && (
              <div className="relative h-44 w-full">
                <Image
                  src={embed.external.thumb}
                  alt={embed.external.description}
                  className="rounded-t-lg object-cover"
                  fill
                />
              </div>
            )}
          </Link>
        </div>
      )}
    </>
  );

  return (
    <FrameEmbed
      url={embed.external.uri}
      title={embed.external.title}
      defaultCard={<CardEmbed />}
    />
  );
}
