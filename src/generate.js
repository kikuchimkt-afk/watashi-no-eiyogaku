import { universities } from "./data.js";

function pickOption(university, answers, index) {
  const question = university.questions[index];
  const optionId = answers[index];
  return question.options.find((option) => option.id === optionId);
}

export function countChars(text) {
  return text.replace(/\n/g, "").length;
}

export function generateEssay(universityId, answers) {
  const university = universities[universityId];
  const selected = university.questions.map((_, index) =>
    pickOption(university, answers, index),
  );

  const paragraphs =
    universityId === "nara"
      ? [
          selected[0].sentence + selected[4].sentence,
          selected[1].sentence + selected[2].sentence,
          selected[3].sentence + selected[5].sentence,
          selected[7].sentence,
          selected[6].sentence + university.closing,
        ]
      : [
          selected[0].sentence + selected[1].sentence,
          selected[2].sentence + selected[3].sentence,
          selected[4].sentence + selected[5].sentence,
          selected[7].sentence,
          selected[6].sentence + university.closing,
        ];

  const text = paragraphs.join("\n\n");
  const tagCounts = new Map();
  for (const option of selected) {
    for (const tag of option.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
  }

  const traits = [...tagCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "ja"))
    .map(([label, count]) => ({ label, count }));

  const review = university.questions.map((question, index) => ({
    kicker: question.kicker,
    title: question.title,
    answer: selected[index].label,
    letter: selected[index].id.toUpperCase(),
  }));

  return {
    text,
    paragraphs,
    chars: countChars(text),
    traits,
    review,
    university,
  };
}
