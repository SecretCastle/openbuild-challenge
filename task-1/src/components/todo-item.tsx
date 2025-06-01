import type { TodoItemType } from "../type";

const TodoItem = ({
	data,
	onDone,
	onDelete,
}: {
	data: TodoItemType;
	onDone: (id: number) => void;
	onDelete: (id: number) => void;
}) => {
	const onDeleteHandler = (id: number) => {
		onDelete(id);
	};
	const onDoneHandler = (id: number) => {
		if (data.isDone) {
			return;
		}
		onDone(id);
	};

	return (
		<div
			className="todo-item"
			style={{
				display: "flex",
				justifyContent: "space-between",
				padding: "10px",
				borderBottom: "1px solid #ccc",
			}}
		>
			<div
				onClick={() => onDoneHandler(data.id)}
				style={{
					textDecoration: data.isDelete ? "line-through" : "",
					opacity: data.isDone ? "0.5" : "1",
				}}
			>
				<span>{data.id}</span>: &nbsp;
				<span>{data.text}</span>
			</div>
			{!data.isDone && (
				<div>
					<button onClick={() => onDeleteHandler(data.id)}>
						{data.isDelete ? "恢复" : "删除"}
					</button>
				</div>
			)}
		</div>
	);
};

export default TodoItem;
