"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type MiningRecord = {
  id: number;
  date: string;
  time: string;
  numbers: number[];
};

type PlayerResult = {
  id: string;
  selected: number[];
  matched: number[];
  hitCount: number;
  reward: number;
  jackpot: boolean;
  error?: string;
};

function CrystalStatsContent() {
  const searchParams = useSearchParams();

  const [record, setRecord] = useState<MiningRecord | null>(null);
  const [playerInput, setPlayerInput] = useState("");
  const [results, setResults] = useState<PlayerResult[]>([]);
  const [pageError, setPageError] = useState("");
  const [inputError, setInputError] = useState("");

  // 讀取本期開採紀錄
  useEffect(() => {
    const id = Number(searchParams.get("id"));
    const saved = localStorage.getItem("shengshi-crystal-mine-records");

    if (!id || !saved) {
      setPageError("找不到本期開採紀錄。");
      return;
    }

    try {
      const records: MiningRecord[] = JSON.parse(saved);
      const found = records.find((item) => item.id === id);

      if (!found) {
        setPageError("找不到本期開採紀錄。");
        return;
      }

      setRecord(found);
    } catch {
      setPageError("開採紀錄讀取失敗。");
    }
  }, [searchParams]);

  // 統計玩家資料
  function calculateResults() {
    if (!record) return;

    setInputError("");

    const lines = playerInput
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length === 0) {
      setInputError("請貼上玩家資料。");
      setResults([]);
      return;
    }

    const calculated: PlayerResult[] = lines.map((line) => {
      const separatorIndex = line.search(/[-－]/);

      if (separatorIndex === -1) {
        return createErrorResult(line, "格式錯誤，找不到 -");
      }

      const id = line.slice(0, separatorIndex).trim();
      const numberText = line.slice(separatorIndex + 1).trim();

      const selected = numberText
        .split(/[、,，\s]+/)
        .filter(Boolean)
        .map(Number);

      if (!id) {
        return createErrorResult("未填寫 ID", "缺少玩家 ID");
      }

      if (selected.some(Number.isNaN)) {
        return createErrorResult(id, "礦區號碼必須是數字");
      }

      if (selected.length !== 5) {
        return createErrorResult(id, "必須選擇 5 個礦區", selected);
      }

      if (new Set(selected).size !== 5) {
        return createErrorResult(id, "礦區號碼不可重複", selected);
      }

      if (selected.some((number) => number < 1 || number > 25)) {
        return createErrorResult(id, "礦區號碼必須為 1～25", selected);
      }

      const matched = selected
        .filter((number) => record.numbers.includes(number))
        .sort((a, b) => a - b);

      const hitCount = matched.length;

      return {
        id,
        selected,
        matched,
        hitCount,
        reward: hitCount * 100,
        jackpot: hitCount === 5,
      };
    });

    setResults(calculated);
  }

  function createErrorResult(
    id: string,
    error: string,
    selected: number[] = []
  ): PlayerResult {
    return {
      id,
      selected,
      matched: [],
      hitCount: 0,
      reward: 0,
      jackpot: false,
      error,
    };
  }

  const validResults = results.filter((result) => !result.error);
  const winnerCount = validResults.filter((result) => result.hitCount > 0).length;
  const totalReward = validResults.reduce(
    (total, result) => total + result.reward,
    0
  );

  return (
    <main
      className="relative min-h-screen bg-cover bg-start bg-fixed bg-no-repeat px-5 py-5 text-white"
      style={{ backgroundImage: "url('/mine-bg.png')" }}
    >
      <div className="fixed inset-0 bg-black/70" />

      <div className="relative z-10 mx-auto max-w-[1700px]">
        <a
          href="/crystal-mine"
          className="text-sm text-gray-300 transition hover:text-[#d8b56a]"
        >
          ← 返回盛世仙晶礦
        </a>

        {pageError && (
          <div className="mx-auto mt-10 max-w-3xl rounded-xl border border-red-900/70 bg-red-950/50 p-8 text-center text-red-300">
            {pageError}
          </div>
        )}

        {record && (
          <>
            {/* 本期資料 */}
            <div className="mt-8 text-center">
              <h1 className="text-4xl font-bold">本期仙晶礦統計</h1>

              <div className="mt-6 flex flex-wrap justify-center gap-4">
                {record.numbers.map((number) => (
                  <div
                    key={number}
                    className="flex h-14 w-14 items-center justify-center rounded-full border border-[#d8b56a] bg-[#15120c]/90 text-xl font-bold text-[#f0d99a]"
                  >
                    {number}
                  </div>
                ))}
              </div>
            </div>

            {/* 玩家資料 */}
            <div className="mx-auto mt-5 max-w-xl rounded-2xl border border-[#8e6d32]/40 bg-black/70 p-6 backdrop-blur-2xl">
              <label className="text-2xl font-bold">玩家資料</label>

              <p className="mt-1 text-sm text-gray-400">
                每位玩家一行，格式：ID-3、4、5、6、7
              </p>

              <textarea
                value={playerInput}
                onChange={(e) => setPlayerInput(e.target.value)}
                rows={10}
                className="mt-4 w-full resize-none rounded-xl border border-[#29251c] bg-[#080808]/90 px-5 py-4 text-white outline-none transition focus:border-[#d8b56a]"
              />

              {inputError && (
                <div className="mt-4 rounded-lg border border-red-900/70 bg-red-950/40 p-4 text-sm text-red-300">
                  {inputError}
                </div>
              )}

              <div className="mt-6 text-center">
                <button
                  onClick={calculateResults}
                  className="rounded-xl bg-[#d8b56a] px-5 py-3 text-xl font-bold text-black transition hover:bg-[#f0d99a]"
                >
                  開始統計
                </button>
              </div>
            </div>

            {/* 統計結果 */}
            {results.length > 0 && (
              <div className="mt-12">
                <h2 className="text-3xl font-bold">統計結果</h2>

                {/* 總計 */}
                <div className="mt-3 grid grid-cols-3 gap-6">
                  <SummaryCard
                    title="參與玩家"
                    value={`${validResults.length} 人`}
                  />

                  <SummaryCard
                    title="中獎玩家"
                    value={`${winnerCount} 人`}
                    gold
                  />

                  <SummaryCard
                    title="本期總發放"
                    value={`盛世幣 ${totalReward}`}
                    gold
                  />
                </div>

                {/* 玩家結果：一排五格 */}
                <div className="mt-2 grid grid-cols-5 gap-2">
                  {results.map((result, index) => (
                    <div
                      key={`${result.id}-${index}`}
                      className={`min-h-[290px] rounded-xl border p-5 backdrop-blur-xl ${
                        result.error
                          ? "border-red-900/70 bg-red-950/50"
                          : result.jackpot
                          ? "border-[#f0d99a] bg-[#d8b56a]/15 shadow-[0_0_25px_rgba(216,181,106,0.20)]"
                          : "border-[#29251c] bg-black/75"
                      }`}
                    >
                      <h3 className="text-2xl font-bold">{result.id}</h3>

                      <div className="mt-1">
                        <p className="mt-1 text-gray-200 ">
                          {result.selected.length
                            ? result.selected.join("、")
                            : "—"}
                        </p>
                      </div>

                      {result.error ? (
                        <p className="mt-5 font-bold text-red-300">
                          ⚠️ {result.error}
                        </p>
                      ) : (
                        <>
                          <div className="mt-1 border-t border-[#29251c] pt-2">
                            <p className="text-sm text-gray-500">命中礦區</p>
                            <p className="mt-1 font-bold text-[#d8b56a]">
                              {result.matched.length
                                ? result.matched.join("、")
                                : "—"}
                            </p>
                          </div>

                          <div className="mt-1">
                            <p className="text-sm text-gray-500">命中數</p>
                            <p className="mt-1 text-xl font-bold">
                              {result.hitCount} 個
                            </p>
                          </div>

                          <div className="mt-2">
                            <p className="text-sm text-gray-500">應發獎勵</p>
                            <p className="mt-1 text-2xl font-bold text-[#d8b56a]">
                              {result.reward
                                ? `盛世幣 ${result.reward}`
                                : "—"}
                            </p>
                          </div>

                          {result.jackpot && (
                            <div className="mt-5 rounded-lg border border-[#d8b56a] bg-[#d8b56a]/10 px-3 py-2 text-center font-bold text-[#f0d99a]">
                              💎 仙晶寶藏
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}


// =========================
// 上方統計卡片
// =========================
function SummaryCard({
  title,
  value,
  gold = false,
}: {
  title: string;
  value: string;
  gold?: boolean;
}) {
  return (
    <div className="rounded-xl border border-[#29251c] bg-black/75 p-6 backdrop-blur-xl">
      <p className="text-lg text-gray-400">{title}</p>

      <p
        className={`mt-2 text-3xl font-bold ${
          gold ? "text-[#d8b56a]" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
export default function CrystalStats() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#080808] text-white">
          <p className="text-gray-400">
            載入仙晶礦統計資料...
          </p>
        </main>
      }
    >
      <CrystalStatsContent />
    </Suspense>
  );
}