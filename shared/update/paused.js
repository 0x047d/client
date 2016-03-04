/* @flow */

import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Header, Text, Icon} from '../common-adapters'
import {Button} from '../common-adapters'
import {globalStyles} from '../styles/style-guide'

type RenderProps = {
  onForce: () => void,
  onKillProcesses: () => void,
  onCancel: () => void
}

class UpdatePaused extends Component {
  props: RenderProps;

  render () {
    return (
      <div style={styles.container}>
        <Header type='Strong' title='Update Paused' icon onClose={() => this.props.onCancel()} />
        <div style={styles.body}>
          <div style={{...globalStyles.flexBoxCenter, paddingTop: 15, paddingBottom: 15}}>
            <Icon type='logo-64' style={{width: 64, height: 64}} />
          </div>
          <div style={{paddingBottom: 15}}>
            <Text type='Header' dz2>You have files, folders or a terminal open in Keybase.</Text>
          </div>
          <Text type='Body' dz2 style={{paddingBottom: 15}}>
            You can force the update. That would be like yanking a USB drive and plugging it right back in.
            It'll instantly give you the latest version of Keybase, but you'll need to reopen any files you're working with.
            If you're working in the terminal, you'll need to&nbsp;
          </Text><Text dz2 type='Terminal'>cd</Text><Text type='Body' dz2>&nbsp;out of&nbsp;</Text><Text type='Terminal' dz2>/keybase</Text><Text type='Body' dz2>&nbsp;and back in.</Text>

          <div style={styles.actions}>
            <Button type='Secondary' dz2 label='Force' onClick={() => this.props.onForce()} />
            <Button type='Primary' dz2 label='Try again later' onClick={() => this.props.onCancel()} />
          </div>
        </div>
      </div>
    )
  }
}

const styles = {
  container: {
    ...globalStyles.flexBoxColumn
  },
  body: {
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 30
  },
  actions: {
    ...globalStyles.flexBoxRow,
    justifyContent: 'flex-end',
    marginTop: 15
  }
}

export default connect(
  state => state.updatePaused,
    undefined,
    (stateProps, dispatchProps, ownProps) => {
      return {
        ...stateProps,
        ...dispatchProps,
        ...ownProps
      }
    }
)(UpdatePaused)
