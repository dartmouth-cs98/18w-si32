import React from "react";
import Radium from "radium";
import _ from "lodash";
import { connect } from "react-redux";

import Button from "../common/button";
import { Link, Page, Wrapper } from "../layout";

import UserSearch from "./UserSearch";
import UserList from "../user/UserList";
import BotCard from "../bots/BotCard";
import MatchList from "../matches/MatchList";
import HeaderStatsBar from "./HeaderStatsBar";

import { fetchBots } from "../../data/bot/botActions";
import { fetchMatches } from "../../data/match/matchActions";
import { fetchUser } from "../../data/user/userActions";
import { getSessionUser } from "../../data/user/userSelectors";
import { getMatchesForUser } from "../../data/match/matchSelectors";
import { getBotsForUser } from "../../data/bot/botSelectors";

import { MainTitle } from "../common/titles";

import { colors, fontStyles, colorStyles } from "../../style";


const DashBotList = Radium(({ bots }) => {
  const items = _.map(bots, (b,i) => (
    <BotCard hasDivider={i != 0} key={b._id} bot={b} style={{flex: 1}} />
  ));

  if (bots.length == 1) {
    items.push(
      <div key={"create"} style={[fontStyles.bodyText, styles.botCreateCard]}>
        <p style={[
          colorStyles.lightGray,
          fontStyles.medium,
          { marginBottom: 10 },
        ]}>
          You can have more than one bot, to test out multiple strategies at the same time!
        </p>
        <Button href="/bots/create" size="small" kind="primary">+ Upload a second bot now</Button>
      </div>
    );
  }

  return (<div style={styles.botCards}>{items}</div>);
});

class DashboardPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.fetchBots(this.props.userId);
    this.props.fetchMatches(this.props.userId);
    this.props.fetchUser(this.props.userId);
  }

  renderNoBots = () => {
    return (
      <p>{"You don't have any bots yet!"} To get started playing Monad, <Link href="/bots/create">upload a bot first &rarr;</Link></p>
    );
  }

  renderTopBots = () => (
    <Wrapper style={styles.dashSectionContainer} innerStyle={styles.dashSection}>
      <div style={styles.sectionHeader}>
        <MainTitle>
            Your Top Bots
        </MainTitle>
        <Button style={{margin: "0 20px"}} kind="secondary" size="small" href="/bots/create">
          + Create a new bot
        </Button>
        <Button kind="tertiary" size="small" href="/bots">
          See all your bots &rarr;
        </Button>
      </div>

      { this.props.bots.length > 0 ? <DashBotList bots={this.props.bots} /> : this.renderNoBots() }

    </Wrapper>
  )

  renderFollowing = () => {
    if (!_.get(this.props, "user.following", null)) return null;

    return <UserList users={this.props.user.following} />;
  }

  render() {
    if (!this.props.user) return <div></div>;

    return (
      <Page style={styles.pageStyles}>
        <HeaderStatsBar user={this.props.user} />

        { this.renderTopBots() }

        <Wrapper style={styles.dashSectionContainer} innerStyle={styles.dashSection}>
          <div style={styles.matchesRow}>
            <div style={styles.matches}>
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

              <MatchList matches={this.props.matches} />
            </div>
            <div style={styles.users}>
              <div style={[styles.sectionHeader, {marginTop: 45}, fontStyles.medium, colorStyles.red]}>Users you follow</div>
              { this.renderFollowing() }
              <UserSearch />
            </div>
          </div>
        </Wrapper>

      </Page>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  fetchBots: (userId) => dispatch(fetchBots(userId)),
  fetchMatches: (userId) => dispatch(fetchMatches(userId)),
  fetchUser: (userId) => dispatch(fetchUser(userId, true, true)),
});

const mapStateToProps = state => ({
  user: getSessionUser(state) || {},
  userId: state.session.userId,
  matches: getMatchesForUser(state, state.session.userId),
  bots: getBotsForUser(state, state.session.userId, { limit: 3 }),
});

const styles = {
  pageStyles: {
    justifyContent: "flex-start",
  },
  dashSectionContainer: {
    width: "100%"
  },
  dashSection: {
    borderBottom: `2px solid ${colors.border}`,
    paddingBottom: 20,
  },
  botCards: {
    display: "flex",
    justifyContent: "space-between",
  },
  botCreateCard: {
    border: `4px dashed ${colors.sand}`,
    width: "50%",
    borderRadius: 15,
    padding: "20px 60px 20px 60px",
    marginLeft: 30,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    textAlign: "center",
    flexDirection: "column",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 30,
  },
  matchesRow: {
    display: "flex",
  },
  matches: {
    width: "70%",
    marginRight: 50,
  },
  users: {
    flex: 1,
  },
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage);
