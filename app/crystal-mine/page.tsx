"use client";

import { useEffect, useState } from "react";

type MiningRecord = {
  id: number;
  date: string;
  time: string;
  numbers: number[];
};

export default function CrystalMine() {
  const [winningNumbers, setWinningNumbers] = useState<number[]>([]);
  const [records, setRecords] = useState<MiningRecord[]>([]);


  // =========================
  // 讀取歷史開採紀錄
  // =========================
  useEffect(() => {
    const savedRecords = localStorage.getItem(
      "shengshi-crystal-mine-records"
    );

    if (savedRecords) {
      setRecords(JSON.parse(savedRecords));
    }
  }, []);


  // =========================
  // 開啟礦區
  // =========================
  function startMining() {
    const numbers = Array.from(
      { length: 25 },
      (_, index) => index + 1
    );

    // 隨機抽出 5 個不重複號碼
    const winners = [...numbers]
      .sort(() => Math.random() - 0.5)
      .slice(0, 5)
      .sort((a, b) => a - b);

    setWinningNumbers(winners);


    // 取得目前日期與時間
    const now = new Date();

    const date = now.toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const time = now.toLocaleTimeString("zh-TW", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });


    // 建立本次紀錄
    const newRecord: MiningRecord = {
      id: Date.now(),
      date,
      time,
      numbers: winners,
    };

    const updatedRecords = [
      newRecord,
      ...records,
    ];


    // 更新畫面
    setRecords(updatedRecords);


    // 儲存到瀏覽器
    localStorage.setItem(
      "shengshi-crystal-mine-records",
      JSON.stringify(updatedRecords)
    );
  }


  // =========================
  // 清除所有開採紀錄
  // =========================
  function clearRecords() {
    const confirmed = window.confirm(
      "確定要清除所有開採紀錄嗎？\n\n此操作無法復原。"
    );

    if (!confirmed) {
      return;
    }

    // 清除瀏覽器紀錄
    localStorage.removeItem(
      "shengshi-crystal-mine-records"
    );

    // 清除歷史紀錄
    setRecords([]);

    // 清除目前開採結果
    setWinningNumbers([]);
  }


  return (
    <main
      className="
        relative
        min-h-screen
        bg-cover
        bg-start
        bg-fixed
        bg-no-repeat
        px-5
        py-5
        text-white
      "
      style={{
        backgroundImage: "url('/mine-bg.png')",
      }}
    >


      {/* =========================
          背景黑色遮罩
      ========================= */}
      <div className="fixed inset-0 bg-black/55" />


      {/* =========================
          頁面主要內容
      ========================= */}
      <div className="relative z-10 mx-auto max-w-6xl">


        {/* =========================
            返回首頁
        ========================= */}
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
            25 個礦區
        ========================= */}
        <div
          className="
            mx-auto
            mt-40
            grid
            max-w-[1060px]
            grid-cols-15
            justify-items-center
            gap-y-10
          "
        >

          {Array.from({ length: 25 }, (_, index) => {
            const number = index + 1;

            const isWinner =
              winningNumbers.includes(number);

            return (
              <div
                key={number}
                className={`
                  flex
                  aspect-square
                  items-center
                  justify-center
                  rounded-xl
                  border
                  text-4xl
                  font-bold
                  backdrop-blur-2xl
                  transition
                  duration-500

                  ${
                    isWinner
                      ? `
                        scale-140
                        border-[#f0d99a]
                        bg-[#d8b56a]
                        text-black
                        shadow-[0_0_30px_rgba(216,181,106,0.45)]
                      `
                      : `
                        border-[#8e6d32]/60
                        bg-black/70
                        text-gray-300
                      `
                  }
                `}
              >
                {number}
              </div>
            );
          })}

        </div>


        {/* =========================
            開啟礦區
        ========================= */}
        <div className="mt-10 text-center">

          <button
            onClick={startMining}
            className="
              rounded-xl
              bg-[#d8b56a]
              px-5
              py-2
              text-[25px]
              font-bold
              text-black
              shadow-lg
              transition
              duration-300
              hover:bg-[#f0d99a]
            "
          >
            🪏 開啟礦區
          </button>

        </div>


        {/* =========================
            本次開採結果
        ========================= */}
        {winningNumbers.length > 0 && (
          <div className="mt-6 text-center">

            <p className="text-[18px] tracking-widest text-gray-300">
              - 本次仙晶礦區 -
            </p>


            <div className="mt-5 flex flex-wrap justify-center gap-5">

              {winningNumbers.map((number) => (
                <div
                  key={number}
                  className="
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#d8b56a]
                    bg-black/80
                    text-2xl
                    font-bold
                    text-[#f0d99a]
                    shadow-[0_0_20px_rgba(216,181,106,0.25)]
                    backdrop-blur-sm
                  "
                >
                  {number}
                </div>
              ))}

            </div>

          </div>
        )}


        {/* =========================
            歷史開採紀錄
        ========================= */}
        <div className="mt-10 border-t border-[#8e6d32]/50 pt-10">


          {/* =========================
              開採紀錄標題
          ========================= */}
          <div className="flex items-start justify-between">

            <div>

              <h2 className="text-3xl font-bold">
                開採紀錄
              </h2>

              <p className="mt-2 text-sm text-gray-400">
                每次開採結果將自動保留。
              </p>

            </div>


            {/* =========================
                清除紀錄
            ========================= */}
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
              尚無紀錄
          ========================= */}
          {records.length === 0 ? (

            <div
              className="
                mt-5
                rounded-xl
                border
                border-[#8e6d32]/50
                bg-black/70
                p-8
                text-center
                text-gray-400
                backdrop-blur-2xl
              "
            >
              尚無開採紀錄
            </div>

          ) : (

            /* =========================
                開採紀錄列表
            ========================= */
            <div className="mt-5 space-y-4">

              {records.map((record) => (

                <div
                  key={record.id}
                  className="
                    flex
                    flex-col
                    gap-8
                    rounded-xl
                    border
                    border-[#8e6d32]/30
                    bg-black/70
                    p-8
                    backdrop-blur-2xl
                    md:flex-row
                    md:items-center
                    md:justify-between
                  "
                >


                  {/* =========================
                      日期與時間
                  ========================= */}
                  <div>

                    <p className="text-lg font-bold">
                      {record.date}
                    </p>

                    <p className="mt-1 text-sm text-gray-400">
                      {record.time}
                    </p>

                  </div>


                  {/* =========================
                      號碼＋本期統計
                  ========================= */}
                  <div className="flex flex-col items-end gap-4">


                    {/* 當次開採號碼 */}
                    <div className="flex flex-wrap gap-5">

                      {record.numbers.map((number) => (
                        <div
                          key={number}
                          className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-[#8e6d32]
                            bg-[#15120c]/90
                            font-bold
                            text-[#d8b56a]
                          "
                        >
                          {number}
                        </div>
                      ))}

                    </div>


                    {/* =========================
                        統計本期
                    ========================= */}
                    <a
                      href={`/crystal-mine/stats?id=${record.id}`}
                      className="
                        rounded-lg
                        border
                        border-[#8e6d32]
                        bg-[#15120c]/90
                        px-5
                        py-2
                        text-sm
                        font-bold
                        text-[#d8b56a]
                        transition
                        duration-300
                        hover:bg-[#d8b56a]
                        hover:text-black
                      "
                    >
                      📊 統計本期
                    </a>

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