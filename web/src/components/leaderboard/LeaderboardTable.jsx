import React from "react";
import Link from "../common/link";
import _ from "lodash";
import ReactTable from "react-table";
import "react-table/react-table.css";

const LeaderboardTable = ({ users, totalPages, loading, fetchPage }) => {
  // console.log(users);
  // const rows = _.map(users, (u) => (
  //   <Link key={u._id} href={`/users/${u._id}`}>{u.username} ({u.trueSkill.mu.toFixed(1)})</Link>
  // ));

  // const paging =

  return (<ReactTable
          columns={[
            {
              Header: "Username",
              accessor: "username"
            },
            {
              Header: "Rating",
              accessor: "rating"
            },
          ]}
          manual // Forces table not to paginate or sort automatically, so we can handle it server-side
          data={users}
          pages={totalPages} // Display the total number of pages
          loading={loading} // Display the loading overlay when we need it
          onFetchData={fetchPage} // Request new data when things change
          defaultPageSize={10}
          showPageSizeOptions={false}
          className="-striped -highlight"
        />);
};

export default LeaderboardTable;
