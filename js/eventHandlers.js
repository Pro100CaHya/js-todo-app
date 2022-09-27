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