function preventAndStop(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
}

function handleEnterKey({event, currentIndex, length, dropdownInterface}) {
    if (dropdownInterface.isDropdownOpen()) {
        if (currentIndex === -1) {
            dropdownInterface.moveHilightToIndex(0);
        } else {
            dropdownInterface.selectOptionByIndex(currentIndex);
        }
    } else {    
            dropdownInterface.openDropdown();
    }
}

function handleEscKey({event, currentIndex, length, dropdownInterface}) {
    preventAndStop(event);
    dropdownInterface.closeDropdown();
}

function handleUpKey({event, currentIndex, length, dropdownInterface}) {
    preventAndStop(event);
    requestAnimationFrame(() => {
    if (currentIndex === -1 || currentIndex === 0) {
        dropdownInterface.moveHilightToIndex(0);
    } else {
        dropdownInterface.moveHilightToIndex(currentIndex - 1);
    }
    })
}

function handleDownKey({event, currentIndex, length, dropdownInterface}) {
    preventAndStop(event);
    requestAnimationFrame(() => {
    if (currentIndex === -1 || currentIndex === length - 1) {
        dropdownInterface.moveHilightToIndex(length - 1);
    } else {
        dropdownInterface.moveHilightToIndex(currentIndex + 1);
    }
})
}

// function handlePageUp({event, currentIndex, length, dropdownInterface}) {
//     preventAndStop(event);
//     console.log('-PageUp-');
// }

// function handlePageDown({event, currentIndex, length, dropdownInterface}) {
//     preventAndStop(event);
//     console.log('-PageDown-');
// }

const eventToHandlerMap = {
    Enter       : handleEnterKey,
    Escape      : handleEscKey,
    Esc         : handleEscKey,
    Up          : handleUpKey,
    ArrowUp     : handleUpKey,
    Down        : handleDownKey,
    ArrowDown   : handleDownKey,
    // PageUp      : handlePageUp,
    // PageDown    : handlePageDown,
};

export function handleInputKeyUp({event, currentIndex, length, dropdownInterface}) {
    const parameters = {event, currentIndex, length, dropdownInterface};
    if (eventToHandlerMap[event.key]){
        eventToHandlerMap[event.key](parameters);
    }
}