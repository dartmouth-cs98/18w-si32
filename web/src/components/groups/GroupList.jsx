import React from "react";
import _ from "lodash";
import Link from "../layout/link";

const GroupList = ({ groups }) => {
  const items = _.map(groups, g =>
    <div key={g._id}>
      <Link href={`/groups/${g._id}`}>{g.name}: {g.description}</Link>
    </div>
  );

  return <div>{items}</div>;
};

export default GroupList;
