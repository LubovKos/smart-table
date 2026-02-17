import {createComparison, defaultRules, rules} from "../lib/compare.js";

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

    // Создаем компаратор с правилами, включая arrayAsRange
    const compare = createComparison([
        'skipNonExistentSourceFields',
        'skipEmptyTargetValues',
        'arrayAsRange',  // Это правило нужно для диапазонов
        'stringIncludes',
        'exactEquality'
    ]);

    return (data, state, action) => {
        // Обработка очистки поля
        if (action && action.name === 'clear') {
            const field = action.dataset.field;
            const input = action.closest('.filter-wrapper').querySelector('input');
            
            if (input) {
                input.value = '';
                // Очищаем соответствующее поле в state
                if (field === 'date') {
                    state.searchByDate = '';
                } else if (field === 'customer') {
                    state.searchByCustomer = '';
                }
            }
            return data; // Возвращаем данные без фильтрации, чтобы показать все строки
        }

        // Подготавливаем состояние для сравнения с диапазонами
        const filterState = {
            date: state.searchByDate || '',
            customer: state.searchByCustomer || '',
            seller: state.searchBySeller || '',
            total: [state.totalFrom || '', state.totalTo || ''] // Диапазон для total
        };

        // Фильтрация данных с использованием компаратора
        return data.filter(row => compare(row, filterState));
    }
}