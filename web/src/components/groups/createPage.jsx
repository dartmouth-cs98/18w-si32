import React from "react";
import { connect } from "react-redux";
import history from "../../history";

import { Page, Wrapper }from "../layout";
import { createGroup } from "../../data/group/groupActions";
import NewGroupForm from "./NewGroupForm";
import { fontStyles, colorStyles } from "../../style";

class GroupCreatePage extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  handleSubmit = (values) => {
    const groupInfo = Object.assign({}, values, {
      public: values.public === "public"
    });
    this.props.create(groupInfo).then((res) => {
      history.push(`/leaderboards/${res[1]._id}`);
    });
  }

  render() {
    return (
      <Page>
        <Wrapper>
          <div style={styles.formWrap}>
            <h1 style={[fontStyles.large, colorStyles.red]}>Create Group</h1>
            <NewGroupForm onSubmit={this.handleSubmit} />
          </div>
        </Wrapper>
      </Page>
    );
  }
}

const styles = {
  formWrap: {
    maxWidth: 500,
    margin: "20px auto",
  },
};

const mapDispatchToProps = dispatch => ({
  create: (groupInfo) => dispatch(createGroup(groupInfo)),
});

export default connect(null, mapDispatchToProps)(GroupCreatePage);
