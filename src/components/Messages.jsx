import React from "react";
import { useMessage } from "../lib/hooks/useMessages";
import { useCookies } from "react-cookie";

// eslint-disable-next-line react/prop-types
export const Messages = ({ isAssistantLoading, userLastMessage }) => {
  const [cookies] = useCookies(["thread-id"]);
  const threadId = cookies["thread-id"];
  const { data: message, isLoading } = useMessage(threadId);

  return (
    <div className="pb-[120px]">
      {message?.data?.messages?.data.length == 0 || isLoading ? (
        <>How Can i Help you today?</>
      ) : (
        message?.data?.messages.data.toReversed().map((message, i) => {
          return message.content.map((content) => {
            return (
              <div
                key={i}
                className={`${
                  message.role == "user" ? "user ml-auto" : "assistant"
                } relative p-6 rounded-lg my-10 bg-[#4d4d4d] w-max max-w-[calc(100%_-_100px)]`}
              >
                {content.text?.value}
              </div>
            );
          });
        })
      )}
      {userLastMessage && (
        <div
          className={`user ml-auto relative p-6 rounded-lg my-10 bg-[#4d4d4d] w-max max-w-[calc(100%_-_100px)]`}
        >
          {userLastMessage}
        </div>
      )}
      {isAssistantLoading && (
        <div
          className={`px-10 py-6 rounded-lg my-10 bg-[#4d4d4d] w-max max-w-[calc(100%_-_100px)] assistant relative flex gap-x-7 items-center`}
        >
          <span className="snippet" data-title="dot-falling">
            <div className="stage">
              <div className="dot-falling"></div>
            </div>
          </span>
        </div>
      )}
    </div>
  );
};
