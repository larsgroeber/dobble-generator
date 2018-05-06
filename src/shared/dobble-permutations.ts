/* tslint:disable */
const _ = require("lodash");

export class DobblePermutations {
  getNonHeadersForCard(
    indexHeader: number,
    indexCardInBlock: number,
    nonHeaders: number[],
    nonHeaderPartLength: number
  ) {
    const result = [];
    for (let i = 0; i < nonHeaderPartLength; i++) {
      const pos =
        indexHeader === 0
          ? i + indexCardInBlock * nonHeaderPartLength
          : i * nonHeaderPartLength +
            (i * (indexHeader - 1) + indexCardInBlock) % nonHeaderPartLength;
      result.push(nonHeaders[pos]);
    }
    return result;
  }

  createSet(cardLength: number): number[][] {
    const symbolsLength = cardLength * cardLength - cardLength + 1;
    const result: number[][] = [];
    const symbols = [
      ...Array.apply(null, { length: symbolsLength }).map(Number.call, Number)
    ];

    const blockHeaders = symbols.slice(0, cardLength);
    const nonHeaders = symbols.slice(cardLength);
    const nonHeaderPartLength = cardLength - 1;

    result.push(blockHeaders);

    blockHeaders.forEach((header, index) => {
      for (let i = 0; i < nonHeaderPartLength; i++) {
        result.push([
          header,
          ...this.getNonHeadersForCard(
            index,
            i,
            nonHeaders,
            nonHeaderPartLength
          )
        ]);
      }
    });

    return result;
  }

  isSetCorrect(set: number[][]) {
    return set.every(card =>
      set.filter(c => c !== card).every(other => {
        const r = _.intersection(other, card).length === 1;
        if (!r) {
          console.error(`Result ${card} does not match ${other}!`);
        }
        return r;
      })
    );
  }
}
