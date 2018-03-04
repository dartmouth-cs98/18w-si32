import React from "react";
import { connect } from "react-redux";

import history from "../../history";

import { Page, Wrapper, TitleBar } from "../layout";
import { fetchMatches } from "../../data/match/matchActions";

import MatchList from "./MatchList";

class MatchListPage extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchMatches();
  }

  createMatch = () => {
    history.push("/matches/create");
  }

  render() {
    return (
      <Page>
        <TitleBar
          title="Your Matches"
          buttonLabel="Start a match"
          buttonAction={this.createMatch}
        />
        <Wrapper>
          <MatchList matches={this.props.matches} />
        </Wrapper>
      </Page>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  fetchMatches: () => dispatch(fetchMatches()),
});

const mapStateToProps = state => ({
  matches: state.matches.records,
});

export default connect(mapStateToProps, mapDispatchToProps)(MatchListPage);
