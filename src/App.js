
import React, { useReducer, useState, useEffect } from "react";
import "./App.css"


const getInitialState = () => {
  const data = localStorage.getItem("todos");

  return {
    todos: data ? JSON.parse(data) : [],
    filter: "ALL"
  };
};


function reducer(state, action) {
  switch (action.type) {
    case "ADD":
      return {
        ...state,
        todos: [
          ...state.todos,
          { text: action.payload, completed: false }
        ]
      };

    case "TOGGLE":
      return {
        ...state,
        todos: state.todos.map((todo, index) =>
          index === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      };

    case "DELETE":
      return {
        ...state,
        todos: state.todos.filter((_, index) => index !== action.payload)
      };

    case "FILTER":
      return {
        ...state,
        filter: action.payload
      };

    case "MOVE":
      return {
        ...state,
        todos: state.todos.map((todo, index) =>
          index === action.payload.index
            ? { ...todo, completed: action.payload.completed }
            : todo
        )
      };

    default:
      return state;
  }
}

export default function TodoApp() {
  const [state, dispatch] = useReducer(reducer, {}, getInitialState);
  const [input, setInput] = useState("");


  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(state.todos));
  }, [state.todos]);

 
  const addTodo = () => {
    if (!input.trim()) return;
    dispatch({ type: "ADD", payload: input });
    setInput("");
  };

  const filteredTodos = state.todos.filter((todo) => {
    if (state.filter === "COMPLETED") return todo.completed;
    if (state.filter === "PENDING") return !todo.completed;
    return true;
  });

  return (
   <div className="app">
  <h2>Todo List</h2>

 
  <div className="input-box">
    <input
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder="Enter task..."
    />
    <button onClick={addTodo}>Add</button>
  </div>


  <div className="filters">


    <div className="slider" data-active={state.filter}></div>

    <button
      onClick={() => dispatch({ type: "FILTER", payload: "ALL" })}
      className={state.filter === "ALL" ? "active" : ""}
    >
      All
    </button>

    <button
      className={state.filter === "COMPLETED" ? "active drop-complete" : "drop-complete"}
      onClick={() => dispatch({ type: "FILTER", payload: "COMPLETED" })}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        const index = e.dataTransfer.getData("index");
        dispatch({
          type: "MOVE",
          payload: { index: Number(index), completed: true }
        });
      }}
    >
      ✅ Completed
    </button>

    <button
      className={state.filter === "PENDING" ? "active drop-pending" : "drop-pending"}
      onClick={() => dispatch({ type: "FILTER", payload: "PENDING" })}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        const index = e.dataTransfer.getData("index");
        dispatch({
          type: "MOVE",
          payload: { index: Number(index), completed: false }
        });
      }}
    >
      ⏳ Pending
    </button>

  </div>


  <ul className="list">
    {filteredTodos.map((todo, index) => (
      <li
        className="list-item"
        key={index}
        draggable
        onDragStart={(e) => e.dataTransfer.setData("index", index)}
      >
        <span
          className="todo-text"
          onClick={() =>
            dispatch({ type: "TOGGLE", payload: index })
          }
        >
          {todo.completed && <span className="tick">✔</span>}
          {todo.text}
        </span>

        <button
          className="delete-btn"
          onClick={() =>
            dispatch({ type: "DELETE", payload: index })
          }
        >
          Delete
        </button>
      </li>
    ))}
  </ul>
</div>
  );
}