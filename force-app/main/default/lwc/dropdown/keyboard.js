function preventAndStop(event) {
    event.preventDefault();
    event.stopPropagation();
}

function handleEnterKey({event, currentIndex, dropdownInterface}){
    console.log(dropdownInterface());
    console.log(dropdownInterface);
    if (dropdownInterface.getIsDropdownOpen()) {
        console.log('select item');
    } else {
        console.log('else')
        if (dropdownInterface.getSelectedOptionId()) {
            console.log('openDropdown');            
            dropdownInterface.openDropdown();
        } else {
            console.log('second else happened');
        }
    }
}

function handleEscKey({event, currentIndex, dropdownInterface}){
    console.log('Esc');
    dropdownInterface.closeDropdown();
}

function handleUpKey({event, currentIndex, dropdownInterface}){
    preventAndStop(event);
    console.log('Up');
}

function handleDownKey({event, currentIndex, dropdownInterface}){
    preventAndStop(event);
    console.log('Down');
}

const eventToHandlerMap = {
    Enter       : handleEnterKey,
    Escape      : handleEscKey,
    Esc         : handleEscKey,
    Up          : handleUpKey,
    ArrowUp     : handleUpKey,
    Down        : handleDownKey,
    ArrowDown   : handleDownKey,

}

export function handleInputKeyUp({event, currentIndex, dropdownInterface}) {
    const parameters = {event, currentIndex, dropdownInterface};
    if (eventToHandlerMap[event.key]){
        eventToHandlerMap[event.key](parameters);
    }
}