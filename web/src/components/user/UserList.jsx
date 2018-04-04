import React from "react";
import Radium from "radium";

import Link from "../common/link";

import { fontStyles } from "../../style";

class UserList extends React.PureComponent {
  renderUsers = () =>
    this.props.users.map(u => {
      if (typeof u === "string") return null;

      return (<div key={u._id} style={styles.user}>
                <span style={[{flex: 1, alignItems: "flex-start"}, fontStyles.small]}>
                  <Link href={`/users/${u._id}`}>{u.username}</Link>
                </span>
                <span>{u.trueSkill.mu.toFixed(1)}</span>
              </div>);
      }) 

  render() {
    if (!this.props.users) return <div></div>;
    return <div>{ this.renderUsers() }</div>;
  }
}

const styles = {
  user: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "7px 0",
  },
};

export default Radium(UserList);
