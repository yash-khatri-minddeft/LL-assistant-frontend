/* eslint-disable react/prop-types */
import axios from "axios";
import React, { useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useMessage } from "../lib/hooks/useMessages";

export const UserInput = ({
  isAssistantLoading,
  setIsAssistantLoading,
  setUserLastMessage,
}) => {
  const messageRef = useRef();
  const [messageText, setMessageText] = useState("");
  const formRef = useRef();
  const [cookies] = useCookies(["thread-id"]);
  const threadId = cookies["thread-id"];
  const { refetch, isLoading: isMessageLoading } = useMessage(threadId, false);
  const submitHandler = async (e) => {
    e.preventDefault();
    const message = messageRef.current.value;
    if (!threadId && message) return;
    setIsAssistantLoading(true);
    setUserLastMessage(message);
    formRef.current.reset();
    const res = await axios.post(
      "/api/create-message",
      JSON.stringify({
        threadId,
        messageText: message,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (res.status == 200) {
      const runThread = await axios.post(
        "/api/run-thread",
        JSON.stringify({ threadId }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      let runStatus = runThread.data.run.status;
      if (runThread.status == 200) {
        while (runStatus == "queued" || runStatus == "in_progress") {
          await new Promise((resolve) => setTimeout(resolve, 5000)); // Poll every 5 seconds
          const runState = await axios.post(
            "/api/get-thread-status",
            JSON.stringify({ threadId, runId: runThread.data.run.id }),
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (runState.status == 200) {
            runStatus = runState.data.myThread.status;
          }
        }
        if (runStatus == "completed") {
          refetch();
          setIsAssistantLoading(false);
          setUserLastMessage("");
        }
      }
    }
  };
  return (
    <div className="fixed bottom-0 mx-[-10px] z-10 max-w-[1400px] w-full bg-[#242424]">
      <div className="mb-[40px]  bg-[#242424]">
        <form onSubmit={submitHandler} ref={formRef} className="relative">
          <input
            type="text"
            className="w-full h-[70px] text-xl bg-[#4d4d4d] focus:outline-none px-5 rounded-lg"
            placeholder="Message here..."
            ref={messageRef}
            onChange={(e) => setMessageText(e.target.value)}
          />
          <button
            className="absolute right-5 top-[50%] translate-y-[-50%] bg-[#242424] py-2 px-4 rounded-md leading-none disabled:opacity-50"
            disabled={!messageText || isMessageLoading || isAssistantLoading}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
