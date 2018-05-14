import React from "react";
import Radium from "radium";
import history from "../../history";
import { colors, constants } from "../../style";

// parses a file and returns all params found in the file that the user 
// then will need to set
const getParamsFromFile = (file) => {
  return new Promise((resolve, reject) => {
    // read the file
    var reader = new FileReader();
    reader.readAsText(file, "UTF-8");

    reader.onload = (evt) => {
      const params = {};
      const code = evt.target.result;
      const re = /game.param\((['"])(.*)\1\)/g; // create regex to pluck out the param name 
      let match = re.exec(code);

      // iterate over matches
      while (match != null) {
        // set the param as a key in the params we have
        params[match[2]] = { type: null, value: null }; 
        match = re.exec(code);
      }
      resolve(params);
    }

    reader.onerror = (evt) => {
      reject("Couldn't read the file");
    }

  });
};

class BotParamSelect extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      params: {},
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.file != this.props.file) {
      getParamsFromFile(nextProps.file).then((params) => {
        this.mergeParamsFromFile(params);
      }, err => {
        this.setState({
          error: <div style={styles.error}>{"Couldn't parse parameters from that file"}</div>,
        });
      });
    }

  }

  mergeParamsFromFile = (params) => {
    const newParams = {};

    _.each(params, (val, key) => {

      if (key in this.state.params) {
        newParams[key] = this.state.params[key];
      } else {
        newParams[key] = val;
      }

    }); 
    this.setState({
      params: newParams,
    });
  }

  render() {
    console.log("P", this.state.params);
    return (
      <div>
        { this.state.error }
        <div>bot params { _.map(this.state.params, (p,k) => k) }</div>
      </div>
    );
  }
}

const styles = {
  error: {
    color: colors.red,
    padding: "10px 0",
  }
};

export default Radium(BotParamSelect);

