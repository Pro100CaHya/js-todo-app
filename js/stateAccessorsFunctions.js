const setModal = function funcSetModal(modalParams) {
    state.modal = {...modalParams};
}

const setFilter = function funcSetFilter(filter = {}) {
    state.filter = {...state.filter, ...filter};
}

const setCategories = function funcSetCategories(categories = []) {
    state.categories = [...state.categories, ...categories];
}

const setTasks = function funcSetTasks(tasks = []) {
    state.tasks = [...state.tasks, ...tasks];
}

const updateTask = function funcUpdateTask(id, keys) {
    const task = state.tasks.find(task => task.id === id);
    const taskId = state.tasks.findIndex(task => task.id === id);

    state.tasks.splice(taskId, 1, {...task, ...keys});
}

const deleteTask = function funcDeleteTask(id) {
    const taskId = state.tasks.findIndex(task => task.id === id);

    state.tasks.splice(taskId, 1);
}

const setFilteredTasks = function funcSetFilteredTasks(tasks = state.tasks, filter = state.filter) {
    const setSortedTasks = function funcSetSortedTasks(tasks, sort) {
        if (sort === null) {
           return tasks;
        }

        if (sort === "name") {
            return [...tasks]
                        .sort((firstTask, secondTask) => firstTask.name.localeCompare(secondTask.name));
        }

        if (sort === "deadline") {
            return [...tasks]
                        .sort((firstTask, secondTask) => {
                            const firstDateInSeconds = new Date(firstTask.deadline).getTime();
                            const secondDateInSeconds = new Date(secondTask.deadline).getTime();
                            return firstDateInSeconds - secondDateInSeconds;
                        });
        }

        if (sort === "priority (asc)") {
            return [...tasks]
                        .sort((firstTask, secondTask) => firstTask.priority - secondTask.priority);
        }

        if (sort === "priority (desc)") {
            return [...tasks]
                        .sort((firstTask, secondTask) => secondTask.priority - firstTask.priority);
        }

        if (sort === "status") {
            return [...tasks]
                        .sort((firstTask, secondTask) => secondTask.isDone - firstTask.isDone);
        }

        if (sort === "description") {
            return [...tasks]
                        .sort((firstTask, secondTask) => {
                            const firstDescription = firstTask.description || "";
                            const secondDescription = secondTask.description || "";

                            return secondDescription.localeCompare(firstDescription);
                        })
        }
    }

    const setSearchedTasks = function funcSetSearchedTasks(tasks, searchQuery) {
        if (searchQuery === null) return tasks;

        return tasks.filter(task => task.name
                                        .toLowerCase()
                                        .includes(
                                            searchQuery.toLowerCase()
                                        ));
    }

    const setCategorizedTasks = function funcSetCategorizedTasks(tasks, categoryName) {
        if (categoryName === "See All") {
            return tasks;
        }
        else {
            return tasks.filter(task => task.category === categoryName);
        }
    }

    const sortedTasks = setSortedTasks(tasks, filter.sort);
    const searchedTasks = setSearchedTasks(sortedTasks, filter.searchQuery);
    const categorizedTasks = setCategorizedTasks(searchedTasks, filter.categoryName);

    state.filteredTasks = categorizedTasks;
}