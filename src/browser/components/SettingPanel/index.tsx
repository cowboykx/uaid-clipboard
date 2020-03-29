'use strict';

import React, { Component } from 'react';
import { Drawer, Divider, Switch } from 'antd';
import { inject, observer } from "mobx-react";

import ShortcutsRecorderSelect from '../ShortcutsRecorderSelect';

import './index.less';

@inject('settingStore')
@observer
export default class App extends Component<IComponentProps> {
  constructor(props) {
    super(props);
  }

  onSetMainShortcuts = (command) => {
    this.props.settingStore.setMainShortcuts(command.join('+'));
  }

  onSetRecordShortcuts = (command) => {
    this.props.settingStore.setRecorderShortcuts(command.join('+'));
  }

  onMainEnable = () => { this.props.settingStore.setMainShortcutsStatus(true) }
  onMainDisable = () => { this.props.settingStore.setMainShortcutsStatus(false) }
  onRecordEnable = () => { this.props.settingStore.setRecordShortcutsStatus(true) }
  onRecordDisable = () => { this.props.settingStore.setRecordShortcutsStatus(false) }

  render() {
    const settingStore = this.props.settingStore;

    return (
      <Drawer
        className="setting-panel"
        title={'Setting'}
        placement="right"
        closable={true}
        width="70%"
        onClose={e => settingStore.toggleVisible()}
        visible={settingStore.visible}
      >
        <h2>快捷键</h2>
        <h3>唤起主面板</h3>
        <ShortcutsRecorderSelect
          disable={!settingStore.mainShortcutsStatus}
          command={settingStore.mainShortcuts.split('+')}
          onChange={value => this.onSetMainShortcuts(value)}
          onEnable={this.onMainEnable}
          onDisable={this.onMainDisable}
        />
        <h3>开启/关闭 记录</h3>
        <ShortcutsRecorderSelect 
          disable={!settingStore.recordShortcutsStatus} 
          command={settingStore.recorderShortcuts.split('+')} 
          onChange={value => this.onSetRecordShortcuts(value)} 
          onEnable={this.onRecordEnable} 
          onDisable={this.onRecordDisable}
        />
        {/* <Divider />
        <div>
          深色主题 <Switch style={{ marginLeft: 10 }} checkedChildren="开" unCheckedChildren="关"/>
        </div> */}
      </Drawer>
    )
  }
}