import { Plus, Play, Info } from "lucide-react";
import type { Content } from "@/lib/mockData";

export default function Hero({ content }: { content: Content }) {
  return (
    <section className="relative h-[85vh] min-h-[560px] w-full overflow-hidden">
      <img
        src={content.backdropUrl}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />

      <div className="relative z-10 flex h-full max-w-2xl flex-col justify-end px-4 pb-24 md:px-12">
        <span className="mb-3 inline-block w-fit rounded bg-accent/90 px-2 py-0.5 text-xs font-bold uppercase tracking-wider">
          {content.type === "TV" ? "시리즈" : "영화"}
        </span>
        <h1 className="mb-4 text-4xl font-black leading-tight md:text-6xl">
          {content.title}
        </h1>
        <div className="mb-4 flex items-center gap-3 text-sm text-white/80">
          <span className="font-semibold text-green-400">
            {Math.round(content.voteAverage * 10)}% 일치
          </span>
          <span>{content.releaseDate.slice(0, 4)}</span>
          <span className="rounded border border-white/40 px-1.5 text-xs">HD</span>
        </div>
        <p className="mb-6 line-clamp-3 text-base text-white/90 md:text-lg">
          {content.overview}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 rounded bg-white px-6 py-2.5 font-semibold text-black transition hover:bg-white/85">
            <Play size={18} fill="currentColor" />
            기록 보기
          </button>
          <button className="flex items-center gap-2 rounded bg-white/20 px-6 py-2.5 font-semibold text-white backdrop-blur transition hover:bg-white/30">
            <Plus size={18} />
            컬렉션 추가
          </button>
          <button
            aria-label="상세 정보"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/40 text-white/90 transition hover:border-white"
          >
            <Info size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
