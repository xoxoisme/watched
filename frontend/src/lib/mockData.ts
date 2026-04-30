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

const POSTER = (id: string) =>
  `https://image.tmdb.org/t/p/w500${id}`;
const BACKDROP = (id: string) =>
  `https://image.tmdb.org/t/p/original${id}`;

export const heroContent: Content = {
  id: 1,
  title: "오징어 게임",
  posterUrl: POSTER("/dDlEmu3EZ0Pwz5g4QPmlk89A2vM.jpg"),
  backdropUrl: BACKDROP("/oaGvjB0DvdhXSOa9CBNgYAQ4kvc.jpg"),
  releaseDate: "2021-09-17",
  voteAverage: 7.8,
  type: "TV",
  overview:
    "456억 원의 상금이 걸린 의문의 서바이벌에 참가한 사람들이 최후의 승자가 되기 위해 목숨을 걸고 극한의 게임에 도전하는 이야기."
};

const make = (
  id: number,
  title: string,
  poster: string,
  rating: number,
  type: "MOVIE" | "TV" = "MOVIE"
): Content => ({
  id,
  title,
  posterUrl: POSTER(poster),
  backdropUrl: BACKDROP(poster),
  releaseDate: "2024-01-01",
  voteAverage: rating,
  type,
  overview: ""
});

export const watchingNow: Content[] = [
  make(101, "더 글로리", "/8wwXPG22aNMpPGuXnfm3galoxbI.jpg", 8.4, "TV"),
  make(102, "무빙", "/lhPZ4kAg9c6CyHrXjE4UVPV8GlI.jpg", 8.7, "TV"),
  make(103, "지옥", "/9WpCarktUDvyiI4lU2gcqRA0u9w.jpg", 7.5, "TV"),
  make(104, "사랑의 불시착", "/iSerSYBtGnfutBvrGpgWGUkqJsA.jpg", 8.6, "TV"),
  make(105, "이상한 변호사 우영우", "/uy08wPSFjaoZ0HHTYrAcbbzM5wn.jpg", 8.7, "TV"),
  make(106, "도깨비", "/d8UHnoTGyQjCnrjlCCe5kQF35Qd.jpg", 8.5, "TV"),
  make(107, "킹덤", "/7yyFEsuaLGTPul5UkHc5BhXnQ0k.jpg", 8.3, "TV"),
  make(108, "스위트홈", "/9d6wAOCKBCjEqdLzAVDi1aP12rN.jpg", 7.8, "TV")
];

export const myFavorites: Content[] = [
  make(201, "기생충", "/igw938inb6Fc7altL2EpwJpljh.jpg", 8.5),
  make(202, "헤어질 결심", "/4GgMu2wO3GebebLDDfh14lnUYRC.jpg", 7.4),
  make(203, "올드보이", "/pWDtjs568ZfOTMbURQBYuT4Qxka.jpg", 8.4),
  make(204, "부산행", "/qABuOj0iI4zGWsQYzpJ6fgoxI83.jpg", 7.6),
  make(205, "1987", "/myE4iy1B6MO4XcEhg8gGgX6uYUx.jpg", 7.9),
  make(206, "택시운전사", "/eRRiwrtSKaZxGS2iTzvEVKYMPYK.jpg", 7.8),
  make(207, "곡성", "/dQHPbSXacqVXRMZl9nvgGBYfMuA.jpg", 7.4),
  make(208, "베테랑", "/nDdpTDYVB5j5g0JwhbGKCQzfsuy.jpg", 7.0)
];

export const recommended: Content[] = [
  make(301, "듄: 파트2", "/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg", 8.3),
  make(302, "오펜하이머", "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg", 8.1),
  make(303, "바비", "/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg", 7.0),
  make(304, "인터스텔라", "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg", 8.4),
  make(305, "테넷", "/aCIFMriQh8rvhxpN1IWGgvH0Tlg.jpg", 7.2),
  make(306, "조커", "/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg", 8.1),
  make(307, "미드소마", "/7LEI8ulZzO5gy9Ww2NVCrKmHeDZ.jpg", 7.0),
  make(308, "위플래쉬", "/6uSPcdGNA2A6vJmCagXkvnutegs.jpg", 8.5)
];

export const trending: Content[] = [
  make(401, "이태원 클라쓰", "/ai3ovhMrW5QwaP0Evp6RXQGdYWv.jpg", 8.2, "TV"),
  make(402, "마이 데몬", "/gvNxIRgmJ60klImGBE5hC6TNhs5.jpg", 8.1, "TV"),
  make(403, "선재 업고 튀어", "/iRzDUNrnAQTuJG9D0xqkJZqFnxp.jpg", 8.7, "TV"),
  make(404, "피지컬: 100", "/k1aiUokN2Vv5GE76b5CErqiFJmA.jpg", 7.6, "TV"),
  make(405, "환혼", "/nIoaYprdQA5l3X1cNg59fwELGxL.jpg", 8.5, "TV"),
  make(406, "재벌집 막내아들", "/1IB3Nkl4YjOVwFiXQ7yUuYhHpDl.jpg", 8.5, "TV"),
  make(407, "악귀", "/c5GPwIvRAy53hJuLcebnK6BLnPi.jpg", 7.9, "TV"),
  make(408, "마스크걸", "/v2Fk2xHHcoyhDAkj0w4sX59LtnN.jpg", 7.4, "TV")
];
