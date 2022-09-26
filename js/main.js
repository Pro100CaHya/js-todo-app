(function main() {
    setTasks(INITIAL_TASKS);
    setFilteredTasks();
    setCategories(state.tasks.map(task => task.category));
    updateAsideNav();
    updateList();
})();