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

    const buttonUpdateHandler = function funcButtonUpdateHandler() {
        const id = parseInt(this.getAttribute("data-id"));
        const task = state.tasks.filter(elem => elem.id === id)[0];

        setModal({ isOpen: true, type: "update" });
        openModal(task);
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
    const $buttonUpdate = document.querySelectorAll("[data-action='updateTask']");

    $checkbox.forEach(elem => elem.addEventListener("change", checkboxChangeHandler));
    $buttonDelete.forEach(elem => elem.addEventListener("click", buttonDeleteHandler));
    $buttonUpdate.forEach(elem => elem.addEventListener("click", buttonUpdateHandler));
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
            const categoryIsEmpty = checkStrForEmpty(category);

            if (categoryIsEmpty) {
                $tag.innerText = "Empty input!";
                $asideColumn.append($tag);
            }
            else {
                setCategories(category);
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

const closeModal = () => {
    document.querySelector("[data-name='modal']").remove();
}

const openModal = (task) => {
    const setInputName = function funcSetInputName() {
        $inputName.value = task.name;
    }

    const setInputDescription = function funcSetInputDescription() {
        $inputDescription.innerText = task.description;
    }

    const setPriority = function funcSetPriority() {
        [...$inputPriority].filter(priority => {
            const taskPriority = parseInt(priority.getAttribute("data-priority"));

            return taskPriority === task.priority;
        })[0].checked = true;
    }

    const setInputDeadline = function funcSetInputDeadline() {
        $inputDeadline.value = task.deadline;
    }

    const setCategory = function funcSetCategory() {
        let selectedCategoryId;

        state.categories.forEach((category, index) => {
            if (category === task.category) {
                selectedCategoryId = index;
            }
        })

        $selectCategory.selectedIndex = selectedCategoryId;
    }

    const getModalLayout = function funcGetModalLayout() {
        const getCategories = function funcGetCategories() {
            let options = "";
            
            state.categories.filter(category => category !== "See All")
                            .forEach(category => {
                                options += `
                                    <option value="${category}">
                                        ${category}
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
                </div>
                <div class="window__row" data-name="description">
                    <h2 class="window__subtitle">
                        Enter description
                    </h2>
                    <div data-name="inputDescription" contenteditable="true"
                        class="window__input-div input input_style_white input_size_s" type="text"
                        data-name="inputDescription">
                    </div>
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
                            placeholder="YYYY-MM-DD HH:MM" data-name="inputDeadline">
                    </div>
                    <div class="window__column" data-name="category">
                        <h2 class="window__subtitle">
                            Choose the category
                        </h2>
                        <select class="window__select select select_size_s select_style_white" data-name="inputCategory">
                            <option value="default" selected disabled>Categories</option>
                            ${getCategories()}
                        </select>
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
        const priority = parseInt([...$inputPriority].filter(elem => elem.checked)[0].getAttribute("data-priority"));

        const isNameEmpty = checkStrForEmpty(name);
        const isDescriptionEmpty = checkStrForEmpty(description);
        const isDeadlineInvalid = checkStrForValid(deadline, /\d\d\d\d-\d\d-\d\d \d\d:\d\d/gm);
        const isCategoryNoSelected = category === "default";

        const $labels = document.querySelectorAll(".window__label");

        if ($labels.length !== 0) {
            $labels.forEach(elem => elem.remove());
        }

        let taskIsValid = true;

        if (isNameEmpty) {
            const $label = document.createElement("p");
            $label.classList.add("window__label");
            $label.innerText = "Enter name, please (max 64 symbols)";
            $divName.append($label);
            taskIsValid = false;
        }

        if (isDescriptionEmpty) {
            const $label = document.createElement("p");
            $label.classList.add("window__label");
            $label.innerHTML = "Enter description, please (max 256 symbols)";
            $divDescription.append($label);
            taskIsValid = false;
        }

        if (isDeadlineInvalid) {
            const $label = document.createElement("p");
            $label.classList.add("window__label");
            $label.innerHTML = `
                Enter deadline, please
                <br>
                (valid format: YYYY-MM-DD)
            `;
            $divDeadline.append($label);
            taskIsValid = false;
        }

        if (isCategoryNoSelected) {
            const $label = document.createElement("p");
            $label.classList.add("window__label");
            $label.innerHTML = "Choose the category, please";
            $divCategory.append($label);
            taskIsValid = false;
        }

        if (taskIsValid && modalType === "add") {
            setTasks(
                [
                    {
                        id: Date.now(),
                        name,
                        description,
                        deadline,
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
            updateTask(taskId, { name, description, deadline, category, priority });
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

    const $buttonConfirm = document.querySelector("[data-action='confirm']");
    const $buttonClose = document.querySelector("[data-action='closeModal']");
    const $divName = document.querySelector("[data-name='name']");
    const $divDescription = document.querySelector("[data-name='description']");
    const $divDeadline = document.querySelector("[data-name='deadline']");
    const $divCategory = document.querySelector("[data-name='category']");
    const $inputName = document.querySelector("[data-name='inputName']");
    const $inputDescription = document.querySelector("[data-name='inputDescription']");
    const $inputPriority = document.querySelectorAll("[data-name='inputPriority']");
    const $inputDeadline = document.querySelector("[data-name='inputDeadline']");
    const $selectCategory = document.querySelector("[data-name='inputCategory']");

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