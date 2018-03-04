import React from "react";
import _ from "lodash";
import Link from "../common/link";

const GroupList = ({ groups, leaveGroup, ranks }) => {
  ranks = ranks || {};
  const items = _.map(groups, g =>
    <GroupListRow key={g._id} group={g} leaveGroup={leaveGroup} rank={ranks[g._id]}/>
  );

  return <div>{items}</div>;
};

const GroupListRow = ({ group, leaveGroup, rank }) => {
  const onClickLeave = () => {
    leaveGroup(group._id);
  };
  
  return (
    <div style={{display: "flex"}}>
      <Link href={`/groups/${group._id}`}>{group.name}: {group.description} &nbsp; | &nbsp; Rank: {rank.rank}/{rank.of} &nbsp; | &nbsp;</Link>
      <button onClick={onClickLeave}>Leave Group</button>
    </div>
  );
};

export default GroupList;
