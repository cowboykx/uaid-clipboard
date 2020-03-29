'use strict';

import React, { Component } from 'react';
import { Table, Icon, message } from 'antd';
import { inject, observer } from "mobx-react";
import moment from 'moment';

@inject('listStore')
@observer
export default class App extends Component<IComponentProps> {
  state = {
    tableHeight: `${document.documentElement.offsetHeight - 74}px`
  }

  constructor(props) {
    super(props);
    window.addEventListener('resize', e => this.setHeight());
  }

  setHeight = () => {
    this.setState({ tableHeight: `${document.documentElement.offsetHeight - 74}px` })
  }

  onDetailVisible = (item) => {
    this.props.listStore.detailItem = item;
    this.props.listStore.setDetailVisible();
  }

  onDelete = (id) => {
    this.props.listStore.delete(id);
    message.success('删除成功');
  }

  onRemove = (id) => {
    this.props.listStore.remove(id);
    message.success('删除成功');
  }

  onCancelDelete = (id) => {
    message.success('回复成功');
    this.props.listStore.cancelDelete(id);
  }

  onCopy = (item) => {
    window.writeText2Clipboard(item.content);
    this.props.listStore.lock();
    message.success('复制成功');
  }

  onFav = (id) => {
    this.props.listStore.toggleFav(id);
  }
  // componentWillMount(){}

  // componentDidMount(){}

  // componentWillReceiveProps(nextProps){}

  // shouldComponentUpdate(nextProps, nextState){}

  // componentWillUpdate(nextProps, nextState){}

  // componentDidUpdate(){}

  render() {
    const rowSelection = {
      onChange: (selectedRowKeys) => {
        this.props.listStore.updateSelectedRowKeys(selectedRowKeys);
      },
      selectedRowKeys: this.props.listStore.selectedRowKeys
    };
    const columns = [
      {
        title: 'content',
        dataIndex: 'content',
        ellipsis: true,
        render: (content, item) => {
          return (
            <span className="content" onClick={e => this.onDetailVisible(item)}>{content}</span>
          )
        }
      },
      {
        title: 'time',
        dataIndex: 'createTime',
        width: '120px',
        render(createTime) {
          if (createTime) {
            return (
              <span>
                {moment(createTime).format('MM-DD HH:mm')}
              </span>
            )
          }
        }
      },
      {
        title: 'handler',
        dataIndex: 'id',
        width: '100px',
        render: (id, record) => {
          return (
            <span className="handler" onClick={e => e.stopPropagation()}>
              {
                record.isDelete && (
                  <>
                    <Icon type="undo" theme="outlined" onClick={e => this.onCancelDelete(id)} />
                    <Icon type="delete" onClick={e => this.onRemove(id)} />
                  </>
                )
              }
              {
                !record.isDelete && (
                  <>
                    <Icon type="copy" onClick={e => this.onCopy(record)} />
                    <Icon
                      type="star"
                      theme={record.favourite ? 'filled' : 'outlined'}
                      onClick={e => this.onFav(id)} />
                    <Icon type="delete" theme="outlined" onClick={e => this.onDelete(id)} />
                  </>
                )
              }
            </span>
          )
        }
      },
    ];

    return (
      <Table
        style={{ flex: 1 }}
        scroll={{y: this.state.tableHeight}}
        rowKey={(record) => record.id}
        pagination={false}
        showHeader={false}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={this.props.listStore.getCurrentCategoryList()}
        size="small" />
    )
  }

  // componentWillUnmount(){}
}