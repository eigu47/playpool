import { useState } from "react";

import { useRouter } from "next/router";

import Button from "@/components/dom/Button";
import Channels from "@/components/dom/Channels";
import Modal from "@/components/dom/Modal";
import { useGameStore } from "@/utils/gameStore";
import { useMultiplayerStore } from "@/utils/multiplayerStore";

export default function IndexGUI() {
  const { push } = useRouter();
  const gameMode = useGameStore((state) => state.gameMode);
  const username = useMultiplayerStore((state) => state.userInfo?.username);
  const setGameMode = useGameStore((state) => state.setGameMode);
  const playersInfo = useMultiplayerStore((state) => state.playersInfo);

  return (
    <>
      <Modal show={gameMode === "menu"}>
        <div className="flex w-72 flex-col gap-6">
          {username == undefined && (
            <>
              <MultiplayerForm />
              <Button onClick={() => push("/")} text="PLAY ALONE" />
            </>
          )}
          {username != undefined && (
            <Button
              type="submit"
              text="BACK TO GAME"
              onClick={() => {
                if (playersInfo.length === 2) {
                  setGameMode("idle", true);
                }

                setGameMode("waiting", true);
              }}
            />
          )}
        </div>
      </Modal>

      {username != undefined && <Channels username={username} />}
    </>
  );
}

export function MultiplayerForm() {
  const { push, asPath } = useRouter();
  const setGameMode = useGameStore((state) => state.setGameMode);
  const setUsername = useMultiplayerStore((state) => state.setUserInfo);

  const [inputName, setInputName] = useState("");

  return (
    <form
      className="flex flex-col"
      onSubmit={(e) => {
        e.preventDefault();
        if (inputName.trim() === "") return;

        setUsername({ username: inputName });
        setGameMode("waiting", true);

        if (asPath != "/multiplayer") push("/multiplayer");
      }}
    >
      <label
        htmlFor="user_name"
        className="mb-2 block text-sm font-medium text-white"
      >
        Enter your name
      </label>
      <input
        id="user_name"
        type="text"
        className="mb-2 block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
        required
        value={inputName}
        onChange={(e) => setInputName(e.target.value)}
      />
      <Button type="submit" text="PLAY ONLINE" />
    </form>
  );
}
