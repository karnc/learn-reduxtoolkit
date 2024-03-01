// connect的参数:
// 参数一: 函数
// 参数二: 函数
// 返回值: 函数 => 高阶组件

import { PureComponent } from "react";
import { StoreContext } from "./StoreContext";
// import store from "../store"

export function connect(mapStateToProps, mapDispatchToProps, store) {
  // 高阶组件: 函数
  return function(WrapperComponent) {
    class NewComponent extends PureComponent {
      constructor(props, context) {
        super(props)

        // 不使用context的方式 耦合度高，不适合发布出来供他人使用
        // this.state = mapStateToProps(store.getState())


        // 使用context的方式
        this.state = mapStateToProps(context.getState())
      }

      componentDidMount() {
           
        // 不使用context的方式
        // this.subscribe = store.subscribe(() => {
        //   // this.forceUpdate()
        //   this.setState(mapStateToProps(store.getState()))
        // })

         
        // 使用context的方式
        this.unsubscribe = this.context.subscribe(() => {
          // this.forceUpdate()
          this.setState(mapStateToProps(this.context.getState()))
        })
      }

      componentWillUnmount() {
        this.unsubscribe()
      }

      render() {
        // 不使用context的方式
        // const stateObj = mapStateToProps(store.getState())
        // const dispatchObj = mapDispatchToProps(store.dispatch)

        // 使用context的方式
        const stateObj = mapStateToProps(this.context.getState())
        const dispatchObj = mapDispatchToProps(this.context.dispatch)
      
        return <WrapperComponent {...this.props} {...stateObj} {...dispatchObj}/>
      }
    }

    // 使用context的方式
    NewComponent.contextType = StoreContext

    return NewComponent
  }
}
