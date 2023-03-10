import { useState } from "react";

import { useRouter } from "next/router";

import Button from "@/components/dom/Button";
import Channel from "@/components/dom/Channel";
import Modal from "@/components/dom/Modal";
import { useBallsStore } from "@/utils/ballsStore";
import { useGameStore } from "@/utils/gameStore";
import { useMultiplayerStore } from "@/utils/multiplayerStore";

export default function MultiplayerGUI() {
  const { push } = useRouter();
  const gameMode = useGameStore((state) => state.gameMode);
  const username = useMultiplayerStore((state) => state.userInfo?.username);
  const setGameMode = useGameStore((state) => state.setGameMode);
  const playersInfo = useMultiplayerStore((state) => state.playersInfo);

  return (
    <>
      <Modal show={gameMode === "menu"}>
        <div className="flex w-72 flex-col gap-12">
          {username == undefined && (
            <>
              <MultiplayerForm />
              <Button onClick={() => push("/")} text="PLAY ALONE" />
            </>
          )}
          {username && (
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

      {username && <Channel username={username} />}
    </>
  );
}

export function MultiplayerForm() {
  const { push, asPath } = useRouter();
  const setGameMode = useGameStore((state) => state.setGameMode);
  const setUserInfo = useMultiplayerStore((state) => state.setUserInfo);
  const setSelectedBall = useBallsStore((state) => state.setSelectedBall);

  const [inputName, setInputName] = useState("");

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (inputName.trim() === "") return;

        setUserInfo({ username: inputName.trim().substring(0, 12) });
        setGameMode("waiting", true);
        setSelectedBall(null);

        if (asPath != "/multiplayer") push("/multiplayer");
      }}
    >
      <label htmlFor="user_name" className="text-sm font-medium text-white">
        Enter your name
      </label>
      <input
        id="user_name"
        type="text"
        className="w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
        required
        value={inputName}
        onChange={(e) => setInputName(e.target.value)}
        maxLength={12}
      />
      <Button
        type="submit"
        text="PLAY ONLINE"
        disabled={inputName.trim() === ""}
      />
    </form>
  );
}
