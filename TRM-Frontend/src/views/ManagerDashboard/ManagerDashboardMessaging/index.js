import React, { PureComponent } from 'react'

/**
 *  @module View
 */
import View from 'components/routing/View'

/**
 *  @module ViewHeader
 */
import ViewHeader from 'components/managerdashboard/ManagerViewHeader'

/**
 *  @module title
 */
import { MANAGER_DASHBOARD_MESSAGING as title } from 'data/titles'

/**
 *  @module LinkHeader
 */
import LinkHeader from 'components/managerdashboard/ManagerLinkHeader'

import MessageSection from 'containers/ManagerDashboard/ManagerDashboardMessage'

/**
 *  @name Register
 *  @class
 *  @extends PureComponent
 */

class ManagerDashboardMessaging extends PureComponent {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <View title={title}>
        <div className="manager-dashboard">
          <div className="manager-dashboard-link__header">
            <LinkHeader />
          </div>
          <div className="manager-dashboard__header">
            <ViewHeader
              title={`${this.props.match.params.slug} messaging`} />
          </div>
          <div className="container manager-dashboard__messaging">
            <MessageSection />
          </div>
        </div>
      </View>
    )
  }
}

export default ManagerDashboardMessaging
