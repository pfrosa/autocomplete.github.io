
const autoCompleteList = document.querySelector('.autocomplete-list');
const autoCompleteInput = document.querySelector('.autocomplete-input');
const autoCompleteText = document.querySelector('.autocomplete-text');
const selectedListEl = document.querySelector('.selected-list')
//TODO: CHECK IF THIS IS A SET
const selectedList = new Array();

function setAutocompletList(list) {
    autoCompleteList.removeChild(autoCompleteList.firstElementChild);
    autoCompleteList.appendChild(document.createElement('ul'))
    list.slice(0, 10).forEach(text => {
        const li = document.createElement('li')
        li.innerText = text;
        li.addEventListener('click', (e) => doCompletion(text))
        li.addEventListener('mouseover', hoverSelected);
        autoCompleteList.firstElementChild.appendChild(li);

    });

}
function doSugestion(e) {
    const textValue = e.currentTarget.value;
    const find = values
        .sort((a, b) => b.length - a.length)
        .filter((el) => el.length > textValue.length && el.startsWith(textValue));
    // DO SPLIT : AND TYPE VALIDATIONS
    if (textValue.length && find.length) {
        autoCompleteText.value = find[0];
        autoCompleteList.classList.add('show');
        setAutocompletList(find);
    }
    else {
        autoCompleteText.value = '';
        autoCompleteList.classList.add('hide');
        autoCompleteList.classList.remove('show');
    }
}
function doCompletion(value = autoCompleteText.value) {
    autoCompleteInput.value = value;
    autoCompleteText.value = '';
    autoCompleteList.classList.add('hide');
    autoCompleteList.classList.remove('show');
    setAutocompletList([]);

}
function changeListSelected(displacement) {
    const list = Array.from(autoCompleteList.firstElementChild.children);
    const selectedIndex = list.findIndex(el => el.classList.contains("selected"))
    const newSelectedIndex = selectedIndex + displacement < 0 ? list.length + displacement : (selectedIndex + displacement) % list.length;
    list.forEach((el, i) => {
        if (i == newSelectedIndex) el.classList.add("selected");
        else el.classList.remove("selected");
    })
    if (list.length) autoCompleteText.value = list[newSelectedIndex].innerText;
}
function hoverSelected(e) {
    const item = e.currentTarget;
    const list = Array.from(item.parentElement.children);
    list.forEach(el => el.classList.remove('selected'));
    item.classList.add('selected');
    autoCompleteText.value = item.innerText;
}
function handleKeys(e) {
    // TAB, DOWN, UP, ENTER
    const especialKeyCodes = [9, 40, 38, 13];
    if (especialKeyCodes.indexOf(e.keyCode) !== -1) {
        if (e.keyCode == 9) doCompletion();
        if (e.keyCode == 40) changeListSelected(+1);
        if (e.keyCode == 38) changeListSelected(-1);
        if (e.keyCode == 13) addToSelectedList(autoCompleteInput.value)
        e.preventDefault();
    }

}
function renderSelectedList() {
    Array.from(selectedListEl.children).forEach(el => selectedListEl.removeChild(el))
    selectedList.forEach((el,i) => {
        const liEl = document.createElement('li');
        const removeBtn = document.createElement('button');
        removeBtn.innerText = 'X';
        liEl.innerText = el;
        liEl.appendChild(removeBtn);
        removeBtn.addEventListener('click', removeFromSelectedList.bind(this,i))
        selectedListEl.appendChild(liEl)
    })
}
function addToSelectedList(value) {
    selectedList.push(value);
    renderSelectedList();
}
function removeFromSelectedList(index) {
    selectedList.splice(index, 1);
    renderSelectedList();
}
autoCompleteInput.addEventListener('input', doSugestion)
autoCompleteInput.addEventListener('keydown', handleKeys)
autoCompleteInput.addEventListener('focus', doSugestion)
autoCompleteInput.addEventListener('blur', (e) => {
    autoCompleteText.value = '';
    autoCompleteList.classList.remove('show');
    autoCompleteList.classList.add('hide');
}) 