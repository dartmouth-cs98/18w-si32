import React from "react";
import { connect } from "react-redux";
import Page from "../layout/page";
import { Link, history } from "../../router";
import { createMatch } from "../../data/match/matchActions";

class MatchCreatePage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {bots: []};
  }

  handleInputChange = event => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  };

  submit = (event) => {
    console.log("submitted");
    event.preventDefault();
    // TODO validation

    this.props.create(this.state.bots);
  };


  render() {
    return (
      <Page>
        <h1>Create a Match</h1>
        <form onSubmit={this.submit}>

        </form>
      </Page>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  create: (bots) => dispatch(createMatch(bots)),
});

const mapStateToProps = state => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(MatchCreatePage);
