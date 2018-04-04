import React from "react";
import Radium from "radium";

import Button from "../common/button";
import StatDifference from "../common/statDifference";

import { fontStyles } from "../../style";

class UserList extends React.PureComponent {
  renderUsers = () =>
    this.props.users.map(u => {
      if (typeof u === "string") return null;

      return (<div key={u._id} style={styles.user}>
                <Button kind="tertiary" style={fontStyles.small} href="/users/{u._id}">{u.username}</Button>
                <div style={fontStyles.small}>
                  <StatDifference history={u.trueSkillHistory} />
                </div>
              </div>);
      }) 

  render() {
    if (!this.props.users) return <div></div>;
    return <div style={{marginTop: 10}}>{ this.renderUsers() }</div>;
  }
}

const styles = {
  user: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "2px 0",
  },
};

export default Radium(UserList);
