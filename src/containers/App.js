import * as React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Header from '../components/Header'
import MainSection from '../components/MainSection'
import * as TodoActions from '../actions'

export class App extends React.Component {

  componentDidMount() {
    this.props.actions.getTodos();
  }

  render() {
    return (<div>
      <Header addTodo={this.props.actions.addTodo} />
      <MainSection todos={this.props.todos} actions={this.props.actions} />
    </div>);
  }
}

App.propTypes = {
  todos: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  todos: state.todos
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(TodoActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
