'use strict';

import React, { Component } from 'react';
import { Button, Modal, Icon, Input, message } from 'antd';
import { observer, inject } from 'mobx-react';

import './index.less';

@inject('sideBarStore', 'settingStore')
@observer
export default class App extends Component<IComponentProps> {
  state = {
    visible: false,
    value: ''
  }

  constructor(props) {
    super(props);
  }

  onSubmit = () => {
    const { value } = this.state;

    if (value.length === 0) {
      message.error('请输入');
      return
    }

    if (value.length > 8) {
      message.error('不能超过8字');
      return
    }

    this.props.sideBarStore.add(value);
    this.setState({visible: false});
  }

  onCancel = () => {
    this.setState({visible: false});
  }

  onDelete = (id) => {
    Modal.confirm({
      title: '确定删除?',
      content: '删除后该类目下的记录会全被删除',
      okText: '是',
      okType: 'danger',
      cancelText: '否',
      onOk: () => {
        this.props.sideBarStore.remove(id);
      }
    });
  }

  onSelect = (id) => {
    this.props.sideBarStore.select(id);
  }

  renderList(item) {
    return (
      <div 
        className={
          ["item", this.props.sideBarStore.selectedId === item.id ? 'selected' : ''].join(' ')
        }
        onClick={e => this.onSelect(item.id)}>
          <span>
            {item.icon ? <Icon type={item.icon} /> : <Icon type="user-add" />}
            {' ' +item.name}
          </span>
          {
            item.removeable !== false && <Icon type="delete" onClick={e => {
              e.stopPropagation();
              this.onDelete(item.id);
            }}/>
          }
      </div>
    )
  }

  render() {
    const { sideBarStore } = this.props;
    const list = sideBarStore.currentList;

    return (
      <div className="side-bar">
        <Modal
          title="新增"
          width={320}
          visible={this.state.visible}
          onOk={this.onSubmit}
          onCancel={this.onCancel}
        >
          <Input onPressEnter={this.onSubmit} value={this.state.value} onChange={e => this.setState({value: e.target.value})}/>
        </Modal>

        <div className="list">
          {
            list.map((item) => {
              if (item.id) {
                return this.renderList(item);
              }

              return <Button className="add-list" type="dashed" size="small" onClick={e => this.setState({ visible: true, value: '' })}>新增</Button>
            })
          }
          
        </div>
        <div className="setting-wrap">
          <Icon type="setting" onClick={e => this.props.settingStore.toggleVisible()}/>
        </div>
      </div>
    )
  }

  // componentWillUnmount(){}
}