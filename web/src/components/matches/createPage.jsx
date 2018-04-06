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

const BotView = Radium(({ bot, isSelected, selectedStyle=null, showOwner }) => {
  if (!bot) return null;
  return (
    <div style={[styles.bot.wrapper, isSelected ? (selectedStyle || styles.bot.selected) : null]}>
      <div style={styles.bot.title}>
        { bot.name }
      </div>
      <span style={styles.bot.owner}>{ showOwner && bot.user.username }</span>
      <div style={styles.bot.skill}>{ bot.trueSkill.mu.toFixed(1) }</div>
    </div>
  );

});

const MatchBotList = ({ bots, botClicked, showOwner, selectedBots }) => {
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
            <BotView bot={b} showOwner={showOwner} selectedStyle={styles.selectedInList} isSelected={b._id in selectedBots} />
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
    this.state = { 
      selectedOwnBot: false,
      selectedOtherBots: {},
      query: "",
      otherBots: [],
    };
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
      selectedOwnBot: this.props.bots[botId],
    });
  }

  chooseOtherBot = (botId) => {
    const selectedBots = Object.assign({}, this.state.selectedOtherBots);
    if (botId in selectedBots) {
      delete selectedBots[botId];
    } else {
      selectedBots[botId] = this.props.bots[botId];
    }
    this.setState({
      selectedOtherBots: selectedBots,
    });
  }

  create = () => {
    this.setState({
      submitting: true,
      error: false,
    });

    const botIds = [this.state.selectedOwnBot._id];
    for(let id in this.state.selectedOtherBots) {
      botIds.push(id);
    }

    this.props.create(botIds).then((m) => {
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

  renderSelectedBots = () => {
    // render all bots that have been selected
    let els = _.map(this.state.selectedOtherBots, (b) => (
      <div key={b._id} onClick={() => this.chooseOtherBot(b._id)} style={styles.bot}>
        <BotView bot={b} isSelected showOwner />
      </div>
    ));

    // add placeholders up to the max # of bots selectable
    let i = els.length;
    while ((i = els.length) < 3) {
      els.push(<div key={i} style={styles.selectedBotHolder}>{ i > 0 ? "(optional)" : null }</div>);
    }

    return els;
  }

  render() {
    return (
      <Page>
        <Wrapper>
          <div style={styles.createWrap}>
            <h1 style={styles.mainTitle}>Start a Match</h1>

            <Message kind="error" style={{marginTop: 15, alignSelf: "center"}}>{ this.state.error }</Message>

            <div style={styles.selectionRow}>
              <div style={styles.selectStep}>
                <div style={[styles.selectStep.title]}>Choose one of your bots</div>
                
                <div style={styles.selector}>
                  <div style={[styles.selectedBotWrap, {marginBottom: 10}]}>
                    { this.state.selectedOwnBot ? <BotView bot={this.state.selectedOwnBot} isSelected /> : <div style={styles.selectedBotHolder} /> }
                  </div>
                  <MatchBotList
                    botClicked={this.chooseOwnBot}
                    bots={ _.filter(this.props.bots, (b) => b.user._id == this.props.sessionUserId) }
                    selectedBots={{[this.state.selectedOwnBot._id]: true}} 
                    showOwner={false}
                  />
                </div>
              </div>

              <div style={styles.selectStep}>
                <div style={styles.selectStep.title}>Choose 1-3 bots to fight against</div>
                <div style={styles.selector}>
                    <div style={styles.selectedBotWrap}>
                      { this.renderSelectedBots() }
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
                      selectedBots={this.state.selectedOtherBots}
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
  },
  bot: {
    cursor: "pointer",
    margin: "0",
    wrapper: {
      display: "flex",
      alignItems: "center",
      flex: 1,
      justifyContent: "space-between",
      padding: "5px 10px",
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
      margin: "5px 0",
      height: 42,
      border: `1px solid ${colors.lightGray}`,
    },
  },
  selectedInList: {
    opacity: .3,
    backgroundColor: colors.sand,
  },
  selectedBotHolder: {
    height: 42,
    borderRadius: 3,
    border: `2px dashed ${colors.border}`,
    margin: "5px 0",
    display: "flex",
    color: colors.lightGray,
    alignItems: "center",
    paddingLeft: 10,
  },
  selectStep: {
    marginBottom: 50, 
    title: {
      fontSize: constants.fontSizes.large,
      marginBottom: 10,
    },
  },
  selectionRow: {
    paddingTop: 30,
  },
  selector: {
    flex: 1,
    alignItems: "flex-start",
  },
  createButton: {
    width: 300,
    margin: "10px auto",
  },
  followingMarker: {
    fontSize: constants.fontSizes.smaller,
    color: colors.lightGray,
    textTransform: "uppercase",
    padding: "0px 10px",
    marginTop: 15,
    marginBottom: 5,
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
