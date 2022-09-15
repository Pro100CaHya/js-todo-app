const setAside = (isOpen) => state.aside = isOpen;

const setModal = (modalParams) => state.modal = {...modalParams};

const setFilter = (filter = {}) => state.filter = {...state.filter, ...filter};

const setCategories = (category = null) => {
    state.categories = [...new Set([ ...state.categories, ...state.tasks.map(elem => elem.category)])];

    if (category !== null) {
        state.categories = [...new Set([ ...state.categories, category])];
    }
}

const setTasks = (tasks = []) => state.tasks = [...state.tasks, ...tasks];

const updateTask = (id, keys) => {
    state.tasks.forEach((task, index) => {
        if (task.id === id) {
            state.tasks.splice(index, 1, {...task, ...keys});
        }
    });
}

const deleteTask = (id) => {
    state.tasks.forEach((task, index) => {
        if (task.id === id) {
            state.tasks.splice(index, 1);
        }
    });
}

const setFilteredTasks = (tasks = state.tasks, filter = state.filter) => {
    const funcSetSortedTasks = function setSortedTasks(tasks, sort) {
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

                            return firstDescription - secondDescription;
                        })
        }
    }

    const funcSetSortedAndSearchedTasks = function setSortedAndSearchedTasks(tasks, searchQuery) {
        if (searchQuery === null) return tasks;

        return tasks.filter(task => task.name
                                        .toLowerCase()
                                        .includes(
                                            searchQuery.toLowerCase()
                                        ));
    }

    const funcSetSortedAndSearchedAndFilteredTasks = function setSortedAndSearchedAndFilteredTasks(tasks, category) {
        if (category === "See All") {
            return tasks;
        }
        else {
            return tasks.filter(task => task.category === category);
        }
    }

    const sortedTasks = funcSetSortedTasks(tasks, filter.sort);
    const sortedAndSearchedTasks = funcSetSortedAndSearchedTasks(sortedTasks, filter.searchQuery);
    const sortedAndSearchedAndFilteredTasks = funcSetSortedAndSearchedAndFilteredTasks(sortedAndSearchedTasks, filter.category);

    state.filteredTasks = sortedAndSearchedAndFilteredTasks;
}