// Slomux - реализация Flux, в которой, как следует из нвазвания, что-то сломано.
// Нужно выяснить что здесь сломано
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const createStore = (reducer, initialState) => {
  let currentState = initialState;
  const listeners = [];

  const getState = () => currentState;
  const dispatch = action => {;
    currentState = reducer(currentState, action)
    listeners.forEach(listener => listener())
  }

  const subscribe = listener => listeners.push(listener);

  return { getState, dispatch, subscribe };
}

const connect = (mapStateToProps, mapDispatchToProps) =>
  Component => {
    return class extends React.Component {
      render() {
        console.log('anonym class', this.props);
        return (
          // <Component
          //   {...mapStateToProps(store.getState(), this.props)}
          //   {...mapDispatchToProps(store.dispatch, this.props)}
          // />
          // this.props is delivered incorrectly
          <Component
          {...mapStateToProps(store.getState())}
          {...mapDispatchToProps(store.dispatch)}
          {...this.props}
        />
        )
      }

      componentDidMount() {
        store.subscribe(this.handleChange)
      }

      handleChange = () => {
        this.forceUpdate()
      }
    }
  }

class Provider extends React.Component {
  componentWillMount() {
    window.store = this.props.store
  }
  
  render() {
    return this.props.children
  }
}

// APP

// actions
const ADD_TODO = 'ADD_TODO'

// action creators
const addTodo = todo => ({
  type: ADD_TODO,
  payload: todo,
})

// reducers
const reducer = (state = [], action) => {
  switch(action.type) {
    case ADD_TODO:
      return [...state, action.payload]; // immutability
      return state;
    default:
      return state;
  }
}

// components
class ToDoComponent extends React.Component {
  state = {
    todoText: ''
  };
  // change order of class methods to get more readability
  // arrow functions here are more suitable to bind this
  updateText = e => {
    const { value } = e.target
    this.setState({ todoText: value });
   // this.state.todoText = value  // unsuitable state change
  }

  addTodo = () => {
    this.props.addTodo(this.state.todoText)
    this.setState({ todoText: '' });
    // this.state.todoText = ''  // unsuitable state change
  }

  render() {
    return (
      <div>
        <label htmlFor="titleName">{this.props.title || 'Без названия'}</label>
        <div>
          <input
            id="titleName" // to tie input with label
            value={this.state.todoText}
            placeholder="Название задачи"
            onChange={this.updateText}
          />
          <button onClick={this.addTodo}>Добавить</button>
          <ul>
            {this.props.todos.map((todo, idx) => <li key={`${todo + idx}`}>{todo}</li>)}
          </ul>
        </div>
      </div>
    );
  }
}

ToDoComponent.propTypes = {
  todos: PropTypes.array.isRequired,
  addTodo: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
};

// getting more readability

const mapStateToProps = state => ({
  todos: state,
});
const mapDispatchToProps = dispatch => ({
  addTodo: text => dispatch(addTodo(text)),
});

const ToDo = connect(mapStateToProps, mapDispatchToProps)(ToDoComponent);

// const ToDo = connect(state => ({
//   todos: state,
// }), dispatch => ({
//   addTodo: text => dispatch(addTodo(text)),
// }))(ToDoComponent)

// init
ReactDOM.render(
  <Provider store={createStore(reducer, [])}>
    <ToDo title="Список задач"/>
  </Provider>,
  document.getElementById('app')
)