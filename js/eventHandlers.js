const buttonMenuClickHandler = () => {
    setAside(!state.aside);

    updateAside();
}

const selectSortChangeHandler = (e) => {
    const sort = e.target.value;

    setFilter({sort});
    setFilteredTasks();
    updateList();
}

const searchInputHandler = (e) => {
    const searchQuery = e.target.value;

    setFilter({searchQuery});
    setFilteredTasks();
    updateList();
}

const buttonAddClickHandler = () => {
    setModal(true);
    updateModal();
}