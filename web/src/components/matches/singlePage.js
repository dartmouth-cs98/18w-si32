import React from "react";
import _ from "lodash";
import { connect } from "react-redux";
import Page from "../layout/page";
import { Link, history } from "../../router";
import { fetchMatches } from "../../data/match/matchActions";

class MatchSinglePage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.fetchMatches();
  }

  render() {
    return (
      <Page>
        <h1>Match {this.props.match._id}</h1>
        <p>status: {this.props.match.status}</p>
        <p>created: {this.props.match.createdAt}</p>
        { this.props.match.status === 'DONE' ? <p>log: {JSON.stringify(this.props.match.log)}</p> : "" }
      </Page>
    );
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  fetchMatches: () => dispatch(fetchMatches()),
});

const mapStateToProps = (state, props) => ({
  match: state.matches.records[props.id] || {},
});

export default connect(mapStateToProps, mapDispatchToProps)(MatchSinglePage);
