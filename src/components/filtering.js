import {createComparison, defaultRules} from "../lib/compare.js";

// Настройка компаратора
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    // Заполнение выпадающих списков опциями
    Object.keys(indexes).forEach(elementName => {
        if (elements[elementName]) {
            elements[elementName].append(
                ...Object.values(indexes[elementName]).map(name => {
                    const option = document.createElement('option');
                    option.value = name;
                    option.textContent = name;
                    return option;
                })
            );
        }
    });

    return (data, state, action) => {
        // Обработка очистки поля
        if (action && action.name === 'clear') {
            const field = action.dataset.field;
            const input = action.closest('.filter-wrapper').querySelector('input');
            
            if (input) {
                input.value = '';
                state[`searchBy${field.charAt(0).toUpperCase() + field.slice(1)}`] = '';
            }
        }

        // Фильтрация данных с использованием компаратора
        return data.filter(row => compare(row, state));
    }
}