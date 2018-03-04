import React from "react";
import ReactTable from "react-table";
import { connect } from "react-redux";
import "react-table/react-table.css";

import { fetchLeaderboard } from "../../data/leaderboard/leaderboardActions";
import { getSessionUser } from "../../data/user/userSelectors";

const PAGE_SIZE = 20;

/* eslint-disable react/display-name */
class LeaderboardTable extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      page: 0,
    };
  }

  componentWillMount() {
    this.onFetchPage(0);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.groupId !== this.props.groupId) {
      this.props.fetchLeaderboard(nextProps.groupId, 0);
      this.setState({page: 0});
    }
  }

  onFetchPage = (page) => {
    this.props.fetchLeaderboard(this.props.groupId, page);
    this.setState({page: page});
  }

  render() {
    const groupId = this.props.groupId;
    const page = this.state.page;
    const leaderboard = this.props.leaderboards[groupId] || {users: []};
    const users = leaderboard.users;
    const numPages = leaderboard.numPages;
    return (
      <ReactTable
        columns={[
          {
            id: "index",
            Header: "#",
            accessor: null,
            Cell: props => (<span className='number'>{props.index + page*PAGE_SIZE + 1}</span>)
          },
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
        pages={numPages} // Display the total number of pages
        loading={false} // Display the loading overlay when we need it
        defaultPageSize={PAGE_SIZE}
        showPageSizeOptions={false}
        sortable={false}
        page={this.state.page}
        onPageChange={this.onFetchPage}
        className="-striped -highlight"
      />
    );
  }
}

const mapDispatchToProps = dispatch => ({
  fetchLeaderboard: (groupId, page) => dispatch(fetchLeaderboard(groupId, page)),
});

const mapStateToProps = state => ({
  user: getSessionUser(state) || state.session.user || {},
  leaderboards: state.leaderboards.records,
});

export default connect(mapStateToProps, mapDispatchToProps)(LeaderboardTable);
