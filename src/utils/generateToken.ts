import shortid from 'shortid';

function generateToken(len: number): string {
  const possible = `${0xffffffff}`;
  const length = len || 6;

  let text = ``;

  for (let i = 0; i < length; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

// generate short id of 7-14 length
function generateInteractionShortId(): string {
  return shortid.generate();
}

export { generateToken, generateInteractionShortId };
