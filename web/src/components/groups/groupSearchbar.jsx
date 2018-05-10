import React from "react";
import Select from "react-select";
import "react-select/dist/react-select.css";
import * as http from "../../util/http.js";

/* code using Select Async based on https://github.com/JedWatson/react-select#async-options */

const getGroupsNoGlobal = (input, callback) => {
  return getGroups(input, {global: false}, callback);
};

const getGroupsWithGlobal = (input, callback) => {
  return getGroups(input, {global: true}, callback);
};

const getGroups  = (input, opts, callback) => {
  opts = opts || {};
  input = input || "";
  return http
    .get("/groups")
    .query({q: input})
    .then(res => {
      const groups = res.body;
      let options = groups.map(group => {
        return {value: group._id, label: group.name};
      });

      const globalOpt = {value: "global", label: "Global"};
      const globalMatch = input === "" || "global".includes(input.toLowerCase());
      const returnOpts = globalMatch && opts.global ? [globalOpt].concat(options.splice(0, 6)) : options.splice(0, 6);
      var data = {
        options: returnOpts,
        complete: options.length <= 6
      };

      callback(null, data);
  });
};

export default function groupSearchbar(currentGroup, onChange, {placeholder, showGlobal}) {
  const getGroupsFunc = showGlobal ? getGroupsWithGlobal : getGroupsNoGlobal;
  return (
        <Select.Async
            name='search-groups'
            loadOptions={getGroupsFunc}
            value={currentGroup}
            autoload={true}
            placeholder={placeholder || "Search For New Groups"}
            autosize={false}
            clearable={true}
            cache={false}
            multi={false}
            onChange={onChange}
            filterOptions={false}
            onSelectResetsInput={true}
          />
  );
}
