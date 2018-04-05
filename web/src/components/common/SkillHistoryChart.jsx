import React from "react";
import _ from "lodash";
import { LineChart, CartesianGrid, Line, Label, XAxis, YAxis, ReferenceLine } from "recharts";
import { colors } from "../../style";
import moment from "moment";

// renders a skill history chart w/ a vertical line for different version
const SkillHistoryChart = ({ data, width, height, bots, useBotName = true }) => {
  let formattedData = _.map(data, (entry) => ({ 
    ...entry,
    timestamp: moment(entry.timestamp).unix(),
    score: entry.score
  }));


  // build up the information needed to display bot version information 
  //
  let versions = [];

  // first, get one entry per version per bot
  _.each(bots, b => {
    _.each(b.versionHistory, v => {
      versions.push({
        ...v,
        timestamp: moment(v.timestamp).unix(),
        name: useBotName ? b.name : "",
      });
    });
  });

  // sort them by the creation date
  _.sortBy(versions, "timestamp");

  let refLines = [];

  // now scan through all skill points, and find the correct place to insert a reference line for version break
  let versionIndex = 0;

  let dataIndex;
  for(dataIndex = 1; dataIndex < formattedData.length; dataIndex++) {
    let refLine = {
      x: formattedData[dataIndex-1].timestamp,
      label: [],
    };

    // for every version at this slice, add to the label
    while(versionIndex < versions.length && formattedData[dataIndex].timestamp > versions[versionIndex].timestamp) {
      refLine.label.push(versions[versionIndex].name + " v" + versions[versionIndex].version);
      versionIndex++;
    }

    // if there's a label, indicates there's a new version, so add it to the lines to create
    if (refLine.label.length) {
      refLine.label = refLine.label.join(", ");
      refLines.push(refLine);
    }
  }

  // there may be versions leftover here, but no point displaying them if the skill hasn't changed since

  return (
    <LineChart width={width} height={height} data={formattedData}>
      { _.map(refLines, r => (
        <ReferenceLine key={r.label+r.x} x={r.x} stroke={colors.medGray} strokeDasharray="4 6">
          <Label position="insideTopRight" fontSize="12" fill={colors.medGray}>
            {r.label}
          </Label>
        </ReferenceLine>
      )) }
      <CartesianGrid vertical={false} strokeDasharray="3 3" stroke={colors.border} />
      <XAxis
        dataKey="timestamp"
        tick={false}
        minTickGap={30}
      />
      <YAxis 
        width={20}
      />
      <Line 
        isAnimationActive={false}
        type="linear"
        dataKey="score.mu"
        dot={false}
        strokeWidth={2}
        stroke={colors.red} 
      />
    </LineChart>
  );
};

export default SkillHistoryChart;
