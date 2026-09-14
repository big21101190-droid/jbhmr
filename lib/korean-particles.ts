const HANGUL_SYLLABLE_START = 0xac00;
const HANGUL_SYLLABLE_END = 0xd7a3;
const HANGUL_FINAL_CONSONANT_COUNT = 28;

const digitHasFinalConsonant: Record<string, boolean> = {
  '0': true,
  '1': true,
  '2': false,
  '3': true,
  '4': false,
  '5': false,
  '6': true,
  '7': true,
  '8': true,
  '9': false,
};

function lastMeaningfulCharacter(value: string) {
  return value
    .trim()
    .match(/[0-9A-Za-z\uAC00-\uD7A3](?=[^0-9A-Za-z\uAC00-\uD7A3]*$)/)?.[0];
}

export function hasKoreanFinalConsonant(value: string) {
  const character = lastMeaningfulCharacter(value);
  if (!character) return false;
  if (character in digitHasFinalConsonant)
    return digitHasFinalConsonant[character];

  const codePoint = character.codePointAt(0);
  if (
    codePoint === undefined ||
    codePoint < HANGUL_SYLLABLE_START ||
    codePoint > HANGUL_SYLLABLE_END
  )
    return false;

  return (
    (codePoint - HANGUL_SYLLABLE_START) % HANGUL_FINAL_CONSONANT_COUNT !== 0
  );
}

export function withTopicParticle(value: string) {
  return `${value}${hasKoreanFinalConsonant(value) ? '은' : '는'}`;
}

export function withObjectParticle(value: string) {
  return `${value}${hasKoreanFinalConsonant(value) ? '을' : '를'}`;
}

export function repairGeneratedObjectParticle(text: string, value: string) {
  const generatedSuffix = ' 화물 조건';
  const expected = `${withObjectParticle(value)}${generatedSuffix}`;
  return text
    .replaceAll(`${value}을${generatedSuffix}`, expected)
    .replaceAll(`${value}를${generatedSuffix}`, expected);
}
