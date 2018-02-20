import React from "react";
import _ from "lodash";
import Link from "../layout/link";

const GroupList = ({ groups, leaveGroup }) => {
  console.log(groups);
  const items = _.map(groups, g =>
    <GroupListRow key={g._id} group={g} leaveGroup={leaveGroup}/>
  );

  return <div>{items}</div>;
};

const GroupListRow = ({ group, leaveGroup }) => {
  const onClickLeave = () => {
    leaveGroup(group._id);
  };
  console.log(group._id);
  return (
    <div style={{display: "flex"}}>
      <Link href={`/groups/${group._id}`}>{group.name}: {group.description}</Link>
      <button onClick={onClickLeave}>Leave Group</button>
    </div>
  );
};

export default GroupList;
