import { useState, type SetStateAction } from "react";
const AddTodo =  ({ onAdd }: { onAdd: (val: string) => void }) => {
    const [isAdd, setAddState] = useState(false);
	const [value, setValue] = useState('');
    const onAddClick = () => {
        setAddState(!isAdd)
    }
	const addHandler = () => {
		onAdd(value)
		setValue('')
		setAddState(false)
	}
	const onInputChange = (e: { target: { value: SetStateAction<string>; }; }) => {
		setValue(e.target.value)
	}
    return !isAdd 
		? <button onClick={onAddClick}>add todo</button> 
		: 	<>
			<input value={value} onChange={onInputChange}/>
			<button onClick={addHandler}>添加</button>
			</>
}

export default AddTodo;