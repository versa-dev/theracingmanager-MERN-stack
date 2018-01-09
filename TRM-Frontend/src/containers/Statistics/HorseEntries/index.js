import React, {Component} from 'react'
import StatisticsTableHOC from '../StatisticsTableHOC'
import {connect} from 'react-redux'
import {
  fetchHorseStatisticsEntries,
  fetchHorseStatisticsEntriesDetail
} from 'actions/horse'
import HorseTable from 'components/horse/HorseStatisticsTable'

import moment from 'moment'

const tableColumns = [
  'DATE',
  'TIME',
  'COURSE',
  'RACE',
  'BEST'
]

const commentGenerator = (row) => {
  return row.COMMENT
}

class HorseStatisticsEntries extends Component {
  componentDidMount () {
    const {
      fetchHorseStatisticsEntries,
      match: {params: {slug}}
    } = this.props
    fetchHorseStatisticsEntries(slug)
  }

  render () {
    const {entries, onRowClick} = this.props

    return (
      <HorseTable
        title='Entries'
        firstColumns={tableColumns}
        data={entries}
        onRowClick={onRowClick}/>
    )
  }
}

const tableColumnsDetail = [
  'ENTRYNUMBER',
  'SILK',
  'HORSENAME',
  'JOCKEY',
  'TRAINER',
  'HORSEAGE',
  'BHARATING',
]

class HorseStatisticsEntriesDetail extends Component {
  componentDidMount () {
    const {
      fetchHorseStatisticsEntriesDetail,
      match: {params: {slug}},
      rowData,
    } = this.props
    fetchHorseStatisticsEntriesDetail(slug, rowData.DATE)
  }

  render () {
    const {
      entriesDetail,
      onRowClick,
      rowData,
      onReturnToMaster
    } = this.props

    const displayDate = moment(rowData.DATE).format('MMMM Do YYYY');

    return (
      <HorseTable
        title={`${rowData.COURSE} ${displayDate}`}
        data={entriesDetail}
        firstColumns={tableColumnsDetail}
        description={<a onClick={onReturnToMaster}>Back to entries</a>}/>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    entries: state.horse.horseInfo.statisticsEntries,
    entriesDetail: state.horse.horseInfo.statisticsEntriesDetail
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchHorseStatisticsEntries: (slug) => {
      dispatch(fetchHorseStatisticsEntries(slug))
    },
    fetchHorseStatisticsEntriesDetail: (slug, meetingDate) => {
      dispatch(fetchHorseStatisticsEntriesDetail(slug, meetingDate))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StatisticsTableHOC(HorseStatisticsEntries, HorseStatisticsEntriesDetail))
