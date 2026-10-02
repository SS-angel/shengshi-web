export default function Home() {
  return (
    <main className="min-h-screen bg-[#080808] text-white">

      {/* =========================
          頂部導覽列
      ========================= */}
      <header className="absolute left-0 top-0 z-50 w-full">
        <div className="mx-auto flex h-[120px] max-w-[1600px] px-10">

          {/* 左側：盛世品牌 */}
          <div className="flex h-full shrink-0 items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-[0.15em]">
                盛世天堂二
              </h1>

              <p className="mt-1 text-sm tracking-wider text-[#d8b56a]">
                經典為骨｜創新為魂｜玩家為本｜長期為志
              </p>
            </div>
          </div>

        </div>
      </header>


      {/* =========================
          首頁主視覺 Hero
      ========================= */}
      <section
        className="relative min-h-[680px] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/hero.png')",
        }}
      >

        {/* 底部漸層 */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent" />


        {/* =========================
            Hero 功能按鈕
        ========================= */}
        <div className="absolute bottom-70 left-0 z-10 w-full">
          <div className="mx-auto max-w-[1600px] px-20">

            <div className="flex flex-wrap gap-20">

              {/* 盛世仙晶礦 */}
              <a
                href="/crystal-mine"
                className="
                  rounded-xl
                  border border-[#d8b56a]
                  bg-black/70
                  px-8 py-20
                  text-[30px] font-bold
                  text-[#d8b56a]
                  backdrop-blur-sm
                  transition duration-300
                  hover:bg-[#d8b56a]
                  hover:text-black
                "
              >
                💎盛世仙晶礦
              </a>


              {/* 仙緣抽獎 */}
              <a
                href="/draw"
                className="
                  rounded-xl
                  border border-[#d8b56a]
                  bg-black/70
                  px-12 py-20
                  text-[30px] font-bold
                  text-[#d8b56a]
                  backdrop-blur-sm
                  transition duration-300
                  hover:bg-[#d8b56a]
                  hover:text-black
                "
              >
                🎁仙緣抽獎
              </a>

            </div>

          </div>
        </div>

      </section>

    </main>
  );
}