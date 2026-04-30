"use client";

import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PosterCard from "./PosterCard";
import type { Content } from "@/lib/mockData";

type Props = {
  title: string;
  items: Content[];
};

export default function ContentRow({ title, items }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps"
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="group/row relative py-3">
      <h2 className="mb-3 px-4 text-lg font-bold tracking-tight md:px-12 md:text-xl">
        {title}
      </h2>

      <div className="relative">
        <div className="embla row-fade-mask px-4 md:px-12" ref={emblaRef}>
          <div className="embla__container">
            {items.map((item) => (
              <div key={item.id} className="embla__slide">
                <PosterCard content={item} />
              </div>
            ))}
          </div>
        </div>

        <button
          aria-label="이전"
          onClick={scrollPrev}
          className="absolute left-0 top-0 z-10 hidden h-full w-12 items-center justify-center bg-black/40 opacity-0 transition-opacity hover:bg-black/60 group-hover/row:opacity-100 md:flex"
        >
          <ChevronLeft size={28} />
        </button>
        <button
          aria-label="다음"
          onClick={scrollNext}
          className="absolute right-0 top-0 z-10 hidden h-full w-12 items-center justify-center bg-black/40 opacity-0 transition-opacity hover:bg-black/60 group-hover/row:opacity-100 md:flex"
        >
          <ChevronRight size={28} />
        </button>
      </div>
    </section>
  );
}
