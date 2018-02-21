import React from "react";
import _ from "lodash";
import { connect } from "react-redux";

import Link from "../layout/link";
import Button from "../common/button";
import Page from "../layout/page";
import { Wrapper } from "../layout/wrappers";

import UserSearch from "./UserSearch";

import { fetchBots } from "../../data/bot/botActions";
import { fetchMatches } from "../../data/match/matchActions";
import { getProfile } from "../../data/user/userActions";
import { getSessionUser } from "../../data/user/userSelectors";
import { getMatchesForUser } from "../../data/match/matchSelectors";
import { getBotsForUser } from "../../data/bot/botSelectors";

import { MainTitle, SubTitle } from "./titles";

import { colors } from "../../style";

const DashBotList = ({ bots }) => {
  const items = _.map(bots, b =>
    <div key={b._id}>
      <Link href={`/bots/${b._id}`}>{b.name} ({b.trueSkill.mu.toFixed(1)})</Link>
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
  }

  componentDidMount() {
    this.props.fetchBots(this.props.userId);
    this.props.fetchMatches(this.props.userId);
  }

  render() {
    if (!this.props.user) return <div></div>;

    return (
      <Page>
        <Wrapper style={{ paddingTop: 10, paddingBottom: 10, backgroundColor: colors.sand }}>
          <span>Your stats at a glance</span>
        </Wrapper>
        <Wrapper style={{ marginTop: 10 }}>
          <div style={styles.sectionHeader}>
            <MainTitle>
                Bots
            </MainTitle>
            <Button style={{margin: "0 20px"}} kind="secondary" size="small" href="/bots/create">
              + Create a new bot
            </Button>
            <Button kind="tertiary" size="small" href="/bots">
              See all your bots &rarr;
            </Button>
          </div>

          <DashBotList bots={this.props.bots} />

          <div style={styles.sectionHeader}>
            <MainTitle>
                Recent Matches
            </MainTitle>
            <Button style={{margin: "0 20px"}} kind="secondary" size="small" href="/matches/create">
              + Start a match
            </Button>
            <Button kind="tertiary" size="small" href="/matches">
              See more matches &rarr;
            </Button>
          </div>

          <DashMatchList matches={this.props.matches} />

          <UserSearch />

        </Wrapper>
      </Page>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  fetchBots: (userId) => dispatch(fetchBots(userId)),
  fetchMatches: (userId) => dispatch(fetchMatches(userId)),
});

const mapStateToProps = state => ({
  user: getSessionUser(state) || state.session.user || {},
  userId: state.session.userId,
  matches: getMatchesForUser(state, state.session.userId),
  bots: getBotsForUser(state, state.session.userId),
});

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "20px"
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: 15,
    marginTop: 30,
  },
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage);
