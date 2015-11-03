'use strict'
/* @flow */

import React from '../../base-react'
import BaseComponent from '../../base-component'

import HardwarePhoneIphone from 'material-ui/lib/svg-icons/hardware/phone-iphone'
import HardwareComputer from 'material-ui/lib/svg-icons/hardware/computer'
import CommunicationVpnKey from 'material-ui/lib/svg-icons/communication/vpn-key'
import ActionNoteAdd from 'material-ui/lib/svg-icons/action/note-add'

import moment from 'moment'
import View from 'react-flexbox'
import { loadDevices } from '../../actions/devices'

export default class Devices extends BaseComponent {
  constructor (props) {
    super(props)
  }

  componentWillMount () {
    if (!this.props.devices && !this.props.waitingForServer) {
      this.props.loadDevices()
    }
  }

  connectNew () {
    console.log("Add device")
  }

  addPaperKey () {
    console.log("Add paper key")
  }

  static parseRoute (store, currentPath, nextPath) {
    return {
      componentAtTop: {
        title: 'Devices',
        mapStateToProps: state => {
          const { devices, waitingForServer } = state.devices
          return {
            devices,
            waitingForServer
          }
        },
        props: {
          loadDevices: () => store.dispatch(loadDevices())
        }
      }
    }
  }

  renderPhone(device) {
    return (
      <div style={Object.assign({}, styles.deviceOuter, styles.deviceShow)}>
        <div style={styles.device}>
          <HardwarePhoneIphone style={styles.deviceIcon}/>
          <h3 style={styles.line2}>{device.name}</h3>
          <div>Last used {moment(device.cTime).format('MM/DD/YY')}</div>
          <div style={styles.line2}>TODO: Get Added info</div>
          <div><a href="">Remove</a></div>
        </div>
      </div>
    )
  }

  renderDesktop(device) {
    return (
      <div style={Object.assign({}, styles.deviceOuter, styles.deviceShow)}>
        <div style={styles.device}>
          <HardwareComputer style={styles.deviceIcon} />
          <h3 style={styles.line2}>{device.name}</h3>
          <div>Last used {moment(device.cTime).format('MM/DD/YY')}</div>
          <div style={styles.line2}>TODO: Get Added info</div>
          <div><a href=''>Remove</a></div>
        </div>
      </div>
    )
  }

  renderPaperKey(device) {
    return (
      <div style={Object.assign({}, styles.deviceOuter, styles.deviceShow)}>
        <div style={styles.device}>
          <CommunicationVpnKey style={styles.deviceIcon} />
          <h3 style={styles.line2}>{device.name}</h3>
          <div>Last used {moment(device.cTime).format('MM/DD/YY')}</div>
          <div>Paper key</div>
          <div><a href="">Remove</a></div>
        </div>
      </div>
    )
  }

  renderDevice(device) {
    if (device.type == 'desktop') {
      return this.renderDesktop(device)
    } else if (device.type == 'phone') {
      return this.renderPhone(device)
    } else if (device.type == 'backup') {
      return this.renderPaperKey(device)
    } else {
      console.error('Unknown device type: ' + device.type)
    }
  }

  render () {
    return (
      <View column>
        <View row style={styles.deviceContainer}>
          <div style={Object.assign({}, styles.deviceOuter, styles.deviceAction)} onClick={() => this.connectNew()}>
            <div style={styles.device}>
              <ActionNoteAdd style={styles.deviceIcon} />
              <h3>Connect a new device</h3>
              <p style={Object.assign({}, styles.line4, styles.actionDesc)}>On another device, download Keybase then click here to enter your unique passphrase.</p>
            </div>
          </div>

          <div style={Object.assign({}, styles.deviceOuter, styles.deviceAction)} onClick={() => this.addPaperKey()}>
            <div style={styles.device}>
              <CommunicationVpnKey style={styles.deviceIcon} />
              <h3>Generate a new paper key</h3>
              <p style={Object.assign({}, styles.line4, styles.actionDesc)}>Portland Bushwick mumblecore.</p>
            </div>
          </div>
        </View>

        <View auto row style={styles.deviceContainer}>
          {
            this.props.devices && this.props.devices.map(device => this.renderDevice(device))
          }
        </View>
      </View>
    )
  }
}

const styles = {
  deviceContainer: {
    flexWrap: 'wrap',
    justifyContent: 'flex-start'
  },
  deviceOuter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 200,
    height: 200,
    margin: 10,
    padding: 10,
  },
  device: {
    width: 200,
    textAlign: "center",
  },
  deviceAction: {
    backgroundColor: '#efefef',
    border: "dashed 2px #999",
    cursor: "pointer",
  },
  deviceShow: {
    border: "solid 1px #999",
  },
  deviceIcon: {
    width: 48,
    height: 48,
    textAlign: "center"
  },
  actionDesc: {
  },

  // These might be good globals
  line1: {
    overflow: "hidden",
    display: "-webkit-box",
    textOverflow: "ellipsis",
    WebkitLineClamp: 1,
    WebkitBoxOrient: "vertical",
  },
  line2: {
    overflow: "hidden",
    display: "-webkit-box",
    textOverflow: "ellipsis",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
  },
  line4: {
    overflow: "hidden",
    display: "-webkit-box",
    textOverflow: "ellipsis",
    WebkitLineClamp: 4,
    WebkitBoxOrient: "vertical",
  }
};
