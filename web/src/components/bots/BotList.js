import React from "react";
import _ from "lodash";
import Link from "../layout/link";

export default ({ bots }) => {
  const items = _.map(bots, b =>
    <div key={b._id}>
      <Link href={`/bots/${b._id}`}>{b.name}</Link>
    </div>
  );

  return <div>{items}</div>;
};
