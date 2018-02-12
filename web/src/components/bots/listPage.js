import React from "react";
import { connect } from "react-redux";
import Page from "../layout/page";
import { Link, history } from "../../router";
import { fetchBots } from "../../data/bot/botActions";

const BotList = ({ bots }) => {
  const items = bots.map(b =>
    <div key={b._id}>
      {b.name}
    </div>
  );

  return <div>{items}</div>
};

class BotListPage extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchBots();
  }

  render() {
    return (
      <Page>
        <h1>Your Bots</h1>
        <Link href="/bots/create">Create a new bot</Link>
        <BotList bots={this.props.bots} />
      </Page>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  fetchBots: () => dispatch(fetchBots()),
});

const mapStateToProps = state => ({
  bots: state.bots.data,
});

export default connect(mapStateToProps, mapDispatchToProps)(BotListPage);
