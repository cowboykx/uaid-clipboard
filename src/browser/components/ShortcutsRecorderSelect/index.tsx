'use strict';

import React, { Component } from 'react';
import { Select, Switch } from 'antd';

interface IProps extends IComponentProps {
  onChange(val: Array<string>): void,
  onEnable(): void,
  onDisable(): void,
  command: Array<string>,
  disable: boolean,
}

interface IState {
  command: Array<string>,
  enable: boolean,
}

const { Option } = Select;

const META = 'Command|Options|Ctrl|Shift|-';

export default class App extends Component<IProps, IState> {
  state = {
    command: ['Command', 'Ctrl', 'R'],
    enable: true
  }

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.setState({
      enable: !this.props.disable,
      command: this.props.command || this.state.command
    });
  }

  onKeyChange = (index, value) => {
    const command = this.state.command;
    
    command[index] = value;
    this.props.onChange && this.props.onChange(this.state.command.filter(v => v !== '-'));
    this.setState({ command });
  }

  onEnable = (enable) => {
    if (enable) {
      this.props.onEnable && this.props.onEnable();
    } else {
      this.props.onDisable && this.props.onDisable();
    }
    this.setState({ enable });
  }

  render() {
    return (
      <div>
        <Select
          value={this.state.command[0]}
          size="small"
          style={{ width: 100 }}
          onChange={value => this.onKeyChange(0, value)}
        >
          {
            META.split('|').filter(v => v !== this.state.command[1]).map(key => <Option key={key}>{key}</Option>)
          }
        </Select>
        <Select
          value={this.state.command[1]}
          size="small"
          style={{ width: 100, marginLeft: 10  }}
          onChange={value => this.onKeyChange(1, value)}
        >
          {
            META.split('|').filter(v => v !== this.state.command[1]).map(key => <Option key={key}>{key}</Option>)
          }
        </Select>
        <Select
          value={this.state.command[2]}
          size="small"
          style={{ width: 80, marginLeft: 10 }}
          onChange={value => this.onKeyChange(2, value)}
        >
          {
            'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(key => <Option key={key}>{key}</Option>)
          }
        </Select>
        <Switch style={{ marginLeft: 10 }} checkedChildren="开启" checked={this.state.enable} unCheckedChildren="关闭" onChange={this.onEnable} />
      </div>
    )
  }
  // componentWillUnmount(){}
}