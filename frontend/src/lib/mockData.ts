import type { PosterItem } from "@/components/PosterCard";

export type Content = {
  id: number;
  title: string;
  posterUrl: string;
  backdropUrl: string;
  releaseDate: string;
  voteAverage: number;
  type: "MOVIE" | "TV";
  overview: string;
};

export const toPosterItem = (c: Content): PosterItem => ({
  id: c.id,
  href: `/contents/${c.id}?type=${c.type}`,
  title: c.title,
  posterUrl: c.posterUrl,
  year: c.releaseDate.slice(0, 4),
  rating: c.voteAverage,
});

const POSTER = (path: string) => `https://image.tmdb.org/t/p/w500${path}`;
const BACKDROP = (path: string) => `https://image.tmdb.org/t/p/original${path}`;

export const heroContent: Content = {
  id: 936075,
  title: "마이클",
  posterUrl: POSTER("/piMZqtd0gGS7OgkhDwiQ7vVViBQ.jpg"),
  backdropUrl: BACKDROP("/xBT0oNq6rsTFv4SxG5uGRIEOrq6.jpg"),
  releaseDate: "2026-04-22",
  voteAverage: 7.6,
  type: "MOVIE",
  overview:
    "팝의 황제 마이클 잭슨의 삶과 음악, 그리고 한 시대를 만든 천재 아티스트의 빛과 그늘을 그린 전기 영화."
};

type T = "MOVIE" | "TV";

const make = (
  id: number,
  title: string,
  poster: string,
  backdrop: string,
  rating: number,
  date: string,
  type: T
): Content => ({
  id,
  title,
  posterUrl: POSTER(poster),
  backdropUrl: BACKDROP(backdrop),
  releaseDate: date,
  voteAverage: rating,
  type,
  overview: ""
});

export const watchingNow: Content[] = [
  make(76479, "더 보이즈", "/ilSwgC9i8KsnXEv9aH8MUcaWvbW.jpg", "/bq28ajZaoMyzEIm6REelqyqtEDZ.jpg", 8.4, "2019-07-25", "TV"),
  make(85552, "유포리아", "/cQMOyNLS1RsQIMlmVR6MEk2fvii.jpg", "/mez2Z3WqlPKNXpi7mWoiiE5guE9.jpg", 8.3, "2019-06-16", "TV"),
  make(95557, "인빈시블", "/pXdOMSrlxc2z4scUsYEPgo0KyV7.jpg", "/9qrroces8C6R9aKr08hACNPVXdZ.jpg", 8.6, "2021-03-25", "TV"),
  make(79744, "더 루키", "/7LUiqnZFX9JXYZtRpzv8n7taKV.jpg", "/6iNWfGVCEfASDdlNb05TP5nG0ll.jpg", 8.5, "2018-10-16", "TV"),
  make(202555, "데어데블: 본 어게인", "/qj0N5af5CHGY0MdZehgEzf6WBV3.jpg", "/qrTAc0ZtQ859Qu5O8cixJzNJpQs.jpg", 8.0, "2025-03-04", "TV"),
  make(224263, "기묘한 이야기: 1985년에는", "/iSQo8oeAUb0EjkWykPjDLxMOVlQ.jpg", "/rclsLNvqaoqatO2O0S5ajlmk6yf.jpg", 7.2, "2026-04-23", "TV"),
  make(37854, "원피스", "/qHjXsSUuolEtbgvYPzRjAuB1VHE.jpg", "/4Mt7WHox67uJ1yErwTBFcV8KWgG.jpg", 8.7, "1999-10-20", "TV"),
  make(124364, "프롬", "/4CMvJXoenv5LeMLcPdPpAT98wpS.jpg", "/auyEi4Xho43HFvVQnd42LzqBdiV.jpg", 8.2, "2022-02-20", "TV")
];

export const myFavorites: Content[] = [
  make(4614, "NCIS", "/mBcu8d6x6zB1el3MPNl7cZQEQ31.jpg", "/nn3SuLTO4hum8yAxaY4ql8h6kRk.jpg", 7.6, "2003-09-23", "TV"),
  make(5920, "멘탈리스트", "/acYXu4KaDj1NIkMgObnhe4C4a0T.jpg", "/q3pCsNvJ7CmdJUz2sJEEUY3pOPC.jpg", 8.3, "2008-09-23", "TV"),
  make(1622, "수퍼내추럴", "/dpkz4yiXoaYvYP2WoRP09UmrAh6.jpg", "/ro0tlgnsco4SwbdAgmscLkSlMSL.jpg", 8.3, "2005-09-13", "TV"),
  make(1416, "그레이 아나토미", "/lCUvpSvjAPU82HvJ8XfR74Chv5r.jpg", "/jP0Rhj9OTPDAwQlHQwOLFDdeE8t.jpg", 8.2, "2005-03-27", "TV"),
  make(2734, "로 앤 오더: 성범죄전담반", "/iofokHZoUB4Qhik4PflvJl8TT6a.jpg", "/obtdxPgmfykYwVnvuYXC5f2xKlQ.jpg", 7.9, "1999-09-20", "TV"),
  make(549, "로 앤 오더", "/haJ9eHytVO3H3JooMJG1DiWwDNm.jpg", "/tc7canPSAn2X14hYi6Rl3gZm1o4.jpg", 7.3, "1990-09-13", "TV"),
  make(285838, "기리고", "/oKSt05GBc2ZZ5G2BxTqLikNml1V.jpg", "/zV9WYOfFr4MAnzXXD8PR5J6JnN3.jpg", 7.7, "2026-04-24", "TV"),
  make(83533, "아바타: 불과 재", "/dU7bFp3dbFUZxzP8OVsBLWb93QP.jpg", "/iN41Ccw4DctL8npfmYg1j5Tr1eb.jpg", 7.4, "2025-12-17", "MOVIE")
];

export const recommended: Content[] = [
  make(1318447, "정점", "/wGHGVAJGTn2BqsuFfPK8lzPiKjH.jpg", "/p8777bPIlyFYcjqP2hU8htoz1RG.jpg", 6.5, "2026-04-24", "MOVIE"),
  make(1314481, "악마는 프라다를 입는다 2", "/28A1VUDML1RzENYNtIU1WkBLT9V.jpg", "/y3fQa7pytlysovXzovpXc1OQlTW.jpg", 6.6, "2026-04-29", "MOVIE"),
  make(1292695, "데이 윌 킬 유", "/6oI4oQKTWMVUlr8Ivqydp28Ruu6.jpg", "/qnTdOizsXBzYu3uIbfhHSfE29TE.jpg", 6.5, "2026-03-25", "MOVIE"),
  make(1327819, "호퍼스", "/vJu9THzQ26Q5sWOVnhOkuRH5M1P.jpg", "/u53UYu5XG2hNgWGvs3xGhAVzypl.jpg", 7.7, "2026-03-04", "MOVIE"),
  make(687163, "프로젝트 헤일메리", "/qqGpVVZk2KD1lAvccgTU4Z6nh1H.jpg", "/8Tfys3mDZVp4tNoH2ktm06a0Tau.jpg", 8.2, "2026-03-15", "MOVIE"),
  make(1198994, "직장상사 길들이기", "/kpOHAiCiIBa0yPtOqSp99NxhwUF.jpg", "/gCmfeKmEAZBP5gcXpiqb0gii9rS.jpg", 7.0, "2026-01-28", "MOVIE"),
  make(1226863, "슈퍼 마리오 갤럭시", "/knaXOBDBecVBWZVup3zXaOoy23v.jpg", "/kxQiIJ4gVcD3K6o14MJ72p5yRcE.jpg", 6.7, "2026-04-01", "MOVIE"),
  make(1613798, "복수", "/26milocWotfItrjwnadk4gyHwyi.jpg", "/jJmlCFi5EjpH5vHmOczRiVDm0qS.jpg", 7.0, "2026-02-26", "MOVIE")
];

export const trending: Content[] = [
  make(936075, "마이클", "/piMZqtd0gGS7OgkhDwiQ7vVViBQ.jpg", "/xBT0oNq6rsTFv4SxG5uGRIEOrq6.jpg", 7.6, "2026-04-22", "MOVIE"),
  make(76479, "더 보이즈", "/ilSwgC9i8KsnXEv9aH8MUcaWvbW.jpg", "/bq28ajZaoMyzEIm6REelqyqtEDZ.jpg", 8.4, "2019-07-25", "TV"),
  make(1318447, "정점", "/wGHGVAJGTn2BqsuFfPK8lzPiKjH.jpg", "/p8777bPIlyFYcjqP2hU8htoz1RG.jpg", 6.5, "2026-04-24", "MOVIE"),
  make(85552, "유포리아", "/cQMOyNLS1RsQIMlmVR6MEk2fvii.jpg", "/mez2Z3WqlPKNXpi7mWoiiE5guE9.jpg", 8.3, "2019-06-16", "TV"),
  make(95557, "인빈시블", "/pXdOMSrlxc2z4scUsYEPgo0KyV7.jpg", "/9qrroces8C6R9aKr08hACNPVXdZ.jpg", 8.6, "2021-03-25", "TV"),
  make(202555, "데어데블: 본 어게인", "/qj0N5af5CHGY0MdZehgEzf6WBV3.jpg", "/qrTAc0ZtQ859Qu5O8cixJzNJpQs.jpg", 8.0, "2025-03-04", "TV"),
  make(37854, "원피스", "/qHjXsSUuolEtbgvYPzRjAuB1VHE.jpg", "/4Mt7WHox67uJ1yErwTBFcV8KWgG.jpg", 8.7, "1999-10-20", "TV"),
  make(224263, "기묘한 이야기: 1985년에는", "/iSQo8oeAUb0EjkWykPjDLxMOVlQ.jpg", "/rclsLNvqaoqatO2O0S5ajlmk6yf.jpg", 7.2, "2026-04-23", "TV")
];
