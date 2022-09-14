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
        const inputCategoryFocusOutHandler = function funcInputCategoryFocusOutHandler() {
            $inputCategory.remove();
            $asideColumn.append($buttonAddCategory);
        }

        const inputCategoryKeydownHandler = function funcInputCategoryKeydownHandler(e) {
            const code = e.code;

            if (code === "Enter") {
                const str = e.target.value
                const stringIsEmpty = checkStrForEmpty(e.target.value);
                
                if (stringIsEmpty) {
                    setCategories(str);
                    updateAsideNav();
                }
            }
        }

        $buttonAddCategory.remove();
        const $inputCategory = document.createElement("input");
        $inputCategory.classList.add("aside__input", "input", "input_size_s", "input_style_white");
        $asideColumn.append($inputCategory);
        $inputCategory.focus();
        $inputCategory.addEventListener("focusout", inputCategoryFocusOutHandler);
        $inputCategory.addEventListener("keydown", inputCategoryKeydownHandler);
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