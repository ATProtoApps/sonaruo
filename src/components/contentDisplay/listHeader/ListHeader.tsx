"use client";

import Image from "next/image";
import Link from "next/link";
import FallbackList from "@/assets/images/fallbackList.png";
import ListHeaderSkeleton from "./ListHeaderSkeleton";
import useListInfo from "@/lib/hooks/bsky/list/useListInfo";

interface Props {
  list: string;
}

export default function FeedHeader(props: Props) {
  const { list } = props;
  const {
    listInfo,
    isLoadingListInfo,
    isFetchingListInfo,
    isRefetchingListInfo,
    listInfoError,
  } = useListInfo(list);

  return (
    <>
      {isFetchingListInfo && <ListHeaderSkeleton />}
      {!isFetchingListInfo && listInfo && (
        <>
          <article className="flex flex-col gap-2 border border-x-0 border-y-0 p-3 md:rounded-t-2xl md:border md:border-b-0">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <Image
                  src={listInfo.list.avatar ?? FallbackList}
                  alt={listInfo.list.name}
                  width={60}
                  height={60}
                  className={`rounded-lg ${!listInfo.list.avatar && "border"}`}
                />
                <div className="flex flex-col">
                  <h2 className="break-words text-xl font-semibold text-neutral-700">
                    {listInfo.list.name}
                  </h2>
                  <h3 className="break-all text-neutral-500">
                    By{" "}
                    <Link
                      href={`/dashboard/user/${listInfo.list.creator.handle}`}
                      className="font-medium hover:text-neutral-400"
                    >
                      @{listInfo.list.creator.handle}
                    </Link>
                  </h3>
                </div>
              </div>
            </div>
            {listInfo.list.description && (
              <p className="break-words text-neutral-700" dir="auto">
                {listInfo.list.description}
              </p>
            )}
          </article>
        </>
      )}
    </>
  );
}