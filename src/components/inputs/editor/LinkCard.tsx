import Image from "next/image";
import useGetLinkMeta from "@/lib/hooks/useGetLinkMeta";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { getHostname } from "@/lib/utils/text";
import Button from "@/components/actions/button/Button";
import { CgClose } from "react-icons/cg";
import FrameLinkCard from "./FrameLinkCard";

interface Props {
  link: string;
  onRemoveLinkCard: Dispatch<SetStateAction<string>>;
  onAddLinkCard: Dispatch<SetStateAction<LinkMeta | null>>;
}

export default function LinkCard(props: Props) {
  const { link, onRemoveLinkCard, onAddLinkCard } = props;
  const { status, data, error, isLoading, isFetching } = useGetLinkMeta(link);
  const [showImage, setShowIamge] = useState(true);

  const onErrorImage = useCallback(() => setShowIamge(false), []);

  useEffect(() => {
    if (data) {
      onAddLinkCard(data);
    }
  }, [data, onAddLinkCard]);

  if (isLoading || isFetching) {
    return (
      <article className="border-skin-base relative animate-pulse rounded-2xl border">
        <div className="bg-skin-muted relative h-44 w-full rounded-t-2xl" />
        <div className="flex grow flex-col gap-3 p-3">
          <div className="bg-skin-muted h-5 w-2/5" />
          <div className="bg-skin-muted h-5 w-full" />
        </div>
      </article>
    );
  }

  if (error) {
    return (
      <div className="border-skin-base flex flex-wrap items-center justify-between w-full gap-3 rounded-2xl border p-3">
        <div className="flex flex-col gap-3">
          <span className="text-skin-base w-fit shrink-0">
            Could not get info about this link
          </span>
          <span className="text-skin-link-base line-clamp-1 shrink overflow-ellipsis break-all text-sm">
            {link}
          </span>
        </div>
        <Button
          className="text-skin-icon-inverted bg-skin-overlay hover:bg-skin-inverted hover:text-skin-inverted rounded-full p-1"
          onClick={(e) => {
            e.preventDefault();
            onRemoveLinkCard(link);
          }}
        >
          <CgClose className="text-xl" />
        </Button>
      </div>
    );
  }

  return (
    <>
      {data?.url && data.title && (
        <FrameLinkCard
          url={data.url}
          title={data.title}
          onRemoveLinkCard={() => onRemoveLinkCard(link)}
          defaultCard={
            <article className="bg-skin-base  relative rounded-md ">
              {data?.image && showImage && (
                <div className="relative h-44 w-full">
                  <Image
                    src={data.image}
                    alt="Link image"
                    onError={onErrorImage}
                    fill
                    className="rounded-t-md object-cover"
                  />
                </div>
              )}
            </article>
          }
        />
      )}
    </>
  );
}
