import React, { PureComponent } from 'react'

import { withRouter } from 'react-router-dom'

import { connect } from 'react-redux'

import MessageInput from 'components/managerdashboard/managerdashboardMessaging/MessageInput'

import SubmitFeedPost from 'components/managerdashboard/managerdashboardMessaging/SubmitFeedPost'

import { getItem } from 'utils/storageutils'

import { USER_TOKEN } from 'data/consts'

import {
  getSyndicateMember,
  updateMessageSyndicateMember,
  syndiCateMemberMessagesPost
} from 'actions/managerdashboardmessaging'

import AjaxLoader from 'components/gui/Loaders/Ajaxloader'

const token = getItem(USER_TOKEN)

class ManagerDashboardMessage extends PureComponent {
  constructor () {
    super()

    this.postMessageFeed = this.postMessageFeed.bind(this)
  }

  componentDidMount () {
    let slug = this.props.match.params.slug
    this.props.getSyndicateMember(token, slug)
  }

  postMessageFeed (data) {
    let members = this.props.members && this.props.members.map((item) => item.id)
    let params = Object.assign({ members: members }, { message: data.text })
    let slug = this.props.match.params.slug
    this.props.postMessageFeed(params, token, slug)
  }

  render () {
    let searchSyndicateMembers = this.props.syndicateMembers && this.props.syndicateMembers.map((item) => ({ label: `${item.firstname}${item.surname}`, value: item._id}))
    return (
      <div>
        <div className='msg-input to'>
          <div className="input-label">
            <h5>TO</h5>
          </div>
          <MessageInput
            name='receiver'
            onSubmit={ () => {} }
            handleSelectName={ (data) => { this.props.updateMessageSyndicateMember(data) } }
            placeholder='NOT SELECTED'
            searchNames={searchSyndicateMembers}
            multi={true}
          />
        </div>
        <SubmitFeedPost
          // posted={posted}
          submitFeedUpdate={(data) => { this.postMessageFeed(data) }}
          reducerName='dashboardFeedPost'
        />
        <AjaxLoader isVisible={this.props.isPosting} />
        { this.props.resultMessage === 'success' ? <div className="result-message"><p>The messages were posted successfully!</p></div> : null }
        { this.props.resultMessage === 'failed' ? <div className="result-message"><p>The messages were failed!</p></div> : null }
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const {
    managerDashboardMessaging
  } = state

  return {
    syndicateMembers: managerDashboardMessaging.syndicateMembers || null,
    members: managerDashboardMessaging.members || null,
    resultMessage: managerDashboardMessaging.resultMessage || '',
    isPosting: managerDashboardMessaging.isPosting || false
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getSyndicateMember: (token, slug) => {
      dispatch(getSyndicateMember(token, slug))
    },
    updateMessageSyndicateMember: (data) => {
      dispatch(updateMessageSyndicateMember(data))
    },
    postMessageFeed: (data, token, slug) => {
      dispatch(syndiCateMemberMessagesPost(data, token, slug))
    }
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(ManagerDashboardMessage))
