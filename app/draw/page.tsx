"use client";

import { useEffect, useState } from "react";

type DrawRecord = {
  id: number;
  eventName: string;
  reward: string;
  date: string;
  time: string;
  participantCount: number;
  winnerCount: number;
  winners: string[];
};

export default function DrawPage() {
  const [eventName, setEventName] = useState("");
  const [reward, setReward] = useState("");
  const [playerInput, setPlayerInput] = useState("");
  const [winnerCount, setWinnerCount] = useState(1);
  const [winners, setWinners] = useState<string[]>([]);
  const [records, setRecords] = useState<DrawRecord[]>([]);
  const [error, setError] = useState("");


  // =========================
  // 讀取歷史抽獎紀錄
  // =========================
  useEffect(() => {
    const savedRecords = localStorage.getItem(
      "shengshi-draw-records"
    );

    if (savedRecords) {
      setRecords(JSON.parse(savedRecords));
    }
  }, []);


  // =========================
  // 整理玩家名單
  // =========================
  function getPlayers() {
    return playerInput
      .split(/\r?\n|,|，|\/+/)
      .map((name) => name.trim())
      .filter((name) => name !== "");
  }


  // =========================
  // 開始抽獎
  // =========================
  function startDraw() {
    setError("");

    const players = getPlayers();


    // 檢查活動名稱
    if (!eventName.trim()) {
      setError("請輸入活動名稱。");
      return;
    }


    // 檢查活動獎勵
    if (!reward.trim()) {
      setError("請輸入活動獎勵。");
      return;
    }


    // 檢查玩家名單
    if (players.length === 0) {
      setError("請輸入玩家名單。");
      return;
    }


    // 檢查抽出人數
    if (winnerCount < 1) {
      setError("抽出人數至少需要 1 人。");
      return;
    }


    // 移除重複名稱
    const uniquePlayers = Array.from(
      new Set(players)
    );


    // 檢查抽出人數是否超過玩家人數
    if (winnerCount > uniquePlayers.length) {
      setError(
        "抽出人數不能超過不重複的玩家人數。"
      );
      return;
    }


    // 隨機打亂玩家
    const shuffled = [...uniquePlayers].sort(
      () => Math.random() - 0.5
    );


    // 取出得獎者
    const selectedWinners = shuffled.slice(
      0,
      winnerCount
    );

    setWinners(selectedWinners);


    // =========================
    // 取得日期與時間
    // =========================
    const now = new Date();

    const date = now.toLocaleDateString(
      "zh-TW",
      {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }
    );

    const time = now.toLocaleTimeString(
      "zh-TW",
      {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }
    );


    // =========================
    // 建立本次抽獎紀錄
    // =========================
    const newRecord: DrawRecord = {
      id: Date.now(),
      eventName: eventName.trim(),
      reward: reward.trim(),
      date,
      time,
      participantCount: uniquePlayers.length,
      winnerCount,
      winners: selectedWinners,
    };


    const updatedRecords = [
      newRecord,
      ...records,
    ];


    // 更新畫面
    setRecords(updatedRecords);


    // 儲存至瀏覽器
    localStorage.setItem(
      "shengshi-draw-records",
      JSON.stringify(updatedRecords)
    );
  }


  // =========================
  // 清除所有抽獎紀錄
  // =========================
  function clearRecords() {
    const confirmed = window.confirm(
      "確定要清除所有抽獎紀錄嗎？\n\n此操作無法復原。"
    );

    if (!confirmed) {
      return;
    }


    // 清除瀏覽器紀錄
    localStorage.removeItem(
      "shengshi-draw-records"
    );


    // 清除歷史紀錄
    setRecords([]);


    // 清除目前得獎結果
    setWinners([]);
  }


  // =========================
  // 計算不重複參加人數
  // =========================
  const participantCount = Array.from(
    new Set(getPlayers())
  ).length;


  return (
    <main
      className="
        relative
        min-h-screen
        bg-cover
        bg-center
        bg-fixed
        bg-no-repeat
        px-6
        py-8
        text-white
      "
      style={{
        backgroundImage: "url('/draw-bg.png')",
      }}
    >


      {/* =========================
          背景遮罩
      ========================= */}
      <div className="fixed inset-0 bg-black/70" />


      {/* =========================
          頁面主要內容
      ========================= */}
      <div className="relative z-10 mx-auto max-w-6xl">


        {/* 返回首頁 */}
        <a
          href="/"
          className="
            text-sm
            text-gray-300
            transition
            hover:text-[#d8b56a]
          "
        >
          ← 返回首頁
        </a>


        {/* =========================
            抽獎設定
        ========================= */}
        <div
          className="
            mx-auto
            mt-8
            max-w-2xl
            rounded-2xl
            border
            border-[#29251c]
            bg-[#111111]/60
            p-6
            backdrop-blur-sm
          "
        >


          {/* 活動名稱 */}
          <div>

            <label className="text-lg font-bold text-gray-300">
              活動名稱
            </label>

            <input
              type="text"
              value={eventName}
              onChange={(e) =>
                setEventName(e.target.value)
              }
              className="
                mt-3
                w-full
                rounded-xl
                border
                border-[#29251c]
                bg-[#080808]
                px-5
                py-4
                text-white
                outline-none
                transition
                focus:border-[#d8b56a]
              "
            />

          </div>


          {/* =========================
              活動獎勵
          ========================= */}
          <div className="mt-6">

            <label className="text-lg font-bold text-gray-300">
              活動獎勵
            </label>

            <input
              type="text"
              value={reward}
              onChange={(e) =>
                setReward(e.target.value)
              }
              className="
                mt-3
                w-full
                rounded-xl
                border
                border-[#29251c]
                bg-[#080808]
                px-5
                py-4
                text-white
                outline-none
                transition
                focus:border-[#d8b56a]
              "
            />

          </div>


          {/* =========================
              玩家名單
          ========================= */}
          <div className="mt-6">

            <div className="flex items-center justify-between">

              <label className="text-lg font-bold text-gray-300">
                玩家名單
              </label>

              <span className="text-lg text-[#d8b56a]">
                共 {participantCount} 人
              </span>

            </div>


            <textarea
              value={playerInput}
              onChange={(e) =>
                setPlayerInput(e.target.value)
              }
              placeholder="一行一位玩家"
              rows={10}
              className="
                mt-3
                w-full
                resize-none
                rounded-xl
                border
                border-[#29251c]
                bg-[#080808]
                px-5
                py-4
                text-white
                outline-none
                transition
                focus:border-[#d8b56a]
              "
            />

          </div>


          {/* =========================
              抽出人數
          ========================= */}
          <div className="mt-4">

            <label className="text-lg font-bold text-gray-300">
              抽出人數
            </label>

            <input
              type="number"
              min="1"
              value={winnerCount}
              onChange={(e) =>
                setWinnerCount(
                  Number(e.target.value)
                )
              }
              className="
                mt-3
                w-full
                rounded-xl
                border
                border-[#29251c]
                bg-[#080808]
                px-5
                py-4
                text-white
                outline-none
                transition
                focus:border-[#d8b56a]
              "
            />

          </div>


          {/* =========================
              錯誤提示
          ========================= */}
          {error && (
            <div
              className="
                mt-6
                rounded-xl
                border
                border-red-900
                bg-red-950/40
                p-4
                text-sm
                text-red-300
              "
            >
              {error}
            </div>
          )}


          {/* =========================
              開始抽獎按鈕
          ========================= */}
          <div className="mt-8 text-center">

            <button
              onClick={startDraw}
              className="
                rounded-xl
                bg-[#d8b56a]
                px-8
                py-2
                text-[22px]
                font-bold
                text-black
                transition
                duration-300
                hover:bg-[#f0d99a]
              "
            >
              🎁 開始抽獎
            </button>

          </div>

        </div>


        {/* =========================
            本次得獎名單
        ========================= */}
        {winners.length > 0 && (
          <div className="mt-10 text-center">

            <p className="text-sm tracking-widest text-gray-400">
              本次得獎名單
            </p>


            <h2 className="mt-3 text-2xl font-bold text-[#d8b56a]">
              {eventName}
            </h2>


            <p className="mt-2 text-gray-400">
              🎁 {reward}
            </p>


            {/* 得獎者 */}
            <div className="mt-6 flex flex-wrap justify-center gap-4">

              {winners.map(
                (winner, index) => (
                  <div
                    key={`${winner}-${index}`}
                    className="
                      rounded-xl
                      border
                      border-[#d8b56a]
                      bg-[#15120c]
                      px-7
                      py-4
                      text-xl
                      font-bold
                      text-[#f0d99a]
                    "
                  >
                    {winner}
                  </div>
                )
              )}

            </div>

          </div>
        )}


        {/* =========================
            抽獎歷史紀錄
        ========================= */}
        <div className="mt-5 border-t border-[#29251c] pt-8">


          {/* 紀錄標題 */}
          <div className="flex items-start justify-between">

            <div>

              <h2 className="text-3xl font-bold">
                抽獎紀錄
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                每次抽獎結果將自動保留。
              </p>

            </div>


            {/* 清除紀錄按鈕 */}
            {records.length > 0 && (
              <button
                onClick={clearRecords}
                className="
                  rounded-lg
                  border
                  border-red-900/70
                  bg-red-950/40
                  px-4
                  py-2
                  text-sm
                  text-red-300
                  transition
                  duration-300
                  hover:bg-red-900
                  hover:text-white
                "
              >
                清除紀錄
              </button>
            )}

          </div>


          {/* =========================
              尚無抽獎紀錄
          ========================= */}
          {records.length === 0 ? (

            <div
              className="
                mt-5
                rounded-xl
                border
                border-[#29251c]
                bg-[#111111]/70
                p-8
                text-center
                text-gray-500
                backdrop-blur-sm
              "
            >
              尚無抽獎紀錄
            </div>

          ) : (

            /* =========================
                抽獎紀錄列表
            ========================= */
            <div className="mt-6 space-y-4">

              {records.map((record) => (
                <div
                  key={record.id}
                  className="
                    rounded-xl
                    border
                    border-[#29251c]
                    bg-[#111111]/80
                    p-6
                    backdrop-blur-sm
                  "
                >


                  {/* 活動資訊 */}
                  <div
                    className="
                      flex
                      flex-col
                      gap-10
                      md:flex-row
                      md:items-start
                      md:justify-between
                    "
                  >

                    <div>

                      {/* 活動名稱 */}
                      <h3 className="text-xl font-bold">
                        {record.eventName}
                      </h3>


                      {/* 活動獎勵 */}
                      <p className="mt-2 text-[#d8b56a]">
                        🎁 {record.reward}
                      </p>


                      {/* 日期時間 */}
                      <p className="mt-3 text-sm text-gray-500">
                        {record.date}　{record.time}
                      </p>

                    </div>


                    {/* 人數資料 */}
                    <div className="text-sm text-gray-400">

                      <p>
                        參加人數：
                        {record.participantCount} 人
                      </p>

                      <p className="mt-1">
                        抽出人數：
                        {record.winnerCount} 人
                      </p>

                    </div>

                  </div>


                  {/* =========================
                      得獎者
                  ========================= */}
                  <div className="mt-6 border-t border-[#29251c] pt-5">

                    <p className="text-sm text-gray-500">
                      得獎者
                    </p>


                    <div className="mt-3 flex flex-wrap gap-3">

                      {record.winners.map(
                        (winner, index) => (
                          <span
                            key={`${winner}-${index}`}
                            className="
                              rounded-lg
                              border
                              border-[#8e6d32]
                              bg-[#15120c]
                              px-4
                              py-2
                              font-bold
                              text-[#d8b56a]
                            "
                          >
                            {winner}
                          </span>
                        )
                      )}

                    </div>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

      </div>

    </main>
  );
}