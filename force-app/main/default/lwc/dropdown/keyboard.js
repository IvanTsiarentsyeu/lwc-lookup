function preventAndStop(event) {
    event.preventDefault();
    event.stopPropagation();
}

function handleEnterKey({event, currentIndex, length, dropdownInterface}) {
    if (dropdownInterface.isDropdownOpen()) {
        if (currentIndex === -1) {
            dropdownInterface.moveHilightToIndex(0);
        } else {
            if (currentIndex >= 0 && currentIndex < length) {
                dropdownInterface.selectOptionByIndex(currentIndex);
            }
        }
    } else {    
            dropdownInterface.openDropdown();
    }
}

function handleEscKey({event, currentIndex, length, dropdownInterface}) {
    preventAndStop(event);
    dropdownInterface.closeDropdown();
}

// НАДО ЛИ ИСПОЛЬЗОВАТЬ requestAnimationFrame ? РАБОТАЕТ И ТАК, И ТАК
function handleUpKey({event, currentIndex, length, dropdownInterface}) {
    preventAndStop(event);
    // requestAnimationFrame(() => {
    if (currentIndex === -1 || currentIndex === 0) {
        dropdownInterface.moveHilightToIndex(0);
    } else {
        dropdownInterface.moveHilightToIndex(currentIndex - 1);
    }
    // })
}

function handleDownKey({event, currentIndex, length, dropdownInterface}) {
    preventAndStop(event);
    requestAnimationFrame(() => {
    if (currentIndex === -1 || currentIndex === length - 1) {
        dropdownInterface.moveHilightToIndex(0);
    } else {
        dropdownInterface.moveHilightToIndex(currentIndex + 1);
    }
})
}

function handlePageUp({event, currentIndex, length, dropdownInterface}) {
    preventAndStop(event);
    if (currentIndex === -1 || currentIndex === 0) {
        dropdownInterface.moveHilightToIndex(0);
    } else {
        const skipCount = dropdownInterface.getVisibleOptionsCount();
        let skipTo = Math.max(0, currentIndex - skipCount);
        dropdownInterface.moveHilightToIndex(skipTo);
    }
}

function handlePageDown({event, currentIndex, length, dropdownInterface}) {
    preventAndStop(event);
    if (currentIndex === -1 || currentIndex === length - 1) {
        dropdownInterface.moveHilightToIndex(length - 1);
    } else {
        const skipCount = dropdownInterface.getVisibleOptionsCount();
        let skipTo = Math.min(length - 1, currentIndex + skipCount);
        dropdownInterface.moveHilightToIndex(skipTo);
    }
}

function handleHomeKey({event, currentIndex, length, dropdownInterface}) {
    preventAndStop(event);
    dropdownInterface.moveHilightToIndex(0);
}

function handleEndKey({event, currentIndex, length, dropdownInterface}) {
    preventAndStop(event);
    dropdownInterface.moveHilightToIndex(length - 1);
}

const eventToHandlerMap = {
    Enter       : handleEnterKey,
    Escape      : handleEscKey,
    Esc         : handleEscKey,

    Up          : handleUpKey,
    ArrowUp     : handleUpKey,
    Down        : handleDownKey,
    ArrowDown   : handleDownKey,

    PageUp      : handlePageUp,
    PageDown    : handlePageDown,

    Home        : handleHomeKey,
    End         : handleEndKey,

};

export function handleInputKeyUp({event, currentIndex, length, dropdownInterface}) {
    const parameters = {event, currentIndex, length, dropdownInterface};
    if (eventToHandlerMap[event.key]){
        eventToHandlerMap[event.key](parameters);
    }
}