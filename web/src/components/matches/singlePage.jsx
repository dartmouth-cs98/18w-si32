import React from "react";
import { connect } from "react-redux";
import { Page, Wrapper} from "../layout";
import { fetchMatch } from "../../data/match/matchActions";
import { fetchLog } from "../../data/match/matchRoutes";
import ReplayVisualizer from "../replay/ReplayVisualizer";

const Bot = ({ bot }) => {

} ;

class MatchSinglePage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.fetchMatch().then(res => {
      // load the game log from S3
      if (res.body.logUrl) {
        return fetchLog(res.body.logUrl);
      } else {
        return {};
      }
    }).then(log => {
      this.setState({ log });
      console.log(log);
    });
  }

  renderBots = () => {

  }

  renderReplay = () => {
    if (this.state.log) {
      return <ReplayVisualizer replay={this.state.log} />;
    }

    return null;
  }

  render() {
    return (
      <Page>
        <Wrapper>
          <div style={styles.matchRow}>
            <div style={styles.gameViewer}>
              { this.renderReplay() }
            </div>
            <div style={styles.matchInfo}>
              <p>created: {this.props.match.createdAt}</p>
              { this.renderBots() }
            </div>
          </div>
        </Wrapper>
      </Page>
    );
  }
}

const styles = {
  gameViewer: {
    flex: 1,
    padding: "0 20px",
  },
  matchRow: {
    display: "flex",
  },
  matchInfo: {
    marginTop: 10,
    minWidth: 500,
  },
};

const mapDispatchToProps = (dispatch, props) => ({
  fetchMatch: () => dispatch(fetchMatch(props.id)),
});

const mapStateToProps = (state, props) => ({
  match: state.matches.records[props.id] || {},
});

export default connect(mapStateToProps, mapDispatchToProps)(MatchSinglePage);
