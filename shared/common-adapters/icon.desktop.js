/* @flow */

import React, {Component} from 'react'
import {globalColors, globalColorsDZ2} from '../styles/style-guide'
import {FontIcon} from 'material-ui'
import type {Props} from './icon'
import resolveRoot from '../../desktop/resolve-root'

export default class Icon extends Component {
  props: Props;

  _defaultColor (type: Props.type): ?string {
    switch (type) {
      case 'fa-custom-icon-proof-broken':
        return globalColorsDZ2.red
      case 'fa-custom-icon-proof-good-followed':
        return globalColorsDZ2.green
      case 'fa-custom-icon-proof-good-new':
        return globalColorsDZ2.blue2
      default:
        return null
    }
  }

  _defaultHoverColor (type: Props.type): ?string {
    switch (type) {
      case 'fa-custom-icon-proof-broken':
      case 'fa-custom-icon-proof-good-followed':
      case 'fa-custom-icon-proof-good-new':
        return this._defaultColor(type)
      default:
        return null
    }
  }

  // Some types are the same underlying icon.
  _typeToIconMapper (type: Props.type): Props.type {
    switch (type) {
      case 'fa-custom-icon-proof-good-followed':
      case 'fa-custom-icon-proof-good-new':
        return 'fa-custom-icon-proof-good'
      default:
        return type
    }
  }

  render () {
    let color = this._defaultColor(this.props.type)
    let hoverColor = this._defaultHoverColor(this.props.type)
    let iconType = this._typeToIconMapper(this.props.type)

    if (this.props.inheritColor) {
      color = 'inherit'
      hoverColor = 'inherit'
    } else {
      color = this.props.style && this.props.style.color || color || (this.props.opacity ? globalColors.grey1 : globalColors.grey2)
      hoverColor = this.props.style && this.props.style.hoverColor || hoverColor || (this.props.opacity ? globalColors.black : globalColors.grey1)
    }

    const isFontIcon = iconType.startsWith('fa-')

    if (isFontIcon) {
      return <FontIcon
        title={this.props.hint}
        style={{...styles.icon, opacity: this.props.opacity ? 0.35 : 1.0, ...this.props.style}}
        className={`fa ${iconType}`}
        color={color}
        hoverColor={this.props.onClick ? hoverColor : null}
        onMouseEnter={this.props.onMouseEnter}
        onMouseLeave={this.props.onMouseLeave}
        onClick={this.props.onClick}/>
    } else {
      return <img
        title={this.props.hint}
        style={{opacity: this.props.opacity ? 0.35 : 1.0, ...this.props.style}}
        onClick={this.props.onClick}
        srcSet={`${[1, 2, 3].map(mult => `${resolveRoot('shared/images/icons', this.props.type)}${mult > 1 ? `@${mult}x` : ''}.png ${mult}x`).join(', ')}`} />
    }
  }
}

Icon.propTypes = {
  type: React.PropTypes.string.isRequired,
  opacity: React.PropTypes.bool,
  hint: React.PropTypes.string,
  onClick: React.PropTypes.func,
  onMouseEnter: React.PropTypes.func,
  onMouseLeave: React.PropTypes.func,
  style: React.PropTypes.object,
  inheritColor: React.PropTypes.bool
}

export const styles = {
  icon: {
    fontSize: 16
  }
}
