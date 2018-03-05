import React from "react";
import { connect } from "react-redux";
import history from "../../history";
import Page from "../layout/page";
import { createGroup } from "../../data/group/groupActions";
import { fetchBots } from "../../data/bot/botActions";
import NewGroupForm from "./NewGroupForm";

class GroupCreatePage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { bots: {} };
  }

  componentDidMount() {
    this.props.fetchBots();
  }

  handleSubmit = (values) => {
    const groupInfo = Object.assign({}, values, {
      public: values.public === "public"
    });
    this.props.create(groupInfo).then((res) => {
      // TODO use keyed collections instead of just happening to know that 1 is the group
      history.push(`/leaderboards/${res[1]._id}`);
    });
  }

  render() {
    return (
      <Page>
        <h1>Create a New Group</h1>
        <NewGroupForm onSubmit={this.handleSubmit} />
        <input type="button" value="create" onClick={this.create} />
      </Page>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  create: (bots) => dispatch(createGroup(bots)),
  fetchBots: () => dispatch(fetchBots()),
});

const mapStateToProps = state => ({
  bots: state.bots.records,
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupCreatePage);
