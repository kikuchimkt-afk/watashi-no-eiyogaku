import "./style.css";
import { LETTERS, SOURCE_NOTE, universities } from "./data.js";
import { generateEssay } from "./generate.js";
import { COMPASS_URL, HOME_STRIP, questionPhoto } from "./photos.js";

const root = document.querySelector("#app");

const state = {
  screen: "home",
  universityId: null,
  step: 0,
  answers: [],
  essay: null,
  copied: false,
};

function setState(patch) {
  Object.assign(state, patch);
  render();
}

function currentUniversity() {
  return universities[state.universityId];
}

function startUniversity(universityId) {
  setState({
    screen: "quiz",
    universityId,
    step: 0,
    answers: [],
    essay: null,
    copied: false,
  });
  window.scrollTo(0, 0);
}

function choose(optionId) {
  const university = currentUniversity();
  const answers = state.answers.slice(0, state.step);
  answers[state.step] = optionId;

  if (state.step >= university.questions.length - 1) {
    setState({
      answers,
      essay: generateEssay(state.universityId, answers),
      screen: "result",
      copied: false,
    });
    window.scrollTo(0, 0);
    return;
  }

  setState({ answers, step: state.step + 1, copied: false });
  window.scrollTo(0, 0);
}

function goBack() {
  if (state.screen === "result") {
    setState({
      screen: "quiz",
      step: currentUniversity().questions.length - 1,
      copied: false,
    });
    window.scrollTo(0, 0);
    return;
  }
  if (state.step === 0) {
    setState({ screen: "home", universityId: null, answers: [], copied: false });
    window.scrollTo(0, 0);
    return;
  }
  setState({ step: state.step - 1, copied: false });
}

async function copyEssay() {
  if (!state.essay) return;
  try {
    await navigator.clipboard.writeText(state.essay.text);
    setState({ copied: true });
  } catch {
    window.prompt("コピーできない場合は、ここから選んでコピーしてください。", state.essay.text);
  }
}

function downloadEssay() {
  if (!state.essay) return;
  const blob = new Blob([state.essay.text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${state.essay.university.fileStem}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function topbar(rightLabel) {
  return `
    <header class="topbar">
      <div class="brand">
        <h1>リカキソ志望理由</h1>
        <span class="tag">${escapeHtml(rightLabel)}</span>
      </div>
    </header>
  `;
}

function renderHome() {
  return `
    <div class="wrap">
      ${topbar("2028年度入学検討")}
      <p class="sub">
        <a class="sister" href="${COMPASS_URL}">大学比較は リカキソ栄養コンパス →</a>
      </p>
      <p class="sub">
        4択に答えるだけで、兵庫県立大学と奈良女子大学が求める学生像に沿った
        <strong>志望理由の下書き</strong>ができるよ。高2のいま受ける
        <strong>2028年度（令和10年度）</strong>入学が対象／確認日：2026年9月18日
      </p>
      <section class="hero">
        <div class="hero-photo">
          <img src="images/hero-write.png" alt="志望理由書を書く女子高校生" />
        </div>
        <div>
          <p class="eyebrow">Statement of purpose</p>
          <h2 class="hero-title">4択から、<mark>わたしの志望理由</mark>。</h2>
          <p class="hero-lede">
            関心の入口、実践と研究、得意な教科の使い方を順に聞くよ。提出用の完成稿ではなく、面談と清書のための下書きだよ。
          </p>
        </div>
      </section>
      <section class="photo-strip" aria-label="フォトギャラリー">
        <div class="ps-head">
          <p class="eyebrow">Photo story</p>
          <h2>いまの関心から、下書きへ</h2>
        </div>
        <div class="photo-scroll">
          ${HOME_STRIP.map(
            (item) => `
              <figure class="photo-card">
                <div class="ph-img">
                  <img src="${item.src}" alt="${escapeHtml(item.alt)}" />
                  <span class="num">${item.num}</span>
                  <span class="cat">${escapeHtml(item.cat)}</span>
                </div>
                <figcaption>${escapeHtml(item.caption)}</figcaption>
              </figure>
            `,
          ).join("")}
        </div>
      </section>
      <div class="uni-panel">
        ${Object.values(universities)
          .map(
            (university) => `
              <button class="uni-card" type="button" data-start="${university.id}">
                <div class="cover">
                  <img src="${university.photo}" alt="${escapeHtml(university.tagline)}" />
                  <span class="kicker">${escapeHtml(university.kicker)}</span>
                </div>
                <div class="body">
                  <h2>${escapeHtml(university.name)}</h2>
                  <p class="tagline">${escapeHtml(university.tagline)}</p>
                  <p>${escapeHtml(university.blurb)}</p>
                  <div class="dept">${escapeHtml(university.faculty)}　${escapeHtml(university.dept)}</div>
                </div>
              </button>
            `,
          )
          .join("")}
      </div>
      <footer class="disclaimer">
        <p>${escapeHtml(SOURCE_NOTE)}</p>
      </footer>
    </div>
  `;
}

function renderQuiz() {
  const university = currentUniversity();
  const question = university.questions[state.step];
  const total = university.questions.length;
  const selected = state.answers[state.step];
  const percent = `${((state.step + 1) / total) * 100}%`;
  const photo = questionPhoto(university.id, question.id);

  return `
    <div class="wrap">
      ${topbar(`${state.step + 1} / ${total}`)}
      <div class="quiz-photo">
        <img src="${photo}" alt="" />
      </div>
      <div class="quiz-meta">
        <p class="eyebrow" style="margin:0">${escapeHtml(university.name)}</p>
        <div class="progress" aria-hidden="true"><span style="--p:${percent}"></span></div>
      </div>
      <h2 class="q-title">${escapeHtml(question.title)}</h2>
      <p class="q-help">${escapeHtml(question.help)}</p>
      <div class="choices">
        ${question.options
          .map((option, index) => {
            const on = selected === option.id ? " is-on" : "";
            return `
              <button class="choice${on}" type="button" data-choice="${option.id}">
                <span class="letter">${LETTERS[index]}</span>
                <span>${escapeHtml(option.label)}</span>
              </button>
            `;
          })
          .join("")}
      </div>
      <div class="quiz-nav">
        <button class="ghost" type="button" data-back>もどる</button>
        <div class="hint">いちばん近いものを選んでね</div>
      </div>
    </div>
  `;
}

function renderResult() {
  const essay = state.essay;
  const university = essay.university;
  return `
    <div class="wrap">
      ${topbar(`${essay.chars}字`)}
      <article class="paper">
        <div class="cover">
          <img src="images/draft-done.png" alt="志望理由の下書きができた女子高校生" />
        </div>
        <div class="inner">
          <p class="eyebrow">Statement of purpose / draft</p>
          <h2>志望理由書（簡易下書き）</h2>
          <div class="chars">${escapeHtml(university.name)}　${essay.chars}字</div>
          <p class="essay">${escapeHtml(essay.text)}</p>
        </div>
      </article>
      <section class="side">
        <h3>この文章が表現している学生像</h3>
        <p class="ideal">${escapeHtml(university.idealLead)}</p>
        <ul class="traits">
          ${essay.traits.map((trait) => `<li>${escapeHtml(trait.label)}</li>`).join("")}
        </ul>
        <div class="actions">
          <button class="solid" type="button" data-copy>${state.copied ? "コピーしたよ" : "文章をコピー"}</button>
          <button class="ghost" type="button" data-download>テキスト保存</button>
          <button class="ghost" type="button" data-back>答えを見直す</button>
          <button class="ghost" type="button" data-home>大学を選び直す</button>
        </div>
        ${state.copied ? `<div class="toast">クリップボードにコピーしたよ。</div>` : ""}
        <h3>選択の記録</h3>
        <ul class="review">
          ${essay.review
            .map(
              (item) => `
                <li>
                  <div class="kicker">${escapeHtml(item.kicker)}　${escapeHtml(item.letter)}</div>
                  <p>${escapeHtml(item.answer)}</p>
                </li>
              `,
            )
            .join("")}
        </ul>
        <p class="warn">
          実体験していない活動・受賞・実習は書き足さないでね。「入れば管理栄養士になれる」「文系だから理科は不要」「兵庫県立は実習だけ・奈良女子は研究だけ」といった表現は使っていないよ。６年一貫は希望者の接続制度で、全員進学ではないよ。2028年度の募集要項は大学公式で再確認してね。
        </p>
      </section>
    </div>
  `;
}

function render() {
  if (state.screen === "quiz") root.innerHTML = renderQuiz();
  else if (state.screen === "result") root.innerHTML = renderResult();
  else root.innerHTML = renderHome();
}

root.addEventListener("click", (event) => {
  const start = event.target.closest("[data-start]");
  if (start) {
    startUniversity(start.dataset.start);
    return;
  }
  const choice = event.target.closest("[data-choice]");
  if (choice) {
    choose(choice.dataset.choice);
    return;
  }
  if (event.target.closest("[data-back]")) {
    goBack();
    return;
  }
  if (event.target.closest("[data-home]")) {
    setState({
      screen: "home",
      universityId: null,
      step: 0,
      answers: [],
      essay: null,
      copied: false,
    });
    window.scrollTo(0, 0);
    return;
  }
  if (event.target.closest("[data-copy]")) {
    copyEssay();
    return;
  }
  if (event.target.closest("[data-download]")) {
    downloadEssay();
  }
});

window.addEventListener("keydown", (event) => {
  if (state.screen !== "quiz") return;
  if (["INPUT", "TEXTAREA"].includes(event.target.tagName)) return;
  const map = { 1: "a", 2: "b", 3: "c", 4: "d", a: "a", b: "b", c: "c", d: "d" };
  const optionId = map[event.key.toLowerCase()];
  if (optionId) {
    event.preventDefault();
    choose(optionId);
  }
  if (event.key === "Backspace") {
    event.preventDefault();
    goBack();
  }
});

render();
