import React from "react";
import Radium from "radium";
import _ from "lodash";
import { connect } from "react-redux";

import { Link, Page, Wrapper } from "../layout";
import Button from "../common/button";

import UserSearch from "./UserSearch";
import BotCard from "../bots/BotCard";
import HeaderStatsBar from "./HeaderStatsBar";

import { fetchBots } from "../../data/bot/botActions";
import { fetchMatches } from "../../data/match/matchActions";
import { getProfile } from "../../data/user/userActions";
import { getSessionUser } from "../../data/user/userSelectors";
import { getMatchesForUser } from "../../data/match/matchSelectors";
import { getBotsForUser } from "../../data/bot/botSelectors";

import { MainTitle, SubTitle } from "../common/titles";

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

  renderNoBots = () => {
    return (
      <p>You don't have any bots yet! To get started playing Monad, <Link href="/bots/create">upload a bot first &rarr;</Link></p>
    );
  }

  renderTopBots = () => (
    <Wrapper innerStyle={styles.dashSection}>
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

  render() {
    if (!this.props.user) return <div></div>;
    console.log(this.props.user);

    return (
      <Page>
        <HeaderStatsBar user={this.props.user} />

        { this.renderTopBots() }

        <Wrapper innerStyle={styles.dashSection}>
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
  user: getSessionUser(state) || state.session.user,
  userId: state.session.userId,
  matches: getMatchesForUser(state, state.session.userId),
  bots: getBotsForUser(state, state.session.userId, { limit: 3 }),
});

const styles = {
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
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage);
