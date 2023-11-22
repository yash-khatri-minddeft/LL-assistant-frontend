import "./App.css";
import { Messages } from "./components/Messages";
import { useCookies } from "react-cookie";
import { useCreateThread } from "./lib/hooks/useCreateThread";
import { UserInput } from "./components/UserInput";
import { useState } from "react";

function App() {
  const [cookies, setCookie] = useCookies(["thread-id"]);
  const threadId = cookies["thread-id"];
  const { data } = useCreateThread(threadId);
  if (data) setCookie("thread-id", data.thread.id);
  const [isAssistantLoading, setIsAssistantLoading] = useState(false);
  const [userLastMessage, setUserLastMessage] = useState("");
  return (
    <div className="min-h-screen max-w-[1400px] px-6 pt-10 mx-auto text-2xl relative">
      <Messages
        isAssistantLoading={isAssistantLoading}
        userLastMessage={userLastMessage}
      />
      <UserInput
        isAssistantLoading={isAssistantLoading}
        setIsAssistantLoading={setIsAssistantLoading}
        setUserLastMessage={setUserLastMessage}
      />
    </div>
  );
}

export default App;
