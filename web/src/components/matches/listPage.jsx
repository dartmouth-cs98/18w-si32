import React from "react";
import { connect } from "react-redux";

import history from "../../history";

import { Page, Wrapper, TitleBar } from "../layout";
import { fetchMatches } from "../../data/match/matchActions";
import { getMatchesForUser } from "../../data/match/matchSelectors";

import MatchList from "./MatchList";

class MatchListPage extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchMatches(this.props.userId);
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
  fetchMatches: (userId) => dispatch(fetchMatches(userId)),
});

const mapStateToProps = state => ({
  matches: getMatchesForUser(state, state.session.userId, -1),
  userId: state.session.userId,
});

export default connect(mapStateToProps, mapDispatchToProps)(MatchListPage);
