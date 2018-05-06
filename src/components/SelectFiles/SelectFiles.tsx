/* tslint:disable */
import * as React from "react";
import { RaisedButton } from "material-ui";
import FilePreview from "../FilePreview/FIlePreview";

class SelectFiles extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      fileInfo: this.props.fileInfo || []
    };
  }

  render() {
    let required;
    if (this.hasEnoughFiles()) {
      required = `You have added enough pictures.`;
    } else if (this.state.fileInfo.length < this.props.maxFiles) {
      required = `You have to add ${this.props.maxFiles -
        this.state.fileInfo.length} pictures.`;
    } else {
      required = `You have to remove ${-this.props.maxFiles +
        this.state.fileInfo.length} pictures.`;
    }
    return (
      <div>
        <p>{required}</p>
        <RaisedButton
          label="Add Files"
          primary={true}
          onClick={this.openFileSelect}
        />
        <input
          type="file"
          accept=".jpg, .jpeg, .png"
          multiple
          hidden
          id="file-input"
          onChange={e => this.addFiles(e.target.files)}
        />

        <FilePreview
          fileInfo={this.state.fileInfo}
          onChange={fileInfo => this.setState({ fileInfo })}
        />
      </div>
    );
  }

  openFileSelect() {
    const fileInput = document.getElementById("file-input");
    fileInput.click();
  }

  addFiles(addedFiles) {
    let files = this.state.files
      .concat(...addedFiles)
      .filter(
        (item, i, ar) => ar.findIndex(file => file.name === item.name) === i
      );
    this.setState({ files });
    this.getFileInfos(files);
  }

  hasEnoughFiles() {
    return this.state.fileInfo.length === this.props.maxFiles;
  }

  getFileInfos(files) {
    const self = this;
    files
      .filter(
        file => !this.state.fileInfo.find(info => info.title === file.name)
      )
      .forEach(file => {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          self.addFileInfo({
            img: reader.result,
            title: file.name,
            added: new Date()
          });
        });
        reader.readAsDataURL(file);
      });
  }

  addFileInfo(info) {
    const newFileInfo = [...this.state.fileInfo, info].sort(
      (a, b) => b.added - a.added
    );
    this.setState({ fileInfo: newFileInfo });
    this.props.onChange(newFileInfo);
  }
}

export default SelectFiles;
