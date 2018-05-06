import * as React from "react";
//import "./FilePreview.css";
import { GridList, GridTile } from "material-ui/GridList";
import IconButton from "material-ui/IconButton";
import DeleteIcon from "material-ui/svg-icons/action/delete";
import { CSSProperties } from "react";
import { FileInfo } from "../../App";

const styles: { [K: string]: CSSProperties } = {
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    margin: "1rem 0"
  },
  gridList: {
    width: 500,
    height: 450,
    overflowY: "auto"
  }
};

class FilePreview extends React.Component<
  { fileInfo: FileInfo[]; onChange: (f: FileInfo[]) => void },
  any
> {
  render() {
    const subHeader = this.props.fileInfo.length
      ? "Pictures"
      : "Add pictures above";
    return (
      <div>
        <p>{subHeader}</p>
        <div style={styles.root}>
          <GridList cellHeight={180} style={styles.gridList}>
            {this.props.fileInfo.map(file => (
              <GridTile
                key={file.img}
                title={file.title}
                actionIcon={
                  <IconButton onClick={() => this.removeFile(file)}>
                    <DeleteIcon color="white" />
                  </IconButton>
                }
              >
                <img src={file.img} alt={file.title} />
              </GridTile>
            ))}
          </GridList>
        </div>
      </div>
    );
  }

  onChange(value: FileInfo[]) {
    this.props.onChange(value);
  }

  removeFile(file: FileInfo) {
    const index = this.props.fileInfo.findIndex(
      info => info.title === file.title
    );
    if (index > -1) {
      this.props.fileInfo.splice(index, 1);
      this.onChange(this.props.fileInfo);
    }
  }
}

export default FilePreview;
