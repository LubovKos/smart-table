import {createComparison, defaultRules} from "../lib/compare.js";

export function initFiltering(elements, indexes) {
    // 1. Заполнение выпадающих списков
    // Проходим по ключам переданных индексов (например, 'seller')
    Object.keys(indexes).forEach(elementName => {
        const select = elements[elementName];
        if (select) {
            // Очищаем и добавляем дефолтную опцию
            select.innerHTML = '';
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = '—';
            select.append(defaultOption);

            // Добавляем опции из данных
            Object.values(indexes[elementName]).forEach(value => {
                const option = document.createElement('option');
                option.value = value;
                option.textContent = value;
                select.append(option);
            });
        }
    });

    // 2. Создаем компаратор на основе стандартных правил
    const compare = createComparison(defaultRules);

    return (data, state, action) => {
        // 3. Обработка кнопки очистки (крестик в поле ввода)
        if (action && action.name === 'clear') {
            const fieldName = action.dataset.field; // например 'date' или 'customer'
            // Находим input в том же контейнере
            const wrapper = action.closest('.filter-wrapper');
            const input = wrapper ? wrapper.querySelector('input') : null;
            
            if (input) {
                input.value = ''; // Визуальная очистка
                state[fieldName] = ''; // Логическая очистка для текущего рендера
            }
        }

        // 4. Подготовка данных для сравнения
        // Нам нужно преобразовать поля 'totalFrom' и 'totalTo' в формат,
        // который понимает правило arrayAsRange ([from, to]) и который совпадает с ключом в данных ('total')
        const filterState = { ...state };
        
        if (filterState.totalFrom || filterState.totalTo) {
            filterState.total = [
                filterState.totalFrom, 
                filterState.totalTo
            ];
            // Удаляем исходные поля, чтобы правило skipNonExistentSourceFields не блокировало проверку
            // так как в данных (row) нет полей totalFrom/totalTo
            delete filterState.totalFrom;
            delete filterState.totalTo;
        }

        // 5. Фильтрация
        return data.filter(row => compare(row, filterState));
    }
}