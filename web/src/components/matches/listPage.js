import React from "react";
import _ from "lodash";
import { connect } from "react-redux";
import Page from "../layout/page";
import { Link, history } from "../../router";
import { fetchMatches } from "../../data/match/matchActions";

const MatchList = ({ matches }) => {
  const items = _.map(matches, m =>
    <div key={m._id}>
      <Link href={`/matches/${m._id}`}>{m.status} {m._id}</Link>
    </div>
  );

  return <div>{items}</div>
};

class MatchListPage extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchMatches();
  }

  render() {
    return (
      <Page>
        <h1>Your Matches</h1>
        <Link href="/matches/create">Create a new match</Link>
        <MatchList matches={this.props.matches} />
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
