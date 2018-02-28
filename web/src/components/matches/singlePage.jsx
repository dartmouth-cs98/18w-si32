import React from "react";
import { connect } from "react-redux";
import { Page, Wrapper} from "../layout";
import { fetchMatch } from "../../data/match/matchActions";
import { fetchLog } from "../../data/match/matchRoutes";

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
    });
  }

  render() {
    return (
      <Page>
        <Wrapper>
          <h1>Match {this.props.match._id}</h1>
          <p>status: {this.props.match.status}</p>
          <p>created: {this.props.match.createdAt}</p>
          { this.props.match.status === "DONE" ? <p>log: {JSON.stringify(this.props.match.log)}</p> : "" }
          { JSON.stringify(this.state.log) }
        </Wrapper>
      </Page>
    );
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  fetchMatch: () => dispatch(fetchMatch(props.id)),
});

const mapStateToProps = (state, props) => ({
  match: state.matches.records[props.id] || {},
});

export default connect(mapStateToProps, mapDispatchToProps)(MatchSinglePage);
