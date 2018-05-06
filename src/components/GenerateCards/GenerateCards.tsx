/* tslint:disable */
import * as React from "react";
import { PdfGenerator } from "../../shared/pdf-generator";
import { FileInfo } from "../../App";
import { Snackbar } from "material-ui";

const style: { [k: string]: React.CSSProperties } = {
  pdfView: {
    width: "100%",
    height: "480px"
  }
};

class GenerateCards extends React.Component<any, any> {
  fileInfo: FileInfo[];
  itemsPerCard: number;
  pdf: PdfGenerator;

  constructor(props) {
    super(props);
    this.fileInfo = this.props.fileInfo;
    this.itemsPerCard = this.props.itemsPerCard;
    this.pdf = new PdfGenerator(this.fileInfo, this.itemsPerCard);
    this.state = {
      pdfUri: null,
      generatingCards: false,
      doneGeneratingCards: false
    };
  }

  componentDidMount() {
    this.setState({ generatingCards: true });
    setTimeout(() => {
      const pdfUri = this.pdf.generatePdf();
      this.setState({
        pdfUri,
        generatingCards: false,
        doneGeneratingCards: true
      });
    }, 100);
  }

  render() {
    return (
      <div>
        <object data={this.state.pdfUri} style={style.pdfView} />
        <Snackbar
          open={this.state.generatingCards}
          message="Generating cards..."
          autoHideDuration={4000}
        />
        <Snackbar
          open={this.state.doneGeneratingCards}
          message="Done generating cards."
          autoHideDuration={4000}
        />
      </div>
    );
  }
}

export default GenerateCards;
