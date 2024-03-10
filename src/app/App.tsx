import './App.css';
import {useDispatch, useSelector} from "./model/store";
import {
    addNewTodo,
    deleteOneTodo,
    updateFilter,
    updateOldTodo, updateTodoList
} from "./model/store/todoSlice.ts";
import {useEffect, useState} from "react";
import {Todo} from "./model/store/types.ts";
import {useFiltredList} from "../hooks";
import {nanoid} from "nanoid";
import {DragDropContext, Droppable, Draggable, DropResult} from 'react-beautiful-dnd';

function App() {
    const oldTodos = useFiltredList();
    const dispatch = useDispatch();

    const [newTodo, setNewTodo] = useState<Todo>({id: '1', done: false, title: ''});
    const [editTodo, setEditTodo] = useState<Todo | null>(null);
    const [error, setError] = useState('');
    const addTodo = () => {
        if(!newTodo.title){
            setError('Поле "Описание задачи" не может быть пустым.');
            return
        }
        dispatch(addNewTodo({id: nanoid(), done: false, title: newTodo.title}));
        setNewTodo({...newTodo, title: ''});
        setError('');
    };

    const updateTodo = (updatedTodo: Todo) => {
        dispatch(updateOldTodo(updatedTodo));
    };

    const deleteTodo = (todo: Todo) => {
        dispatch(deleteOneTodo(todo));
    };

    const setFilter = (value: string) => {
        const currentValue = value === 'null' ? null : value === 'true';
        dispatch(updateFilter(currentValue));
    };

    const filter = useSelector((state) => state.filter);
    const stringFilter = filter === null ? 'null' : String(filter);

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) {
            return;
        }

        const {source, destination} = result;
        const reorderedTodos = Array.from(oldTodos);
        const [removed] = reorderedTodos.splice(source.index, 1);
        reorderedTodos.splice(destination.index, 0, removed);
        dispatch(updateTodoList(reorderedTodos))
    };

    useEffect(() => {
        dispatch(updateFilter(null))
    }, [dispatch])
    return (
        <div className='main_container'>
            <h1>
                Список задач
            </h1>
            <div className='add_todo_container'>
                <div className='add_todo_area'>
                    <input
                        className={`${error && 'error_input'} add_todo_input`}
                        value={newTodo.title}
                        placeholder={'Введите краткое описание задачи'}
                        onChange={e => setNewTodo({...newTodo, title: e.target.value})}
                    />
                    {error && <div className='error_alert'>{error}</div>}
                </div>
                <button className='add_todo_btn' onClick={addTodo}>Добавить новую задачу</button>
            </div>
            <div className='select'>
                <select value={stringFilter} onChange={e => setFilter(e.target.value)}>
                    <option value='null'>Все задачи</option>
                    <option value='true'>Выполненные</option>
                    <option value='false'>Не выполненные</option>
                </select>
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
                    {oldTodos.length > 0 ? (
                        <Droppable droppableId="todos">
                            {(provided) => (
                                <div className='todo_list'  ref={provided.innerRef} {...provided.droppableProps}>
                                    {oldTodos.map((todo, index) => (
                                        <Draggable key={todo.id} draggableId={todo.id} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className='todo_card'
                                                >
                                                    <div>
                                                        <div className='todo_checked'>
                                                            <input
                                                                type="checkbox"
                                                                checked={todo.done}
                                                                onChange={() =>
                                                                    updateTodo({
                                                                        ...todo,
                                                                        done: !todo.done
                                                                    })
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className='todo_title'>
                                                        {editTodo?.id === todo.id ? (
                                                            <input
                                                                className='edit_title_input'
                                                                value={editTodo.title}
                                                                onChange={e =>
                                                                    setEditTodo({
                                                                        ...editTodo,
                                                                        title: e.target.value
                                                                    })
                                                                }
                                                            />
                                                        ) : (
                                                            <>{todo.title}</>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <div className='row_buttons'>
                                                            {editTodo?.id === todo.id ? (
                                                                <button
                                                                    className='todo_btn'
                                                                    onClick={() => {
                                                                        updateTodo({
                                                                            ...todo,
                                                                            title: editTodo?.title
                                                                        });
                                                                        setEditTodo(null);
                                                                    }}
                                                                >
                                                                    <img src={'/check.svg'} alt=''/>
                                                                </button>
                                                            ) : (
                                                                <button className='todo_btn' onClick={() => setEditTodo(todo)}>
                                                                    <img src={'/pencil.svg'} alt=''/>
                                                                </button>
                                                            )}
                                                            <button
                                                                className='todo_btn'
                                                                onClick={() => deleteTodo(todo)}>
                                                                <img src={'/trash.svg'} alt=''/>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ) : (
                        <div>
                            <div className='empty_list_notification'>Здесь будут выбранные задачи</div>
                        </div>
                    )}
            </DragDropContext>
        </div>
    );
}

export default App;