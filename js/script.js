const selectResult=document.querySelector('.select__result');
const selectOptionsContainer=document.querySelector('.select__options');
const selectOptions=document.querySelectorAll('.select__input');

selectResult.addEventListener('click',()=>{
  selectOptionsContainer.classList.toggle('active');
});

selectOptions.forEach((item)=>{
  item.addEventListener('click',(evt)=>{
    selectResult.textContent=evt.currentTarget.nextSibling.nextSibling.textContent;
    selectOptionsContainer.classList.toggle('active');
  });
});
