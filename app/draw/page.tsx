"use client";

import { useEffect, useState } from "react";

type Prize = {
  id: number;
  name: string;
  reward: string;
  count: number;
};

type PrizeResult = {
  name: string;
  reward: string;
  winners: string[];
};

type DrawRecord = {
  id: number;
  eventName: string;
  date: string;
  time: string;
  participantCount: number;
  results: PrizeResult[];
};

export default function DrawPage() {
  const [eventName, setEventName] = useState("");
  const [playerInput, setPlayerInput] = useState("");
  const [error, setError] = useState("");

  const [prizes, setPrizes] = useState<Prize[]>([
    { id: 1, name: "", reward: "", count: 1 },
  ]);

  const [results, setResults] = useState<PrizeResult[]>([]);
  const [records, setRecords] = useState<DrawRecord[]>([]);

  // 讀取歷史紀錄
  useEffect(() => {
    const saved = localStorage.getItem("shengshi-draw-records");

    if (saved) {
      try {
        const data = JSON.parse(saved);

        if (Array.isArray(data)) {
          setRecords(
            data.filter((record) => Array.isArray(record.results))
          );
        }
      } catch {
        setRecords([]);
      }
    }
  }, []);

  // 玩家名單
  const players = Array.from(
    new Set(
      playerInput
        .split(/\r?\n|,|，|\/+/)
        .map((name) => name.trim())
        .filter(Boolean)
    )
  );

  // 修改獎項
  function updatePrize(
    id: number,
    field: keyof Omit<Prize, "id">,
    value: string | number
  ) {
    setPrizes(
      prizes.map((prize) =>
        prize.id === id
          ? { ...prize, [field]: value }
          : prize
      )
    );
  }

  // 新增獎項
  function addPrize() {
    setPrizes([
      ...prizes,
      {
        id: Date.now(),
        name: "",
        reward: "",
        count: 1,
      },
    ]);
  }

  // 刪除獎項
  function removePrize(id: number) {
    setPrizes(prizes.filter((prize) => prize.id !== id));
  }

  // 開始抽獎
  function startDraw() {
    setError("");

    if (!eventName.trim()) {
      setError("請輸入活動名稱。");
      return;
    }

    if (players.length === 0) {
      setError("請輸入玩家名單。");
      return;
    }

    if (
      prizes.length === 0 ||
      prizes.some(
        (prize) =>
          !prize.name.trim() ||
          !prize.reward.trim() ||
          prize.count < 1
      )
    ) {
      setError("請完整填寫獎項資料。");
      return;
    }

    // 打亂玩家名單
    const pool = [...players].sort(() => Math.random() - 0.5);

    let index = 0;

    // 依序抽獎，同一玩家不重複
    const drawResults = prizes.map((prize) => {
      const winners = pool.slice(index, index + prize.count);

      index += prize.count;

      return {
        name: prize.name.trim(),
        reward: prize.reward.trim(),
        winners,
      };
    });

    setResults(drawResults);

    // 日期時間
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

    // 儲存紀錄
    const newRecord: DrawRecord = {
      id: Date.now(),
      eventName: eventName.trim(),
      date,
      time,
      participantCount: players.length,
      results: drawResults,
    };

    const updatedRecords = [newRecord, ...records];

    setRecords(updatedRecords);

    localStorage.setItem(
      "shengshi-draw-records",
      JSON.stringify(updatedRecords)
    );
  }

  // 清除紀錄
  function clearRecords() {
    if (!window.confirm("確定要清除所有抽獎紀錄嗎？")) return;

    localStorage.removeItem("shengshi-draw-records");
    setRecords([]);
    setResults([]);
  }

  return (
    <main
      className="relative min-h-screen bg-cover bg-center bg-fixed px-6 py-8 text-white"
      style={{ backgroundImage: "url('/draw-bg.png')" }}
    >
      <div className="fixed inset-0 bg-black/70" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <a
          href="/"
          className="text-sm text-gray-300 hover:text-[#d8b56a]"
        >
          ← 返回首頁
        </a>

        {/* 抽獎設定 */}
        <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-[#29251c] bg-black/60 p-6 backdrop-blur-xl">
          <h1 className="mb-8 text-center text-3xl font-bold">
            仙緣抽獎
          </h1>

          {/* 活動名稱 */}
          <label className="text-lg font-bold">活動名稱</label>

          <input
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="輸入活動名稱"
            className="mt-2 w-full rounded-xl border border-[#29251c] bg-[#080808] px-4 py-3 outline-none focus:border-[#d8b56a]"
          />

          {/* 獎項設定 */}
          <div className="mt-8 flex items-center justify-between">
            <h2 className="text-lg font-bold">獎項設定</h2>

            <button
              onClick={addPrize}
              className="rounded-lg border border-[#d8b56a] px-4 py-2 text-[#d8b56a] hover:bg-[#d8b56a] hover:text-black"
            >
              ＋ 新增獎項
            </button>
          </div>

          <div className="mt-4 space-y-4">
            {prizes.map((prize) => (
              <div
                key={prize.id}
                className="grid grid-cols-[1fr_2fr_120px_auto] gap-3 rounded-xl border border-[#29251c] bg-black/40 p-4"
              >
                <input
                  value={prize.name}
                  onChange={(e) =>
                    updatePrize(prize.id, "name", e.target.value)
                  }
                  placeholder="獎項名稱"
                  className="rounded-lg border border-[#29251c] bg-[#080808] px-3 py-3 outline-none focus:border-[#d8b56a]"
                />

                <input
                  value={prize.reward}
                  onChange={(e) =>
                    updatePrize(prize.id, "reward", e.target.value)
                  }
                  placeholder="獎勵內容"
                  className="rounded-lg border border-[#29251c] bg-[#080808] px-3 py-3 outline-none focus:border-[#d8b56a]"
                />

                <input
                  type="number"
                  min="1"
                  value={prize.count}
                  onChange={(e) =>
                    updatePrize(
                      prize.id,
                      "count",
                      Number(e.target.value)
                    )
                  }
                  className="rounded-lg border border-[#29251c] bg-[#080808] px-3 py-3 outline-none focus:border-[#d8b56a]"
                />

                <button
                  onClick={() => removePrize(prize.id)}
                  className="rounded-lg border border-red-900 px-4 text-red-300 hover:bg-red-900"
                >
                  刪除
                </button>
              </div>
            ))}
          </div>

          {/* 玩家名單 */}
          <div className="mt-8 flex justify-between">
            <label className="text-lg font-bold">玩家名單</label>

            <span className="text-[#d8b56a]">
              共 {players.length} 人
            </span>
          </div>

          <textarea
            value={playerInput}
            onChange={(e) => setPlayerInput(e.target.value)}
            placeholder="一行一位玩家"
            rows={10}
            className="mt-2 w-full resize-none rounded-xl border border-[#29251c] bg-[#080808] px-4 py-3 outline-none focus:border-[#d8b56a]"
          />

          {error && (
            <div className="mt-4 rounded-lg border border-red-900 bg-red-950/40 p-3 text-red-300">
              {error}
            </div>
          )}

          <div className="mt-8 text-center">
            <button
              onClick={startDraw}
              className="rounded-xl bg-[#d8b56a] px-10 py-3 text-xl font-bold text-black hover:bg-[#f0d99a]"
            >
              🎁 開始抽獎
            </button>
          </div>
        </div>

        {/* 本次結果 */}
        {results.length > 0 && (
          <section className="mx-auto mt-10 max-w-4xl">
            <h2 className="text-center text-3xl font-bold text-[#d8b56a]">
              {eventName}
            </h2>

            <div className="mt-6 space-y-4">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-[#8e6d32]/50 bg-black/70 p-5"
                >
                  <h3 className="text-xl font-bold">{result.name}</h3>

                  <p className="mt-1 text-[#d8b56a]">
                    🎁 {result.reward}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {result.winners.map((winner) => (
                      <span
                        key={winner}
                        className="rounded-lg border border-[#8e6d32] bg-[#15120c] px-4 py-2 font-bold text-[#f0d99a]"
                      >
                        {winner}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 歷史紀錄 */}
        <section className="mt-12 border-t border-[#29251c] pt-8">
          <div className="flex justify-between">
            <div>
              <h2 className="text-3xl font-bold">抽獎紀錄</h2>
              <p className="mt-2 text-sm text-gray-500">
                每次抽獎結果將自動保留。
              </p>
            </div>

            {records.length > 0 && (
              <button
                onClick={clearRecords}
                className="h-fit rounded-lg border border-red-900 px-4 py-2 text-sm text-red-300 hover:bg-red-900"
              >
                清除紀錄
              </button>
            )}
          </div>

          {records.length === 0 ? (
            <div className="mt-5 rounded-xl border border-[#29251c] bg-black/70 p-8 text-center text-gray-500">
              尚無抽獎紀錄
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              {records.map((record) => (
                <div
                  key={record.id}
                  className="rounded-xl border border-[#29251c] bg-black/70 p-6"
                >
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-xl font-bold">
                        {record.eventName}
                      </h3>

                      <p className="mt-2 text-sm text-gray-500">
                        {record.date}　{record.time}
                      </p>
                    </div>

                    <p className="text-sm text-gray-400">
                      參加人數：{record.participantCount} 人
                    </p>
                  </div>

                  <div className="mt-5 space-y-3 border-t border-[#29251c] pt-4">
                    {record.results.map((result, index) => (
                      <div key={index}>
                        <p className="font-bold">
                          {result.name}
                          <span className="ml-3 font-normal text-[#d8b56a]">
                            🎁 {result.reward}
                          </span>
                        </p>

                        <p className="mt-2 text-gray-300">
                          得獎者：
                          {result.winners.length
                            ? result.winners.join("、")
                            : "—"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}