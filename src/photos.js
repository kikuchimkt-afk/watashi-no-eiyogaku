export const COMPASS_URL = "https://rikakiso-eiyou-compass.vercel.app/";

export const HOME_STRIP = [
  {
    src: "images/genzai-benkyo.jpg",
    num: "01",
    cat: "いま",
    caption: "いまの関心を、栄養の言葉に",
    alt: "教室で教科書を開いて勉強する女子高校生",
  },
  {
    src: "images/genzai-eiyo.jpg",
    num: "02",
    cat: "いま",
    caption: "食に、ちょっとワクワク",
    alt: "キッチンで食品の栄養成分表示を読む女子高校生",
  },
  {
    src: "images/hyogo-life.png",
    num: "03",
    cat: "兵庫",
    caption: "暮らしの先まで、栄養を考える",
    alt: "食事を盛り付けて人を支える大学生",
  },
  {
    src: "images/nara-lab.png",
    num: "04",
    cat: "奈良",
    caption: "なぜ？を栄養学で確かめる",
    alt: "食品科学の実験をする女子大学生",
  },
  {
    src: "images/draft-done.png",
    num: "05",
    cat: "下書き",
    caption: "栄養学への、わたしの理由",
    alt: "志望理由の下書きを持ってほほえむ女子高校生",
  },
];

export const QUESTION_PHOTOS = {
  hyogo: {
    origin: "images/genzai-eiyo.jpg",
    who: "images/hyogo-life.png",
    scope: "images/hyogo-life.png",
    science: "images/daigaku-jikken.jpg",
    strength: "images/genzai-benkyo.jpg",
    learning: "images/daigaku-campus.jpg",
    future: "images/mirai-eiyoushi.jpg",
    why: "images/hyogo-life.png",
  },
  nara: {
    question: "images/nara-lab.png",
    foundation: "images/genzai-benkyo.jpg",
    english: "images/genzai-benkyo.jpg",
    depth: "images/daigaku-jikken.jpg",
    "people-science": "images/genzai-eiyo.jpg",
    mindset: "images/nara-lab.png",
    future: "images/mirai-eiyoushi.jpg",
    why: "images/nara-lab.png",
  },
};

export function questionPhoto(universityId, questionId) {
  return QUESTION_PHOTOS[universityId]?.[questionId] ?? "images/hero-write.png";
}
