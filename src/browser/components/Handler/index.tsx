'use strict';

import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { Icon, message, Button, Modal } from 'antd';

import './index.less';

@inject('sideBarStore', 'listStore')
@observer
export default class App extends Component<IComponentProps> {
  constructor(props) {
    super(props);
  }

  onBatchCopy = () => {
    const selectedItems = this.props.listStore.getSelectedItem();

    if (selectedItems.length > 0) {
      window.writeText2Clipboard(selectedItems.map(item => item.content).join('\r\n\r\n'));
      this.props.listStore.lock();
      message.success('批量复制成功');
    }
  }

  onBatchDelete = () => {
    Modal.confirm({
      title: '确定删除所有记录?',
      content: '确定删除所有记录?',
      okText: '是',
      okType: 'danger',
      cancelText: '否',
      onOk: () => {
        this.props.listStore.batchDelete();
        message.success('批量删除成功');
      }
    });
  }

  onBatchRecover = () => {
    this.props.listStore.batchRecover();
    message.success('批量恢复成功');
  }

  onSelectAll = () => {
    this.props.listStore.currentCategorySelectAll();
  }

  resetSelected() {
    this.props.listStore.currentCategoryUnSelectAll();
  }

  onCancelSelectAll = () => {
    this.resetSelected();
  }

  render() {
    return (
      <div className="handler-wrap">
        <div>
          <Button.Group>
            <Button size="small" onClick={this.onSelectAll}>
              全部选中
            </Button>
            <Button size="small" onClick={this.onCancelSelectAll}>
              全部取消选择
            </Button>
          </Button.Group>
        </div>
        <Button.Group>
          {
            this.props.sideBarStore.selectedId === -300 && (
              <Button size="small" type="primary" onClick={this.onBatchRecover}>
                <Icon type="undo" />
                批量恢复
              </Button>
            )
          }
          {
            this.props.sideBarStore.selectedId !== -300 && (
              <Button size="small" onClick={this.onBatchCopy}>
                <Icon type="upload" />
                批量复制
              </Button>
            )
          }
          <Button size="small" type="danger" onClick={this.onBatchDelete}>
            <Icon type="delete" />
            批量删除
          </Button>
        </Button.Group>
      </div>
    )
  }

  // componentWillUnmount(){}
}