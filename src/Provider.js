import React, { Component, PropTypes } from 'react';

const specialReactKeys = { children: true, key: true, ref: true };

export default class Provider extends Component {

  static contextTypes = {
    mobxStores: PropTypes.object,
  };

  static childContextTypes = {
    mobxStores: PropTypes.object.isRequired,
  };

  render() {
    return React.Children.only(this.props.children);
  }

  getChildContext() {
    const stores = {};
    // inherit stores
    const baseStores = this.context.mobxStores;
    if (baseStores) for (let key in baseStores) {
      stores[key] = baseStores[key];// 复制this.context.mobxStores上的数据
    }
    // add own stores
    for (let key in this.props)
      if (!specialReactKeys[key] && key !== "suppressChangedStoreWarning")// 抑制改变store警告
        stores[key] = this.props[key]; // 复制this.props上的数据
    return {
      mobxStores: stores
    };
  }

  componentWillReceiveProps(nextProps) {
    // Maybe this warning is too aggressive?
    if (Object.keys(nextProps).length !== Object.keys(this.props).length)
      console.warn("MobX Provider: The set of provided stores has changed. Please avoid changing stores as the change might not propagate to all children");
    if (!nextProps.suppressChangedStoreWarning)
      for (let key in nextProps)
        if (!specialReactKeys[key] && this.props[key] !== nextProps[key])
          console.warn("MobX Provider: Provided store '" + key + "' has changed. Please avoid replacing stores as the change might not propagate to all children");
  }
}
