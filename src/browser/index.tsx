/// <reference path="../common/component.d.ts" />

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider, observer, inject } from "mobx-react";
import { configure } from "mobx";
import hotkeys from 'hotkeys-js';

import stores from "./store/";
import { Item } from './model';

import SideBar from './components/Sidebar';
import Detail from './components/detail';
import List from './components/List';
import Handler from './components/Handler';
import SettingPanel from './components/SettingPanel';

import './index.less';

configure({ enforceActions: "observed" });

@inject('listStore')
@observer
class App extends Component<IComponentProps> {
  constructor(options) {
    super(options)
  }

  componentDidMount() {
    window.onClipboardUpdate = (msg) => {
      if (this.props.listStore.isLock === false) {
        this.props.listStore.add(new Item(msg).toString());
      }
    };

    hotkeys('command+r', (e) => e.preventDefault());
  }

  render() {
    return (
      <div className="main">
        <SideBar />
        <div className="list-wrap">
          <Handler />
          <List />
        </div>
        <Detail />
        <SettingPanel />
      </div>
    );
  }
}

ReactDOM.render(
  <Provider {...stores}>
    <App />
  </Provider>,
  document.getElementById('app')
);