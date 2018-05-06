import { DobblePermutations } from "./dobble-permutations";
import { FileInfo } from "../App";
const jsPDF = require("jspdf");

interface Point {
  x: number;
  y: number;
}

export class PdfGenerator {
  marginBetweenCards = 5;
  cardsPerLine = 1;
  doc: any;

  width: number;
  height: number;
  cardRadius: number;
  numCardsPerPage: number;
  permutations: number[][];
  picWidth: number;

  constructor(private fileInfo: FileInfo[], private itemsPerCard: number) {
    this.doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4"
    });
    const pageSize = this.doc.internal.pageSize;
    this.width = pageSize.width;
    this.height = pageSize.height;
    this.cardRadius =
      (this.width - this.marginBetweenCards * 3) / (this.cardsPerLine * 2); // two cards side by side
    this.numCardsPerPage = this.numberOfCardsPerPage();
    this.picWidth = this.getPicWidth();

    const dPermutation = new DobblePermutations();
    this.permutations = dPermutation.createSet(itemsPerCard);
    if (!dPermutation.isSetCorrect(this.permutations)) {
      throw Error("Permutations are incorrect!");
    }
  }

  generatePdf() {
    const totalNumPages = Math.ceil(
      this.permutations.length / this.numCardsPerPage
    );
    for (let pageNumber = 0; pageNumber < totalNumPages; pageNumber++) {
      this.createPage(
        this.fileInfo,
        this.permutations.slice(
          pageNumber * this.numCardsPerPage,
          (pageNumber + 1) * this.numCardsPerPage
        )
      );
      this.doc.addPage();
    }
    return this.doc.output("datauristring");
  }

  createPage(fileInfo: FileInfo[], permutations: number[][]) {
    const effRadius = this.marginBetweenCards / 2 + this.cardRadius;
    for (let r = 0; r < this.cardsPerLine; r++) {
      for (let c = 0; c < this.numCardsPerPage / this.cardsPerLine; c++) {
        const center: Point = {
          x: effRadius * (r * 2 + 1),
          y: effRadius * (c * 2 + 1)
        };
        this.doc.circle(center.x, center.y, this.cardRadius);
        this.paintImages(
          fileInfo,
          center,
          permutations[r * this.cardsPerLine + c]
        );
      }
    }
  }

  paintImages(fileInfo: FileInfo[], centerCard: Point, permutation: number[]) {
    permutation.forEach((fileIndex, index) => {
      const img = fileInfo[fileIndex].img;
      const degree = 360 / this.itemsPerCard * index;
      const start = this.transformFromCircularCoords(
        {
          x: centerCard.x - this.picWidth / 2,
          y: centerCard.y - this.picWidth / 2
        },
        degree,
        this.picDistanceFromCenter()
      );
      this.paintImage(
        img,
        start.x,
        start.y,
        this.picWidth,
        this.picWidth,
        degree
      );
    });
  }

  paintImage(img: string, x, y, width, height, degree) {
    img = rotateBase64Image(img, degree);
    console.log;
    this.doc.addImage(img, "png", x, y, width, height);
  }

  transformFromCircularCoords(start: Point, angle, distance): Point {
    angle *= Math.PI / 180;
    return {
      x: start.x + Math.sin(angle) * distance,
      y: start.y + Math.cos(angle) * distance
    };
  }

  picDistanceFromCenter() {
    return this.cardRadius - this.picWidth;
  }

  numberOfCardsPerPage() {
    return (
      Math.floor(
        (this.height - this.marginBetweenCards) /
          (this.cardRadius * 2 + this.marginBetweenCards)
      ) * this.cardsPerLine
    );
  }

  getPicWidth() {
    const angle = 2 * Math.PI / this.itemsPerCard;
    return (
      Math.sqrt(2) /
      (1 + Math.sqrt(2) * Math.sqrt(1 - Math.cos(angle))) *
      this.cardRadius *
      2
    );
  }
}

function rotateBase64Image(base64Image, degree) {
  // create an off-screen canvas
  const offScreenCanvas = document.createElement("canvas");
  const offScreenCanvasCtx = offScreenCanvas.getContext("2d");

  // cteate Image
  var img = new Image();
  img.src = base64Image;

  // set its dimension to rotated size
  offScreenCanvas.height = img.width;
  offScreenCanvas.width = img.height;

  // rotate and draw source image into the off-screen canvas:
  offScreenCanvasCtx.save();
  offScreenCanvasCtx.translate(0, 0);
  offScreenCanvasCtx.rotate(degree * Math.PI / 180);
  offScreenCanvasCtx.drawImage(img, -(img.width / 2), -(img.height / 2));
  offScreenCanvasCtx.restore();

  // encode image to data-uri with base64
  return offScreenCanvas.toDataURL("image/jpeg", 100);
}
