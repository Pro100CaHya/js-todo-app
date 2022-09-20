$buttonAdd.addEventListener("click", buttonAddClickHandler);
$buttonMenu.addEventListener("click", buttonMenuClickHandler);
$selectSort.addEventListener("change", selectSortChangeHandler);
$inputSearch.addEventListener("input", debounce(searchInputHandler, 500));