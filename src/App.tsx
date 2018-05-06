/* tslint:disable */
import * as React from "react";
// import logo from './logo.svg';
import "./App.css";
import NumItemsInput from "./components/NumItemsInput/NumItemsInput";
import SelectFiles from "./components/SelectFiles/SelectFiles";
import GenerateCards from "./components/GenerateCards/GenerateCards";
import {
  RaisedButton,
  Step,
  StepContent,
  StepLabel,
  Stepper
} from "material-ui";

export interface FileInfo {
  title: string;
  img: string;
  added: Date;
}

interface State {
  numItemsPerCard: number;
  numPics: number;
  fileInfo: FileInfo[];
  stepIndex: number;
}

class App extends React.Component<any, any> {
  state: State;
  constructor(props: any) {
    super(props);
    this.state = {
      numItemsPerCard: 2,
      numPics: 3,
      fileInfo: [],
      stepIndex: 1
    };
  }

  renderStepActions() {
    let next;
    switch (this.state.stepIndex) {
      case 0:
        return (
          <RaisedButton
            label="Next"
            primary={true}
            disabled={!this.state.numItemsPerCard}
            onClick={() =>
              this.setState({ stepIndex: this.state.stepIndex + 1 })
            }
          />
        );
      case 1:
        next = (
          <RaisedButton
            label="Next"
            primary={true}
            disabled={this.state.fileInfo.length !== this.state.numPics}
            onClick={() =>
              this.setState({ stepIndex: this.state.stepIndex + 1 })
            }
          />
        );
        break;
      default:
    }
    return (
      <div>
        {next}
        <RaisedButton
          label="Back"
          secondary={true}
          onClick={() => this.setState({ stepIndex: this.state.stepIndex - 1 })}
        />
      </div>
    );
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Dobble generator</h1>
        </header>
        <div className="container">
          <Stepper activeStep={this.state.stepIndex} orientation="vertical">
            <Step>
              <StepLabel>Number of items per card</StepLabel>
              <StepContent>
                <NumItemsInput
                  value={this.state.numItemsPerCard}
                  onChange={this.onNumCardsChange.bind(this)}
                />

                {this.renderStepActions()}
              </StepContent>
            </Step>
            <Step>
              <StepLabel>Select files</StepLabel>
              <StepContent>
                <SelectFiles
                  maxFiles={this.state.numPics}
                  fileInfo={this.state.fileInfo}
                  onChange={this.onFileInfoChange.bind(this)}
                />

                {this.renderStepActions()}
              </StepContent>
            </Step>
            <Step>
              <StepLabel>Generate cards</StepLabel>
              <StepContent>
                <GenerateCards
                  fileInfo={this.state.fileInfo}
                  itemsPerCard={this.state.numItemsPerCard}
                />

                {this.renderStepActions()}
              </StepContent>
            </Step>
          </Stepper>
        </div>
      </div>
    );
  }

  onNumCardsChange(numItemsPerCard: number, numPics: number) {
    this.setState({ numItemsPerCard, numPics });
  }

  onFileInfoChange(fileInfo: FileInfo) {
    this.setState({ fileInfo });
  }
}

export default App;
