'use strict';

import React, { Component } from 'react';
import { Drawer } from 'antd';
import { inject, observer } from "mobx-react";
import moment from 'moment';

import './index.less';

@inject('listStore')
@observer
export default class App extends Component<IComponentProps> {
  constructor(props) {
    super(props);
  }

  render() {
    const listStore = this.props.listStore;

    return (
      <Drawer
        className="item-detail-wrap"
        title={listStore.detailItem && listStore.detailItem.content}
        placement="right"
        closable={false}
        width="70%"
        onClose={e => listStore.setDetailInvisible()}
        visible={listStore.detailVisible}
      >
        {
          listStore.detailItem && (
            <>
              <p>创建时间: 
                {
                  moment(listStore.detailItem.createTime).format('YYYY-MM-DD HH:mm:ss')
                }
              </p>
              <textarea
                readOnly
                className="detail-item-content"
                value={listStore.detailItem.content} />
            </>
          )
        }
      </Drawer>
    )
  }

  // componentWillUnmount(){}
}