export function initFiltering(elements) {
    const updateIndexes = (elements, indexes) => {
        Object.keys(indexes).forEach((elementName) => {
            if (elements[elementName]) {
                elements[elementName].innerHTML = '<option value="">—</option>';
                Object.values(indexes[elementName]).forEach(name => {
                    const el = document.createElement('option');
                    el.textContent = name;
                    el.value = name;
                    elements[elementName].append(el);
                });
            }
        });
    }

    const applyFiltering = (query, state, action) => {
        if (action && action.name === 'clear') {
            const fieldName = action.dataset.field;
            const wrapper = action.closest('.filter-wrapper');
            const input = wrapper ? wrapper.querySelector('input') : null;
            
            if (input) {
                input.value = '';
                state[fieldName] = '';
            }
        }

        const filter = {};
        Object.keys(elements).forEach(key => {
            if (elements[key]) {
                if (['INPUT', 'SELECT'].includes(elements[key].tagName) && elements[key].value) { 
                    filter[`filter[${elements[key].name}]`] = elements[key].value; 
                }
            }
        });

        return Object.keys(filter).length ? Object.assign({}, query, filter) : query; 
    }

    return {
        updateIndexes,
        applyFiltering
    }
}