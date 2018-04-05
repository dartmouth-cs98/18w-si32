import React from "react";
import Radium from "radium";
import { connect } from "react-redux";
import _ from "lodash";
import Fuse from "fuse.js";
import history from "../../history";
import Button from "../common/button";
import { Input } from "../form";
import Message from "../common/message";
import { createMatch } from "../../data/match/matchActions";
import { fetchBots } from "../../data/bot/botActions";
import { Page, Wrapper } from "../layout";

import { colors, constants } from "../../style";

const BotView = Radium(({ bot, isSelected, showOwner }) => {
  if (!bot) return null;
  return (
    <div style={[styles.bot.wrapper, isSelected ? styles.bot.selected : null]}>
      <div style={styles.bot.title}>
        { bot.name }
      </div>
      <span style={styles.bot.owner}>{ showOwner && bot.user.username }</span>
      <div style={styles.bot.skill}>{ bot.trueSkill.mu.toFixed(1) }</div>
    </div>
  );

});

const MatchBotList = ({ bots, botClicked, showOwner }) => {
  let followingStatus = null;
  return (
    <div style={styles.botListWrap}>
      { _.map(bots, (b) => {
        let displayFollowing = false;
        if ( "isFollowing" in b && followingStatus !== b.isFollowing ){
          displayFollowing = true;
          followingStatus = b.isFollowing;
        }

        return (
          <div key={b._id}>
          { displayFollowing ? (<div style={styles.followingMarker}>
             { b.isFollowing ? "Bots from users you follow" : "Bots from other users" }
            </div>)
            : null }
          <div onClick={() => botClicked(b._id)} style={styles.bot}>
            <BotView bot={b} showOwner={showOwner} />
          </div>
        </div>
        );
          }) }
    </div>
  );
};

class MatchCreatePage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { ownBot: false, otherBot: false, query: "", otherBots: [] };
    this.botSearcher = new Fuse([], {});
  }

  componentDidMount() {
    this.props.fetchBots();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.bots != this.props.bots) {
      this.makeBotSearcher(nextProps.bots);
      this.filterBots(nextProps.bots);
    }
  }

  makeBotSearcher = (bots) => {
    var searchOptions = {
      minMatchCharLength: 1,
      keys: [
        "name",
        "user.username",
      ]
    };

    // pluck other user bots out from all bots 
    this.allOtherBots = _.filter(bots, b => b.user._id !== this.props.sessionUserId);

    // store whether cur user follows bot owner's user
    _.each(this.allOtherBots, (b) => {
      if (_.includes(b.user.followers, this.props.sessionUserId)) {
        b.isFollowing = true;
      } else {
        b.isFollowing = false;
      }
    });

    // build the fuzzy-text searcher
    this.botSearcher = new Fuse(this.allOtherBots, searchOptions); 
  }

  filterBots = () => {
    let bots = this.allOtherBots;

    // first filter bots by search query
    if (this.state.query !== "") {
      bots = this.botSearcher.search(this.state.query);
    }

    // then sort/group by whether current user follows the bot's owner  
    const grouped = _.groupBy(bots, "isFollowing");

    this.setState({
      otherBots: (grouped.true || []).concat(grouped.false || []),
    });
  }

  chooseOwnBot = (botId) => {
    this.setState({
      ownBot: this.props.bots[botId],
    });
  }

  chooseOtherBot = (botId) => {
    this.setState({
      otherBot: this.props.bots[botId],
    });
  }

  create = () => {
    this.setState({
      submitting: true,
      error: false,
    });

    this.props.create([this.state.ownBot._id, this.state.otherBot._id]).then((m) => {
      history.push(`/matches/${m[0]._id}`);
    })
    .catch(err => {
      this.setState({
        error: _.get(err, "response.body.error"),
      });
    })
    .finally(() => {
      this.setState({ submitting: false });
    });
  }
  
  handleInputChange = (event) => {
    this.setState({
      query: event.target.value
    }, () => {
      this.filterBots();
    });
  }

  renderTitleBox = (bot, text) => {
    if (bot) {
      return (
        <div style={styles.selectedBots.bot}>
          <BotView bot={bot} />
        </div>
      );
    }

    return (
      <div style={styles.selectedBots.box}>
        <h3 style={styles.selectTitle}>{ text }</h3>
      </div>
    );
  }

  render() {
    return (
      <Page>
        <Wrapper>
          <div style={styles.createWrap}>
            <h1 style={styles.mainTitle}>Start a Match</h1>

            <Message kind="error" style={{marginTop: 15, alignSelf: "center"}}>{ this.state.error }</Message>

            <div style={styles.selectionRow}>
              <div style={[styles.selectStep, {marginRight: 30, paddingRight: 30, borderRight: `1px solid ${colors.border}`}]}>
                <div style={[styles.selectStep.title]}>1. Choose one of your bots</div>
                
                <div style={styles.selector}>
                  <div style={[styles.selectedBotWrap, {marginBottom: 10}]}>
                    { this.state.ownBot ? <BotView bot={this.state.ownBot} isSelected /> : <div style={styles.selectedBotHolder} /> }
                  </div>
                  <MatchBotList
                    botClicked={this.chooseOwnBot}
                    bots={ _.filter(this.props.bots, (b) => b.user._id == this.props.sessionUserId) }
                    showOwner={false}
                  />
                </div>
              </div>

              <div style={styles.selectStep}>
                <div style={styles.selectStep.title}>2. Choose a bot to fight against</div>
                <div style={styles.selector}>
                    <div style={styles.selectedBotWrap}>
                      { this.state.otherBot? <BotView bot={this.state.otherBot} showOwner isSelected /> : <div style={styles.selectedBotHolder} /> }
                    </div>
                    <Input
                      name="user-search"
                      placeholder="find bots by owner or name..."
                      autoComplete="off"
                      type="text"
                      value={this.state.query}
                      onChange={this.handleInputChange}
                    />
                    <MatchBotList
                      botClicked={this.chooseOtherBot}
                      bots={this.state.otherBots}
                      showOwner={true}
                    />
                </div>
              </div>

            </div>

            <Button kind="primary" style={styles.createButton} onClick={this.create}>Create!</Button>
          </div>
        </Wrapper>
      </Page>
    );
  }
}

const styles = {
  createWrap: {
    maxWidth: 800,
    margin: "20px auto",
    display: "flex",
    flexDirection: "column",
  },
  mainTitle: {
    color: colors.red,
    fontSize: constants.fontSizes.large,
  },
  botListWrap: {
    maxHeight: 460,
    overflow: "auto",
  },
  bot: {
    cursor: "pointer",
    margin: "5px 0",
    wrapper: {
      display: "flex",
      alignItems: "center",
      flex: 1,
      justifyContent: "space-between",
      padding: "2px 10px",
    },
    title: {
      color: colors.red,
      fontSize: constants.fontSizes.medium,
      fontWeight: 400,
    },
    owner: {
      color: colors.medGray,
      fontWeight: 300,
      flex: 1,
      marginLeft: 10,
      fontSize: constants.fontSizes.small,
    },
    skill: {
      fontSize: constants.fontSizes.small,
    },
    selected: {
      background: colors.sand,
      padding: "10px",
      borderRadius: 3,
      height: 42,
      border: `1px solid ${colors.lightGray}`,
    },
  },
  selectedBotHolder: {
    height: 42,
    borderRadius: 3,
    border: `2px dashed ${colors.border}`,
  },
  selectStep: {
    flex: 1,
    title: {
      fontSize: constants.fontSizes.large,
      marginBottom: 10,
    },
  },
  selectionRow: {
    display: "flex",
    alignItems: "top",
    paddingTop: 15,
    minHeight: 570,
  },
  selector: {
    flex: 1,
    alignItems: "flex-start",
  },
  createButton: {
    width: 300,
    margin: "40px auto",
  },
  followingMarker: {
    fontSize: constants.fontSizes.smaller,
    color: colors.lightGray,
    textTransform: "uppercase",
    padding: "0px 10px",
    marginTop: 15,
  },
};


const mapDispatchToProps = dispatch => ({
  create: (bots) => dispatch(createMatch(bots)),
  fetchBots: () => dispatch(fetchBots()),
});

const mapStateToProps = state => ({
  bots: state.bots.records,
  sessionUserId: _.get(state, "session.userId", ""),
});

export default connect(mapStateToProps, mapDispatchToProps)(Radium(MatchCreatePage));
