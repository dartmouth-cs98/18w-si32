import _ from "lodash";
import React from "react";
import Radium from "radium";
import Modal from "react-modal";
import { connect } from "react-redux";
import mixpanel from "mixpanel-browser";

import Button from "../common/button";
import { Link, Page, Wrapper } from "../layout";

import config from "../../config";

import UserSearch from "./UserSearch";
import UserList from "../user/UserList";
import BotCard from "../bots/BotCard";
import MatchList from "../matches/MatchList";
import HeaderStatsBar from "./HeaderStatsBar";
import { MainTitle } from "../common/titles";

import { fetchBots } from "../../data/bot/botActions";
import { fetchMatches } from "../../data/match/matchActions";
import { fetchUser, onboardUser } from "../../data/user/userActions";
import { getSessionUser } from "../../data/user/userSelectors";
import { getMatchesForUser } from "../../data/match/matchSelectors";
import { getBotsForUser } from "../../data/bot/botSelectors";

import { colors, constants, fontStyles, colorStyles } from "../../style";

const { DEVKIT_URL } = config;

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
    this.state = {
      showModal: false
    };
  }

  componentWillMount() {
    if (!this.props.user.onboard) {
      this.setState({ showModal: true });
    }
  }

  componentDidMount() {
    mixpanel.track("Visit Dashboard");
    this.props.fetchBots(this.props.userId);
    this.props.fetchMatches(this.props.userId);
    this.props.fetchUser(this.props.userId);
  }

  downloadDevkit = () => {
    window.open(DEVKIT_URL, "_blank");
  }

  markUserOnboarded = () => {
    this.props.onboardUser(this.props.userId);
    // dont actually need this, since it navigates user away from dash...
    this.setState({ showModal: false });
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

    return <div style={{marginTop: 10}}><UserList users={this.props.user.following} /></div>;
  }

  renderOnboardModal = () => {
    return (
      <Modal
        isOpen={this.state.showModal}
        onRequestClose={this.closeModal}
        style={styles.modalStyles}
        contentLabel="Monad Onboarding">
        <div style={styles.modalTitle}>Welcome to Monad!</div>
        <div>Follow the 3 steps below to get started by uploading your first bot.</div>
        <div style={styles.listContainer}>
          <div style={styles.listItem}>1. Download the <Link href="#" onClick={this.downloadDevkit}>development kit</Link></div>
          <div style={styles.listItem}>2. Copy and paste the code below into 'bot.py' where indicated</div>
          <div style={styles.codeBlock}>
            cells = game.get_my_cells()
            <br/>
            for cell in cells:
            <br/>
            <span style={styles.indent}>game.move(cell.position, 1, choice(game.get_movement_directions()))</span>
          </div>
          <div style={styles.listItem}>3. Upload your bot from the <Link href="/bots/create" onClick={this.markUserOnboarded}>bot creation page</Link></div>
        </div>
      </Modal>
    );
  }

  render() {
    if (!this.props.user) return <div></div>;

    return (
      <Page style={styles.pageStyles}>
        <HeaderStatsBar user={this.props.user} />

        { this.renderTopBots() }
        { this.renderOnboardModal() }

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
              <div style={{marginTop: 15, paddingTop: 20, borderTop: `1px solid ${colors.border}`}}><UserSearch /></div>
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
  onboardUser: (userId) => dispatch(onboardUser(userId)),
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
    fontWeight: 300
  },
  dashSectionContainer: {
    width: "100%",
    paddingLeft: 20,
  },
  dashSection: {
    borderBottom: `2px solid ${colors.border}`,
    paddingBottom: 20,
    paddingRight: 20,
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
    marginTop: 20,
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
  modalStyles: {
    content : {
      width: "80%",
      height: "60%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "rubik",
      fontWeight: 300,
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      borderColor: colors.blue,
      borderStyle: "solid"
    }
  },
  modalTitle: {
    fontSize: constants.fontSizes.larger,
    color: colors.blue,
    padding: "10px"
  },
  listContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "10px"
  },
  listItem: {
    padding: "15px"
  },
  codeBlock: {
    backgroundColor: "#eee",
    border: "1px solid #999",
    display: "block",
    padding: "15px",
    marginLeft: "30px"
  },
  indent: {
    paddingLeft: "15px"
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage);
