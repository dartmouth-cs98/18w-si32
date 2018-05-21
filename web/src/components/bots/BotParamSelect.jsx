import React from "react";
import Radium from "radium";
import _ from "lodash";
import { Input, Label } from "../form";
import { colors, constants } from "../../style";

// parses a file and returns all params found in the file that the user 
// then will need to set
const getParamsFromFile = (file) => {
  return new Promise((resolve, reject) => {
    // read the file
    const usedParams = {};
    var reader = new FileReader();
    reader.readAsText(file, "UTF-8");

    reader.onload = (evt) => {
      const params = [];
      const code = evt.target.result;
      const re = /game.param\((['"])(.*)\1\)/g; // create regex to pluck out the param name 
      let match = re.exec(code);

      // iterate over matches
      while (match != null) {
        // set the param as a key in the params we have
        if (!(match in usedParams)) {
          params.push({ name: match[2], type: "", value: "" }); 
          usedParams[match] = true;
        }

        match = re.exec(code);
      }
      resolve(params);
    };

    reader.onerror = () => {
      reject("Couldn't read the file");
    };

  });
};

class _BotParamInput extends React.PureComponent {

  nameChanged = (event) => {
    this.props.onChange(event.target.value, this.props.param.value, this.props.param.type);
  }

  valueChanged = (event) => {
    this.props.onChange(this.props.param.name, event.target.value, this.props.param.type);
  }

  typeChanged = (event) => {
    this.props.onChange(this.props.param.name, this.props.param.value, event.target.value);
  }

  render() {
    return (
    <div style={styles.param}>
      <div style={styles.paramBox}>
        <Label kind="sub">Param name</Label>
        <Input
          type="text"
          value={this.props.param.name}
          onChange={this.nameChanged}
        />
      </div>
      <div style={[styles.paramBox, {margin: "0 20px"}]}>
        <Label kind="sub">Value</Label>
        <Input
          type="text"
          value={this.props.param.value}
          onChange={this.valueChanged}
        />
      </div>
      <div style={[styles.paramBox, {flexGrow: 0}]}>
        <Label kind="sub">Type</Label>
        <select style={styles.select} value={this.props.param.type} onChange={this.typeChanged}>
          <option value=""></option>
          <option value="INT">Int</option>
          <option value="FLOAT">Float</option>
          <option value="STRING">String</option>
        </select>
      </div>
    </div>
    );
  }
}
const BotParamInput = Radium(_BotParamInput);

class BotParamSelect extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      params: props.initialParams || {},
    };
    this.init = true;
  }

  componentWillReceiveProps(nextProps) {
    // only update initia params once, when the bot loads
    if (this.init && nextProps.initialParams != this.props.initialParams) {
      this.init = false;
      this.setState({
        params: nextProps.initialParams,
      });
    }

    if (nextProps.file != this.props.file) {
      getParamsFromFile(nextProps.file).then((params) => {
        this.mergeParamsFromFile(params);
      }, () => {
        this.setState({
          error: <div style={styles.error}>{"Couldn't parse parameters from that file"}</div>,
        });
      });
    }
  }

  mergeParamsFromFile = (params) => {
    const newParams = [];
    _.each(params, (p) => {
      const existing = _.find(this.state.params, { name: p.name });

      // if there's already one of that name, don't erase what the user had
      if (existing) {
        newParams.push(existing);
      } else { // otherwise insert the new param
        newParams.push(p);
      }
    }); 

    this.props.onChange(newParams);
    this.setState({
      params: newParams,
    });
  }

  paramChanged = (index) => (name, value, type) => {
    const params = this.state.params;
    params[index].name = name;
    params[index].value = value;
    params[index].type = type;
    this.props.onChange(params);
    this.forceUpdate();
  }

  render() {
    return (
      <div>
        <Label>
          Set any parameters for your bot
        </Label>
        { this.state.error }
        { _.map(this.state.params, (param,i) => 
          <BotParamInput
            key={i}
            param={param}
            onChange={this.paramChanged(i)} 
          />
        ) }
      </div>
    );
  }
}

const styles = {
  error: {
    color: colors.red,
    padding: "10px 0",
  },
  params: {
  },
  param: {
    display: "flex",
    justifyContent: "space-between",
    borderBottom: `1px solid ${colors.border}`,
  },
  paramBox: {
    flex: 1,
  },

  select: {
    minWidth: 80,
    height: constants.INPUT_HEIGHT,
    fontSize: constants.fontSizes.small,
    padding: 10,
    margin: "10px 0",
    borderColor: colors.border,
    borderStyle: "solid",
    borderWidth: "2px",
    borderRadius: 3,
    ":focus": {
      borderColor: colors.lightGray,
    }
  },
};

export default Radium(BotParamSelect);

