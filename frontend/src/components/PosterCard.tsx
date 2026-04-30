import { Star } from "lucide-react";
import type { Content } from "@/lib/mockData";

export default function PosterCard({ content }: { content: Content }) {
  return (
    <div className="group relative w-40 shrink-0 cursor-pointer overflow-hidden rounded-md bg-surface transition-transform duration-200 ease-out hover:z-10 hover:scale-110 hover:shadow-2xl md:w-48">
      <div className="aspect-[2/3] w-full overflow-hidden">
        <img
          src={content.posterUrl}
          alt={content.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 px-3 pb-3 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
        <p className="truncate text-sm font-semibold">{content.title}</p>
        <div className="mt-1 flex items-center gap-2 text-xs text-white/80">
          <span className="flex items-center gap-1 text-yellow-400">
            <Star size={12} fill="currentColor" />
            {content.voteAverage.toFixed(1)}
          </span>
          <span>{content.releaseDate.slice(0, 4)}</span>
        </div>
      </div>
    </div>
  );
}
