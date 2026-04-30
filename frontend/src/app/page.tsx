import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ContentRow from "@/components/ContentRow";
import {
  heroContent,
  watchingNow,
  myFavorites,
  recommended,
  trending
} from "@/lib/mockData";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero content={heroContent} />

      <div className="-mt-24 space-y-2 pb-24">
        <ContentRow title="시청 중인 콘텐츠" items={watchingNow} />
        <ContentRow title="내 즐겨찾기" items={myFavorites} />
        <ContentRow title="당신을 위한 추천" items={recommended} />
        <ContentRow title="지금 뜨는 콘텐츠" items={trending} />
      </div>
    </main>
  );
}
