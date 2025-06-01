import { useEffect, useState } from "react";
import TodoItem from "./todo-item";
import AddTodo from "./add-todo";
import type { TodoItemType } from "../type";

const TodoList = () => {
	const [todos, setTodos] = useState<TodoItemType[]>([]);
	useEffect(() => {
		const todos = sessionStorage.getItem("todos");
		if (todos) {
			setTodos(JSON.parse(todos));
		}
	}, []);

	useEffect(() => {
		if (todos.length > 0) {
			sessionStorage.setItem("todos", JSON.stringify(todos));
		}
	}, [todos]);

	const addTodo = (val: string) => {
		const newTodos = [
			...todos,
			{ id: Date.now(), text: val, isDelete: false, isDone: false },
		];
		setTodos(newTodos);
	};

	const doneHandler = (id: number) => {
		const newTodos = todos.map((item: TodoItemType) => {
			if (item.id === id) {
				item.isDone = !item.isDone;
			}
			return item;
		});
		setTodos(newTodos);
	};

	const deleteHandler = (id: number) => {
		const newTodos = todos.map((item: TodoItemType) => {
			if (item.id === id) {
				item.isDelete = !item.isDelete;
			}
			return item;
		});
		setTodos(newTodos);
	};

	return (
		<>
			{todos.map((item: TodoItemType) => {
				return (
					<TodoItem
						data={item}
						onDone={doneHandler}
						onDelete={deleteHandler}
						key={item.id}
					/>
				);
			})}
			<AddTodo onAdd={addTodo} />
		</>
	);
};

export default TodoList;
