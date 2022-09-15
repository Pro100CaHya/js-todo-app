const updateAside = () => {
    if (state.aside) {
        $aside.classList.add("aside_active");
        $buttonMenu.classList.add("header__button_active")
        $todo.classList.add("todo_disabled");
    }
    else {
        $aside.classList.remove("aside_active");
        $buttonMenu.classList.remove("header__button_active")
        $todo.classList.remove("todo_disabled");
    }
}

const updateList = () => {
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
            const secondsLast = new Date(deadline).getTime() - Date.now();
            const month = new Date(deadline).getMonth();
            const day31Months = [0, 2, 4, 6, 7, 9, 11];
            let days = 30;

            if (day31Months.includes(month)) days += 1;

            if (secondsLast >= 1000 * 60 * 60 * 24 * 365) {
                return "year+";
            }

            if (secondsLast >= 1000 * 60 * 60 * 24 * days) {
                return "month+";
            }

            if (secondsLast >= 1000 * 60 * 60 * 24 * 7) {
                return "week+";
            }

            if (secondsLast >= 1000 * 60 * 60 * 24) {
                return "day+";
            }

            if (secondsLast >= 1000 * 60 * 60) {
                return "hour+";
            }

            if (secondsLast >= 1000 * 60) {
                return "minute+";
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
                <span class="task__category">
                    ${elem.category}
                </span>
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
        `

        return htmlLayout;
    }

    const checkboxChangeHandler = (e) => {
        const isDone = e.target.checked;
        const id = parseInt(e.target.getAttribute("data-id"));

        updateTask(id, { isDone });
        setFilteredTasks();
        updateList();
    }

    const buttonDeleteHandler = function buttonDeleteHandler() {
        const id = parseInt(this.getAttribute("data-id"));

        deleteTask(id);
        setFilteredTasks();
        updateList();
    }

    console.log("Tasks:", state.filteredTasks);

    $list.innerHTML = ``;
    state.filteredTasks.forEach(task => {
        const $taskItem = document.createElement("div");
        $taskItem.classList.add("list__task", "task");
        $taskItem.innerHTML = getTaskLayout(task);
        $list.append($taskItem);
    });

    const $checkbox = document.querySelectorAll("[data-action='updateTaskIsDone']");
    const $buttonDelete = document.querySelectorAll("[data-action='deleteTask']");

    $checkbox.forEach(elem => elem.addEventListener("change", checkboxChangeHandler));
    $buttonDelete.forEach(elem => elem.addEventListener("click", buttonDeleteHandler));
}

const updateAsideNav = () => {
    const buttonCategoryHandler = function funcButtonCategoryHandler() {
        const category = this.getAttribute("data-name");

        setFilter({ category });
        setFilteredTasks();
        updateAsideNav();
        updateList();
    }

    const buttonAddCategoryHandler = function funcButtonAddCategoryHandler() {
        const buttonConfirmHandler = function funcButtonConfirmHandler() {
            $tag.innerText = "";
            const category = $inputCategory.value;
            const categoryIsNoEmpty = checkStrForEmpty(category);

            if (categoryIsNoEmpty) {
                setCategories(category);
                updateAsideNav();
            }
            else {
                $tag.innerText = "Empty input!";
                $asideColumn.append($tag);
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
        $buttonCancel.addEventListener("click", buttonCancelHandler)
    }

    $asideNav.innerHTML = ``;
    state.categories.forEach(category => {
        const $taskItem = document.createElement("button");
        $taskItem.classList.add("aside__button", "button", "button_size_s", "button_style_transparent");
        if (category === state.filter.category) {
            $taskItem.classList.add("button_active");
        }
        $taskItem.setAttribute("data-name", category);
        $taskItem.setAttribute("data-action", "setCategory");
        $taskItem.innerText = category;
        $asideNav.append($taskItem);
    });

    $asideColumn.innerHTML = ``;
    const $buttonAddCategory = document.createElement("button");
    $buttonAddCategory.classList.add("aside__button", "button", "button_style_transparent", "button_size_s");
    $buttonAddCategory.setAttribute("data-action", "addCategory");
    $buttonAddCategory.innerText = "+ Add new";
    $asideColumn.append($buttonAddCategory);

    const $buttonCategory = document.querySelectorAll("[data-action='setCategory']");

    $buttonCategory.forEach(button => button.addEventListener("click", buttonCategoryHandler));
    $buttonAddCategory.addEventListener("click", buttonAddCategoryHandler);
}

const updateModal = () => {
    const getModalLayout = function funcGetModalLayout() {
        const htmlLayout = `
            <div class="window">
                <button class="window__button-close button button_style_transparent" data-action="closeModal">
                    <img class="window__button-icon" src="img/remove.svg" alt="close">
                </button>
                <h2 class="window__title title">
                    Add Task
                </h2>
                <div class="window__row">
                    <h2 class="window__subtitle">
                        Enter name
                    </h2>
                    <input data-name="inputName" class="window__input input input_style_white input_size_s" type="text">
                    <p class="window__label">
                        Enter name, please (max 64 symbols)
                    </p>
                </div>
                <div class="window__row">
                    <h2 class="window__subtitle">
                        Enter description
                    </h2>
                    <div data-name="inputDescription" contenteditable="true"
                        class="window__input-div input input_style_white input_size_s" type="text">
                    </div>
                    <p class="window__label">
                        Enter description, please (max 256 symbols)
                    </p>
                </div>
                <div class="window__row flex">
                    <div class="window__column">
                        <h2 class="window__subtitle">
                            Choose the priority
                        </h2>
                        <label class="window__priority flex flex_align_center">
                            <input type="radio" name="priority" checked>
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
                            <input type="radio" name="priority">
                            <span class="window__priority-checkmark"></span>
                            <div class="window__priority-info flex flex_align_center">
                                <img class="window__priority-icon" src="img/priorities/2.svg" alt="low" title="Low">
                                <span class="window__priority-name">
                                    Low
                                </span>
                            </div>
                        </label>
                        <label class="window__priority flex flex_align_center">
                            <input type="radio" name="priority">
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
                            <input type="radio" name="priority">
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
                            <input type="radio" name="priority">
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
                    <div class="window__column">
                        <h2 class="window__subtitle">
                            Enter deadline (Optional)
                        </h2>
                        <input type="text" class="window__input input input_style_white input_size_s"
                            placeholder="YYYY-MM-DD HH:MM">
                        <p class="window__label">
                            Enter deadline, please
                            <br>
                            (valid format: YYYY-MM-DD)
                        </p>
                    </div>
                    <div class="window__column">
                        <h2 class="window__subtitle">
                            Choose the category
                        </h2>
                        <select class="window__select select select_size_s select_style_white">
                            <option value="default" selected disabled>Sort By</option>
                            <option value="name">Name</option>
                            <option value="description">Description</option>
                            <option value="priority (asc)">Priority (Asc)</option>
                            <option value="priority (desc)">Priority (Desc)</option>
                            <option value="deadline">Deadline</option>
                            <option value="status">Status</option>
                        </select>
                        <p class="window__label">
                            Choose the category, please
                        </p>
                    </div>
                </div>
            </div>
        `;

        return htmlLayout;
    }

    const buttonCloseHandler = function funcButtonCloseHandler() {
        setModal(false);

        updateModal();
    }

    if (state.modal) {
        const $modal = document.createElement("section")
        $modal.classList.add("modal");
        $modal.setAttribute("data-name", "modal");
        $modal.innerHTML = getModalLayout();

        $main.append($modal);

        const $buttonClose = document.querySelector("[data-action='closeModal']");
        $buttonClose.addEventListener("click", buttonCloseHandler);
    }
    else {
        document.querySelector("[data-name='modal']").remove();
    }
}