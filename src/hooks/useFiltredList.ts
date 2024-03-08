import {useSelector} from "../app/model/store";

export const useFiltredList = () => {
    const oldTodos = useSelector((state) => state.todos);
    const filter = useSelector((state) => state.filter);
    return filter === null ? oldTodos : oldTodos.filter(todo => todo.done === filter)
}



