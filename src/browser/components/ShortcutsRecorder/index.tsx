'use strict';

import React, { Component } from 'react';
import { Input, Icon } from 'antd';
import hotkeys from 'hotkeys-js';

const scope = hotkeys.getScope();

export default class App extends Component<IComponentProps> {
  private stack: Array<any> = [];

  state = {
    value: '',
    stack: [],
  }

  startRecord = false;

  constructor(props) {
    super(props);
  }

  isStart() {
    return hotkeys.shift || hotkeys.ctrl || hotkeys.alt || hotkeys.option || hotkeys.control || hotkeys.cmd || hotkeys.command; 
  }

  bind = () => {
    this.stack = [];
    hotkeys('*', { scope, keyup: true }, (event, handler) => {
      event.preventDefault();

      if (event.type === 'keydown') {
        if (this.startRecord === false) {
          this.onClear();
        }

        if (this.isStart()) {
          this.startRecord = true;
          this.setState({
            stack: [...this.state.stack, event.key]
          });
        }
      }

      if (event.type === 'keyup') {
        this.startRecord = false;
      }
    });
  }

  unBind = () => {
    hotkeys.unbind('*', scope);
  }

  onClear = () => {
    this.setState({ stack: [] });
  }

  render() {
    return (
      <div>
        <Input
          value={this.state.stack.join(' + ')}
          readOnly={true}
          onFocus={this.bind}
          onBlur={this.unBind}
          addonAfter={<Icon type="delete" onClick={this.onClear}/>}
        />
      </div>
    )
  }
}