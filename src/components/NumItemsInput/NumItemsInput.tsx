/* tslint:disable */
import * as React from "react";
import TextField from "material-ui/TextField";

class NumItemsInput extends React.Component<any, any> {
  render() {
    let subText = "";
    const value = this.props.value;
    if (value) {
      const numItems = this.getNumCards(value);
      subText = `You will need ${numItems} pictures.`;
    }

    return (
      <div>
        <TextField
          floatingLabelText="Number of items per card"
          type="number"
          value={this.props.value || ""}
          onChange={this.onChange.bind(this)}
        />
        <p>{subText}</p>
      </div>
    );
  }

  onChange(event) {
    const value = event.target.value;
    this.props.onChange(value, this.getNumCards(value));
  }

  getNumCards(itemsPerCard) {
    return itemsPerCard * itemsPerCard - itemsPerCard + 1;
  }
}

export default NumItemsInput;
