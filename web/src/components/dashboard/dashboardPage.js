import React from "react";
import _ from "lodash";
import { connect } from "react-redux";

import Link from "../layout/link";
import Page from "../layout/page";

import { fetchBots } from "../../data/bot/botActions";
import { fetchMatches } from "../../data/match/matchActions";
import { getProfile } from "../../data/user/userActions";

const DashBotList = ({ bots }) => {
  const items = _.map(bots, b =>
    <div key={b._id}>
      <Link href={`/bots/${b._id}`}>{b.name}</Link>
    </div>
  );

  return <div>{items}</div>;
};

const DashMatchList = ({ matches }) => {
  const items = _.map(matches, m =>
    <div key={m._id}>
      <Link href={`/matches/${m._id}`}>{m.status} {m._id}</Link>
    </div>
  );

  return <div>{items}</div>;
};



class DashboardPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    getProfile().then(profile => {
      this.setState(profile);
    });
  }

  componentDidMount() {
    this.props.fetchBots();
    this.props.fetchMatches();
  }

  render() {
    return (
      <Page>
        <div style={{paddingTop: 20}}>
          <h1 style={styles.header}>Dashboard</h1>
          <h3>Your user id: {this.state.user}</h3>

          <h2 style={styles.subheader}>Your Bots</h2>
          <DashBotList bots={this.props.bots} />
          <Link href="/bots/create">+ Create a new bot</Link>

          <h2 style={styles.subheader}>Your Latest Matches</h2>
          <DashMatchList matches={this.props.matches} />
          <Link href="/matches">View all &rarr;</Link>
        </div>
      </Page>
    );
  }
}

const styles = {
  header: {
    fontSize: 30,
  },
  subheader: {
    fontSize: 20,
    marginTop: 20,
  }
};

const mapDispatchToProps = dispatch => ({
  fetchBots: () => dispatch(fetchBots()),
  fetchMatches: () => dispatch(fetchMatches()),
});

const mapStateToProps = state => ({
  bots: state.bots.records,
  matches: state.matches.records,
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage);
