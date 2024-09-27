"use client";

import { getHostname } from "@/lib/utils/text";
import { useAnonymousIdentity } from "@frames.js/render/identity/anonymous";
import { FrameUI } from "@frames.js/render/ui";
import { useFrame } from "@frames.js/render/use-frame";
import Image from "next/image";
import { Dispatch, ReactElement, SetStateAction } from "react";
import type { FrameStackDone } from "@frames.js/render";
import Button from "@/components/actions/button/Button";
import { CgClose } from "react-icons/cg";

interface Props {
  url: string;
  title: string;
  defaultCard: ReactElement;
  onRemoveLinkCard: Dispatch<SetStateAction<string>>;
}

export default function FrameLinkCard(props: Props) {
  const { url, title, defaultCard, onRemoveLinkCard } = props;
  const signerState = useAnonymousIdentity();
  const frameState = useFrame({
    homeframeUrl: url, // url to frame
    frameActionProxy: "/api/frames",
    frameGetProxy: "/api/frames",
    connectedAddress: undefined,
    frameContext: {},
    signerState,
  });

  return (
    <article
      className="relative bg-skin-base border-skin-base mt-2 rounded-lg border"
      onClick={(e) => e.stopPropagation()}
    >
      <Button
        className="text-skin-icon-inverted bg-skin-overlay hover:bg-skin-inverted hover:text-skin-inverted absolute left-0 top-0 z-50 m-2 rounded-full p-1"
        onClick={(e) => {
          e.preventDefault();
          onRemoveLinkCard(url);
        }}
      >
        <CgClose className="text-xl" />
      </Button>
      <FrameUI
        frameState={frameState}
        theme={{
          Button: {
            className:
              "flex items-center justify-center gap-1 grow disabled:cursor-not-allowed text-skin-secondary border-skin-base bg-skin-secondary rounded-lg border p-2 text-sm font-medium hover:brightness-95",
          },
          ButtonsContainer: {
            className: "flex flex-wrap justify-between gap-2 mt-2",
          },
          Image: { className: "rounded-md mx-auto w-full" },
          Message: { className: "text-skin-base" },
          MessageTooltip: { className: "text-skin-base" },
          TextInput: {
            className:
              "text-skin-base focus:outline-skin-base placeholder:text-skin-secondary bg-skin-base border-skin-base w-full rounded-lg border px-4 py-2.5",
          },
          TextInputContainer: {
            className: "flex flex-wrap justify-between gap-2 mt-2",
          },
          LoadingScreen: {
            className:
              "w-full  bg-skin-base border-skin-base rounded-md flex animate-pulse",
          },
          Root: {
            className: "m-3 cursor-default relative overflow-hidden",
          },
        }}
        components={{
          Image(props) {
            return (
              <>
                {props.status === "frame-loading-complete" &&
                  props.frameState.status === "complete" && (
                    <Image
                      src={props.src}
                      alt="Loaded frame image"
                      width={500}
                      height={384}
                      className={`w-full h-auto max-h-96 rounded-md`}
                    />
                  )}
              </>
            );
          },
          ButtonsContainer(props, stylingProps) {
            return (
              <div>
                {props.frameState.status === "complete" && (
                  <div className={`${stylingProps.className}`}>
                    {props.buttons.map((btn) => (
                      <button key={btn.key} {...btn.props} />
                    ))}
                  </div>
                )}
              </div>
            );
          },
          LoadingScreen(props, stylingProps) {
            const previousFrame = (
              frameState.framesStack[
                frameState.framesStack.length - 1
              ] as FrameStackDone
            )?.frameResult?.frame;

            return (
              <>
                {props.frameState.status !== "complete" && (
                  <div className={stylingProps.className}>
                    {previousFrame?.image && (
                      <Image
                        className="blur-xl rounded-md h-auto max-h-96"
                        src={previousFrame.image}
                        width={500}
                        height={384}
                        alt="Previous image"
                      />
                    )}
                    {!previousFrame?.image && (
                      <span className="text-skin-base font-medium animate-pulse m-auto">
                        Loading...
                      </span>
                    )}
                  </div>
                )}
              </>
            );
          },
          Error() {
            return defaultCard;
          },
        }}
      />
      <hr />
      <div className="flex flex-col p-3">
        <span className="text-skin-tertiary break-all text-sm">
          {getHostname(url)}
        </span>
        <span className="text-skin-base font-medium [overflow-wrap:anywhere]">
          {title}
        </span>
      </div>
    </article>
  );
}
