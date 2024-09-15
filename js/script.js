const selectResult = document.querySelector('.select__result');
const selectOptionsContainer = document.querySelector('.select__options');
const selectOptions = document.querySelectorAll('.select__input');
const subscribeSelect = document.querySelector('.subscribe__select');
const femaleOption = document.querySelector('.select__input--female');
const maleOption = document.querySelector('.select__input--male');
const childrenOption = document.querySelector('.select__input--children');

femaleOption.checked = true;

function changeCheckedStatus(active, ...others) {
  Array.from(others).forEach((i) => {
    i.checked = false;
  });
  active.checked = true;
}

selectResult.addEventListener('click', (evt) => {
  selectOptionsContainer.classList.toggle('active');
  selectResult.classList.toggle('active');
  if (selectOptionsContainer.classList.contains("active")) {
    subscribeSelect.style.borderColor = "transparent";
  } else {
    subscribeSelect.style.borderColor = "#5f5f5f";
  }
});

selectOptionsContainer.addEventListener('mouseover', () => {
  selectOptionsContainer.classList.add('active');
});

selectOptionsContainer.addEventListener('mouseout', function () {
  subscribeSelect.style.borderColor = "#5f5f5f";
  this.classList.remove('active');
  selectResult.classList.remove('active');
});

selectOptions.forEach((item) => {
  item.addEventListener('click', function (evt) {
    const initialTextValue = selectResult.textContent;
    const activeOption = evt.target.nextSibling.nextSibling;
    const currentTextValue = activeOption.textContent;
    selectResult.textContent = currentTextValue;
    switch (currentTextValue) {
      case femaleOption.value:
        changeCheckedStatus(femaleOption, maleOption, childrenOption);
        break;
      case maleOption.value:
        changeCheckedStatus(maleOption, femaleOption, childrenOption);
        break;
      case childrenOption.value:
        changeCheckedStatus(childrenOption, femaleOption, maleOption);
        break;
      default:
        changeCheckedStatus(femaleOption, maleOption, childrenOption);
    }

    this.nextSibling.nextSibling.textContent = initialTextValue;
    selectOptionsContainer.classList.remove('active');
    selectResult.classList.remove('active');
  });
});


