import React from "react";
import Select from "react-select";
import "react-select/dist/react-select.css";
import * as http from "../../util/http.js";

/* code using Select Async based on https://github.com/JedWatson/react-select#async-options */

const getGroups  = (input, callback) => {
  input = input || "";
  console.log(input);
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
      const returnOpts = globalMatch ? [globalOpt].concat(options.splice(0, 6)) : options.splice(0, 6);
      console.log(returnOpts);
      var data = {
        options: returnOpts,
        complete: options.length <= 6
      };

      callback(null, data);
  });
};

export default function groupSearchbar(currentGroup, onChange, {placeholder}) {
  return (
        <Select.Async
            name='search-groups'
            loadOptions={getGroups}
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
