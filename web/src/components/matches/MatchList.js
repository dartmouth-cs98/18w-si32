import React from "react";
import _ from "lodash";
import Link from "../layout/link";

const MatchList = ({ matches }) => {
  const items = _.map(matches, m =>
    <div key={m._id}>
      <Link href={`/matches/${m._id}`}>{m.status} {m._id}</Link>
    </div>
  );

  return <div>{items}</div>;
};

export default MatchList; 