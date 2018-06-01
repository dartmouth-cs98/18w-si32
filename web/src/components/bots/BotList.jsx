import React from "react";
import _ from "lodash";
import Link from "../common/link";
import BotCard from "./BotCard";

import { colors, constants, fontStyles, colorStyles } from "../../style";

const BotList = ({ bots }) => {
  const items = _.map(bots, (b,i) =>
    <BotCard
      hasDivider={false}
      key={b._id}
      bot={b} 
      style={{
        paddingRight: 20,
        paddingLeft: 20,
        paddingTop: 20,
        float: "left",
        width: "50%",
        borderBottom: `1px solid ${colors.border}`,
        borderRight: (i % 2 == 0 ? `1px solid ${colors.border}` : "")
      }} />

    /*<div key={b._id}>
      <Link href={`/bots/${b._id}`}>{b.name}</Link>
    </div>*/
  );

  return <div>{items}</div>;
};

export default BotList;
