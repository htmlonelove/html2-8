const resetFiltersButton = document.querySelector('.filters__button-clear');
const filterCheckboxesList = document.querySelectorAll('.filter__checkbox-wrapper .custom-checkbox__actual-checkbox')
const filterCheckboxesArray = [...filterCheckboxesList]

resetFiltersButton.addEventListener("click", (e) => {
  filterCheckboxesArray.forEach(ch => {
    ch.checked = false;
  })
});

