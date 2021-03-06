import React from "react";
import _ from "lodash";

import Message from "../common/message";
import { Input, Label } from "../form";
import Button from "../common/button";

class NewGroupForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      description: "",
      name: "",
      public: "public",
    };
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  submit = (e) => {
    if (e) {
      e.preventDefault();
    }
    this.props.onSubmit(this.state)
    .catch(err => {
      this.setState({
        error: _.get(err, "response.body.error") || err,
      });
    });
  }

  render() {
    return (<form onSubmit={this.submit} style={{marginTop: 10}}>
              <Message kind="error">{ this.state.error }</Message>
              <Label>Group name</Label>
              <Input
                name="name"
                type="text"
                autoComplete="off"
                value={this.state.name}
                onChange={this.handleInputChange}
              />
              <Label>Description</Label>
              <Input
                name="description"
                type="text"
                autoComplete="off"
                value={this.state.description}
                onChange={this.handleInputChange}
              />
              {/*<Label>Who Can Join?</Label>
              <div>
                <label style={styles.buttonLabel}>
                  <input
                    name="public"
                    type="radio"
                    value={"public"}
                    style={styles.radio}
                    checked={this.state.public === "public"}
                    onChange={this.handleInputChange}
                  />
                  Public
                </label>
                <label style={styles.buttonLabel}>
                  <input
                    name="public"
                    type="radio"
                    value={"private"}
                    style={styles.radio}
                    onChange={this.handleInputChange}
                  />
                  Private
                </label>
              </div>*/}
              <input type="submit" style={{display: "none"}} />
              <Button kind="primary" onClick={this.submit} style={styles.submitButton} disabled={this.state.submitting}>Create group</Button>
            </form>);
  }
}

const styles = {
  submitButton: {
    width: 300,
    margin: "20px auto",
  },
  buttonLabel: {
    fontWeight: 300,
    margin: "10px 0",
    display: "block",
  },
  radio: {
    marginRight: 10,
  },
};

export default NewGroupForm;
