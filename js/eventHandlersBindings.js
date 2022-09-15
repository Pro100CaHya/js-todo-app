$buttonAdd.addEventListener("click", buttonAddClickHandler);
$buttonMenu.addEventListener("click", buttonMenuClickHandler);
$selectSort.addEventListener("change", selectSortChangeHandler);
$inputSearch.addEventListener("input", funcDebounce(searchInputHandler, 500));