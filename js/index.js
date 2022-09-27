const INITIAL_TASKS = [
    {
        id: 0,
        name: "Visit Spain",
        description: "Visit Madrid, Barcelona. Also visit El Classico",
        priority: 1,
        isDone: true,
        deadline: "2023-10-13 00:00",
        category: "Travelling"
    },
    {
        id: 1,
        name: "Build PC",
        description: "Need more than $2000",
        priority: 3,
        isDone: false,
        deadline: "2022-11-01 00:00",
        category: "Hobby"
    },
    {
        id: 2,
        name: "Rent an apartment in Moscow",
        description: null,
        priority: 5,
        isDone: false,
        deadline: "2022-12-31 00:00",
        category: "Lifestyle"
    },
    {
        id: 3,
        name: "Buy a Monitor",
        description: null,
        priority: 2,
        isDone: true,
        deadline: "2022-09-30 00:00",
        category: "Hobby"
    },
    {
        id: 4,
        name: "Read the book",
        description: null,
        priority: 4,
        isDone: true,
        deadline: "2022-09-21 00:00",
        category: "Hobby"
    },
    {
        id: 5,
        name: "Meet with Gleb",
        description: null,
        priority: 2,
        isDone: true,
        deadline: "2022-08-23 00:00",
        category: "Lifestyle"
    }
];

const INITIAL_CATEGORIES = [
    {
        id: 0,
        name: "See All"
    },
    {
        id: 1,
        name: "Travelling"
    },
    {
        id: 2,
        name: "Hobby"
    },
    {
        id: 3,
        name: "Lifestyle"
    }
]

const debounce = function funcDebounce(func, ms) {
    let timeout;

    return function () {
        const funcCall = () => {
            func.apply(this, arguments);
        }

        clearTimeout(timeout);
        timeout = setTimeout(funcCall, ms);
    }
}

const checkStrForEmpty = function funcStrForEmpty(str) {
    if (str.replace(/ +?/g, "") === "") {
        return true;
    }

    return false;
}

const checkStrForValid = function funcCheckStrForInvalid(str, reg) {
    if (str.match(reg) === null) {
        return true;
    }

    return false;
}

// Minify "querySelector" functions
const $ = function funcQuerySelector(selector) {
    return document.querySelector(selector);
}

const $$ = function funcQuerySelectorAll(selector) {
    return document.querySelectorAll(selector);
}

const state = {
    modal: {
        isOpen: false,
        type: null
    },
    tasks: [],
    filteredTasks: [],
    categories: [],
    filter: {
        sort: null,
        searchQuery: null,
        categoryName: "See All"
    }
}

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

const $aside = $("[data-name='aside']");
const $asideColumn = $("[data-name='asideColumn']");
const $asideNav = $("[data-name='asideNav']");
const $buttonAdd = $("[data-action='addTask']");
const $buttonMenu = $("[data-action='manageMenu']");
const $inputSearch = $("[data-action='searchTasks']");
const $list = $("[data-name='list']");
const $main = $("[data-name='main']")
const $selectSort = $("[data-action='sortTasks']");
const $todo = $("[data-name='todo']");

const updateAside = function funcUpdateAside() {
        $aside.classList.toggle("aside_active");
        $buttonMenu.classList.toggle("header__button_active")
        $todo.classList.toggle("todo_disabled");
}

const updateList = function funcUpdateList() {
    const getTaskLayout = function funcGetTaskLayout(elem) {
        const getTaskCheckbox = function funcGetTaskCheckbox(id, isDone) {
            if (isDone) return `<input type="checkbox" data-action="updateTaskIsDone" checked data-id="${id}">`;

            return `<input type="checkbox" data-action="updateTaskIsDone" data-id="${id}">`;
        }

        const getTaskPriorityAttr = function funcGetTaskPriorityAttr(priority) {
            let attributes = "";

            switch (priority) {
                case 1:
                    attributes = "alt='very-low' title='Very Low Priority'";
                    break;

                case 2:
                    attributes = "alt='low' title='Low Priority'";
                    break;

                case 3:
                    attributes = "alt='medium' title='Medium Priority'";
                    break;

                case 4:
                    attributes = "alt='high' title='High Priority'";
                    break;

                case 5:
                    attributes = "alt='very-high' title='Very High Priority'";
                    break;
            }

            return attributes;
        }

        const getTaskDate = function funcGetTaskDate(deadline) {
            const today = new Date(
                            `${
                                new Date(Date.now())
                            }`
                            .slice(4, 15)
                        );
            const dateDeadline = new Date(deadline);
            const daysLast = (dateDeadline - today) / (1000 * 60 * 60 * 24);

            if (daysLast > 1) {
                return `${dateDeadline}`.slice(4, 15);
            }

            if (daysLast === 1) {
                return "tomorrow";
            }

            if (daysLast === 0) {
                return "today";
            }

            else {
                return "overdue";
            }
        }

        const getTaskDescription = function funcGetTaskDescription(description) {
            if (description) {
                return `
                    <p class="task__description">
                        ${description}
                    </p>
                `
            }

            return "";
        }

        const htmlLayout = `
            <div class="task__row flex flex_align_center">
                <label class="task__label">
                    ${getTaskCheckbox(elem.id, elem.isDone)}
                    <span class="task__checkmark"></span>
                </label>
                <img class="task__icon" src="img/priorities/${elem.priority}.svg" ${getTaskPriorityAttr(elem.priority)}>
                <h2 class="task__name">${elem.name}</h2>
                <div class="task__date-block flex flex_align_center">
                    <img class="task__icon" src="img/calendar.svg" alt="Calendar">
                    <span class="task__date-value">${getTaskDate(elem.deadline)}</span>
                </div>
                <div class="task__category-block">
                    <span class="task__category">
                        ${elem.category}
                    </span>
                </div>
                <div class="task__column">
                    <button class="task__button button button_style_transparent" data-id="${elem.id}"
                        data-action="updateTask">
                        <img class="task__icon" src="img/info.svg" alt="info" title="Update Task">
                    </button>
                    <button class="task__button button button_style_transparent" data-id="${elem.id}"
                        data-action="deleteTask">
                        <img class="task__icon" src="img/remove.svg" alt="remove" title="Delete Task">
                    </button>
                </div>
            </div>
            ${getTaskDescription(elem.description)}
        `;

        return htmlLayout;
    }

    const buttonUpdateHandler = function funcButtonUpdateHandler() {
        const id = parseInt(this.getAttribute("data-id"));
        const task = state.tasks.filter(elem => elem.id === id)[0];

        setModal({ isOpen: true, type: "update" });
        openModal(task);
    }

    const checkboxChangeHandler = function funcCheckboxChangeHandler(e) {
        const isDone = e.target.checked;
        const id = parseInt(e.target.getAttribute("data-id"));

        updateTask(id, { isDone });
        setFilteredTasks();
        updateList();
    }

    const buttonDeleteHandler = function funcButtonDeleteHandler() {
        const id = parseInt(this.getAttribute("data-id"));

        deleteTask(id);
        setFilteredTasks();
        updateList();
    }

    console.log("Filter:", state.filter);
    console.log("Tasks:", state.filteredTasks);

    $list.innerHTML = ``;
    state.filteredTasks.forEach(task => {
        const $taskItem = document.createElement("div");
        $taskItem.classList.add("list__task", "task");
        $taskItem.innerHTML = getTaskLayout(task);
        $list.append($taskItem);
    });

    const $checkbox = $$("[data-action='updateTaskIsDone']");
    const $buttonDelete = $$("[data-action='deleteTask']");
    const $buttonUpdate = $$("[data-action='updateTask']");

    $checkbox.forEach(elem => elem.addEventListener("change", checkboxChangeHandler));
    $buttonDelete.forEach(elem => elem.addEventListener("click", buttonDeleteHandler));
    $buttonUpdate.forEach(elem => elem.addEventListener("click", buttonUpdateHandler));
}

const updateAsideNav = function funcUpdateAsideNav() {
    const buttonCategoryHandler = function funcButtonCategoryHandler() {
        const categoryId = parseInt(this.getAttribute("data-id"));
        const categoryName = state.categories.find((elem) => elem.id === categoryId).name;

        setFilter({ categoryName });
        setFilteredTasks();
        updateAsideNav();
        updateList();
    }

    const buttonAddCategoryHandler = function funcButtonAddCategoryHandler() {
        const buttonConfirmHandler = function funcButtonConfirmHandler() {
            $tag.innerText = "";
            const name = $inputCategory.value;
            const nameIsEmpty = checkStrForEmpty(name);
            const nameIsValid = (nameIsEmpty
                || !!(state.categories.find(category => category.name === name)));

            if (nameIsValid) {
                $tag.innerText = nameIsEmpty === true
                    ? "Empty input"
                    : "Input category already exists";

                $asideColumn.append($tag);
            }
            else {
                setCategories([{name, id: Date.now()}]);
                updateAsideNav();
            }
        }

        const buttonCancelHandler = function funcButtonCancelHandler() {
            $inputCategory.remove();
            $buttonConfirm.remove();
            $buttonCancel.remove();
            $tag.remove();
            $asideColumn.append($buttonAddCategory);
        }

        $buttonAddCategory.remove();

        const $inputCategory = document.createElement("input");
        $inputCategory.classList.add("aside__input", "input", "input_size_s", "input_style_white");
        $inputCategory.setAttribute("type", "text");

        const $buttonConfirm = document.createElement("button");
        $buttonConfirm.classList.add("aside__button-manage", "button", "button_style_blue", "button_size_xs");
        $buttonConfirm.innerText = "Confirm";

        const $buttonCancel = document.createElement("button");
        $buttonCancel.classList.add("aside__button-manage", "button", "button_style_red", "button_size_xs");
        $buttonCancel.innerText = "Cancel";

        const $tag = document.createElement("span");
        $tag.classList.add("aside__tag");

        $asideColumn.append($inputCategory);
        $asideColumn.append($buttonConfirm);
        $asideColumn.append($buttonCancel);
        $asideColumn.append($tag);

        $inputCategory.focus();
        $buttonConfirm.addEventListener("click", buttonConfirmHandler);
        $buttonCancel.addEventListener("click", buttonCancelHandler);
    }

    $asideNav.innerHTML = ``;
    state.categories.forEach((category) => {
        const $taskItem = document.createElement("button");
        $taskItem.classList.add("aside__button", "button", "button_size_s", "button_style_transparent");
        if (category.name === state.filter.categoryName) {
            $taskItem.classList.add("button_active");
        }
        $taskItem.setAttribute("data-id", category.id);
        $taskItem.setAttribute("data-action", "setCategory");
        $taskItem.innerHTML = `${category.name}`;
        $asideNav.append($taskItem);
    });

    $asideColumn.innerHTML = ``;
    const $buttonAddCategory = document.createElement("button");
    $buttonAddCategory.classList.add("aside__button", "button", "button_style_transparent", "button_size_s");
    $buttonAddCategory.setAttribute("data-action", "addCategory");
    $buttonAddCategory.innerText = "+ Add new";
    $asideColumn.append($buttonAddCategory);

    const $buttonCategory = $$("[data-action='setCategory']");
    const $todoSubtitle = $("[data-name='subtitle']");

    $todoSubtitle.innerText = state.filter.categoryName;
    $buttonCategory.forEach((button) => button.addEventListener("click", buttonCategoryHandler));
    $buttonAddCategory.addEventListener("click", buttonAddCategoryHandler);
}

const closeModal = function funcCloseModal() {
    $("[data-name='modal']").remove();
}

const openModal = function funcOpenModal(task) {
    const setInputName = function funcSetInputName() {
        $inputName.value = task.name;
    }

    const setInputDescription = function funcSetInputDescription() {
        $inputDescription.innerText = task.description;
    }

    const setPriority = function funcSetPriority() {
        [...$inputPriority].filter((priority) => {
            const taskPriority = parseInt(priority.getAttribute("data-priority"));

            return taskPriority === task.priority;
        })[0].checked = true;
    }

    const setInputDeadline = function funcSetInputDeadline() {
        $inputDeadline.value = task.deadline.slice(0, 10);
    }

    const setCategory = function funcSetCategory() {
        let selectedCategoryId = state
                                    .categories
                                    .findIndex((category) => {
                                        return category.name === task.category;
                                    });

        $selectCategory.selectedIndex = selectedCategoryId;
    }

    const getModalLayout = function funcGetModalLayout() {
        const getCategories = function funcGetCategories() {
            let options = "";
            
            state.categories.filter((category) => category.name !== "See All")
                            .forEach((category) => {
                                options += `
                                    <option value="${category.name}" data-id=${category.id}>
                                        ${category.name}
                                    </option>
                                `
                            });

            return options;
        }

        const getWindowTitle = function funcGetWindowTitle() {
            if (state.modal.type === "update") {
                return "Update Task";
            }

            return "Add Task";
        }

        const htmlLayout = `
            <div class="window">
                <button class="window__button-close button button_style_transparent" data-action="closeModal">
                    <img class="window__button-icon" src="img/remove.svg" alt="close">
                </button>
                <h2 class="window__title title">
                    ${getWindowTitle()}
                </h2>
                <div class="window__row" data-name="name">
                    <h2 class="window__subtitle">
                        Enter name
                    </h2>
                    <input data-name="inputName"
                        class="window__input input input_style_white input_size_s"
                        type="text" data-name="inputName">
                    <p class="window__label" data-name="labelName">
                    </p>
                </div>
                <div class="window__row" data-name="description">
                    <h2 class="window__subtitle">
                        Enter description
                    </h2>
                    <div data-name="inputDescription" contenteditable="true"
                        class="window__input-div input input_style_white input_size_s" type="text"
                        data-name="inputDescription">
                    </div>
                    <p class="window__label" data-name="labelDescription">
                    </p>
                </div>
                <div class="window__row flex">
                    <div class="window__column" data-name="setPriority">
                        <h2 class="window__subtitle">
                            Choose the priority
                        </h2>
                        <label class="window__priority flex flex_align_center">
                            <input type="radio" name="priority" checked data-name="inputPriority" data-priority="1">
                            <span class="window__priority-checkmark"></span>
                            <div class="window__priority-info flex flex_align_center">
                                <img class="window__priority-icon" src="img/priorities/1.svg" alt="very-low"
                                    title="Very Low">
                                <span class="window__priority-name">
                                    Very Low
                                </span>
                            </div>
                        </label>
                        <label class="window__priority flex flex_align_center">
                            <input type="radio" name="priority" data-name="inputPriority" data-priority="2">
                            <span class="window__priority-checkmark"></span>
                            <div class="window__priority-info flex flex_align_center">
                                <img class="window__priority-icon" src="img/priorities/2.svg" alt="low" title="Low">
                                <span class="window__priority-name">
                                    Low
                                </span>
                            </div>
                        </label>
                        <label class="window__priority flex flex_align_center">
                            <input type="radio" name="priority" data-name="inputPriority" data-priority="3">
                            <span class="window__priority-checkmark"></span>
                            <div class="window__priority-info flex flex_align_center">
                                <img class="window__priority-icon" src="img/priorities/3.svg" alt="medium"
                                    title="Medium">
                                <span class="window__priority-name">
                                    Medium
                                </span>
                            </div>
                        </label>
                        <label class="window__priority flex flex_align_center">
                            <input type="radio" name="priority" data-name="inputPriority" data-priority="4">
                            <span class="window__priority-checkmark"></span>
                            <div class="window__priority-info flex flex_align_center">
                                <img class="window__priority-icon" src="img/priorities/4.svg" alt="very-low"
                                    title="High">
                                <span class="window__priority-name">
                                    High
                                </span>
                            </div>
                        </label>
                        <label class="window__priority flex flex_align_center">
                            <input type="radio" name="priority" data-name="inputPriority" data-priority="5">
                            <span class="window__priority-checkmark"></span>
                            <div class="window__priority-info flex flex_align_center">
                                <img class="window__priority-icon" src="img/priorities/5.svg" alt="very-high"
                                    title="Very High">
                                <span class="window__priority-name">
                                    Very High
                                </span>
                            </div>
                        </label>
                    </div>
                    <div class="window__column" data-name="deadline">
                        <h2 class="window__subtitle">
                            Enter deadline
                        </h2>
                        <input type="text" class="window__input input input_style_white input_size_s"
                            placeholder="YYYY-MM-DD" data-name="inputDeadline" maxlength="10">
                        <p class="window__label window__label_size_m" data-name="labelDeadline">
                        </p>
                    </div>
                    <div class="window__column" data-name="category">
                        <h2 class="window__subtitle">
                            Choose the category
                        </h2>
                        <select class="window__select select select_size_s select_style_white" data-name="inputCategory">
                            <option value="default" selected disabled>Categories</option>
                            ${getCategories()}
                        </select>
                        <p class="window__label" data-name="labelCategory">
                        </p>
                    </div>
                </div>
                <div class="window__row">
                    <button class="window__button-add button button_style_blue button_size_s" data-action="confirm">
                        Confirm
                    </button>
                </div>
            </div>
        `;

        return htmlLayout;
    }

    const buttonConfirmHandler = function funcButtonConfirmHandler() {
        const name = $inputName.value;
        const description = $inputDescription.innerText;
        const deadline = $inputDeadline.value;
        const category = $selectCategory.selectedOptions[0].value;
        const priority = parseInt([...$inputPriority].filter((elem) => elem.checked)[0].getAttribute("data-priority"));

        const isNameEmpty = checkStrForEmpty(name);
        const isDescriptionEmpty = checkStrForEmpty(description);
        const isDeadlineInvalid = checkStrForValid(deadline, /\d\d\d\d-\d\d-\d\d/gm);
        const isCategoryNoSelected = category === "default";

        const $labels = $$(".window__label");
        $labels.forEach((elem) => elem.innerText = "");

        let taskIsValid = true;

        if (isNameEmpty || name.length > 64) {
            const $label = document.querySelector("[data-name='labelName']");
            $label.innerText = "Enter name, please (max 64 symbols)";
            taskIsValid = false;
        }

        if (isDescriptionEmpty || description.length > 256) {
            const $label = document.querySelector("[data-name='labelDescription']");
            $label.innerText = "Enter description, please (max 256 symbols)";
            taskIsValid = false;
        }

        if (isDeadlineInvalid) {
            const $label = document.querySelector("[data-name='labelDeadline']");
            $label.innerText = `Enter deadline, please
            (valid format: YYYY-MM-DD)`;
            taskIsValid = false;
        }

        if (isCategoryNoSelected) {
            const $label = document.querySelector("[data-name='labelCategory']");
            $label.innerText = "Choose the category, please";
            taskIsValid = false;
        }

        if (taskIsValid && modalType === "add") {
            setTasks(
                [
                    {
                        id: Date.now(),
                        name,
                        description,
                        deadline: `${deadline} 00:00`,
                        isDone: false,
                        category,
                        priority
                    }
                ]
            );
            setFilteredTasks();
            closeModal();
            updateList();
        }
        else if (taskIsValid && modalType === "update") {
            updateTask(taskId, { name, description, deadline: `${deadline} 00:00`, category, priority });
            setFilteredTasks();
            closeModal();
            updateList();
        }
        else {
            return;
        }
    }

    const buttonCloseHandler = function funcButtonCloseHandler() {
        setModal({ isOpen: false, type: null });

        closeModal();
    }

    const modalType = state.modal.type;
    let taskId;

    const $modal = document.createElement("section");
    $modal.classList.add("modal");
    $modal.setAttribute("data-name", "modal");
    $modal.innerHTML = getModalLayout();

    $main.append($modal);

    const $buttonConfirm = $("[data-action='confirm']");
    const $buttonClose = $("[data-action='closeModal']");
    const $inputName = $("[data-name='inputName']");
    const $inputDescription = $("[data-name='inputDescription']");
    const $inputPriority = $$("[data-name='inputPriority']");
    const $inputDeadline = $("[data-name='inputDeadline']");
    const $selectCategory = $("[data-name='inputCategory']");

    $buttonClose.addEventListener("click", buttonCloseHandler);
    $buttonConfirm.addEventListener("click", buttonConfirmHandler);

    if (modalType === "update") {
        setInputName();
        setInputDescription();
        setPriority();
        setInputDeadline();
        setCategory();
        taskId = task.id;
    }
}

const buttonMenuClickHandler = function funcButtonMenuClickHandler() {
    updateAside();
}

const selectSortChangeHandler = function funcSelectSortChangeHandler(e) {
    const sort = e.target.value;

    setFilter({sort});
    setFilteredTasks();
    updateList();
}

const searchInputHandler = function funcSearchInputHandler(e) {
    const searchQuery = e.target.value;

    setFilter({searchQuery});
    setFilteredTasks();
    updateList();
}

const buttonAddClickHandler = function funcButtonAddClickHandler() {
    setModal({ isOpen: true, type: "add" });
    openModal();
}

$buttonAdd.addEventListener("click", buttonAddClickHandler);
$buttonMenu.addEventListener("click", buttonMenuClickHandler);
$selectSort.addEventListener("change", selectSortChangeHandler);
$inputSearch.addEventListener("input", debounce(searchInputHandler, 500));

(function main() {
    setTasks(INITIAL_TASKS);
    setFilteredTasks();
    setCategories(INITIAL_CATEGORIES);
    updateAsideNav();
    updateList();
})();