import TodoHeader from "./components/header";
import TodoList from "./components/todo-list";

const App = () => {
	return (
		<div className="todo-container">
			<TodoHeader />
			<TodoList />
		</div>
	);
};

export default App;
