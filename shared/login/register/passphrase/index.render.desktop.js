// @flow
import React, {Component} from 'react'
import {Text, Icon, Input, Button} from '../../../common-adapters'
import Container from '../../forms/container.desktop'
import type {Props} from './index.render'

type State = {passphrase: string}

class Render extends Component<void, Props, State> {
  state: State;

  constructor (props: Props) {
    super(props)

    this.state = {passphrase: ''}
  }

  onSubmit () {
    if (this.state.passphrase) {
      this.props.onSubmit(this.state.passphrase)
    }
  }

  onChange (passphrase: string) {
    this.setState({passphrase})
  }

  render () {
    return (
      <Container
        style={styles.container}
        onBack={() => this.props.onBack()}>
        <Text dz2 type='Header' style={styles.header}>Enter your passphrase:</Text>
        <Icon type='fa-unlock' style={styles.icon}/>
        <Input
          dz2
          style={styles.input}
          type='password'
          floatingLabelText='Passphrase'
          onEnterKeyDown={() => this.onSubmit()}
          onChange={event => this.onChange(event.target.value)}
          value={this.state.passphrase}
        />
        <Button
          dz2
          label='Continue'
          type='Primary'
          onClick={() => this.onSubmit()}
          enabled={this.state.passphrase}
        />
      </Container>
    )
  }
}

const styles = {
  container: {
    flex: 1,
    alignItems: 'center'
  },
  header: {
    marginTop: 80
  },
  input: {
    marginBottom: 48
  },
  icon: {
    fontSize: 30,
    marginTop: 10
  }
}

export default Render
