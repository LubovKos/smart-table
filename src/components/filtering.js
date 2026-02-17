import {createComparison, defaultRules} from "../lib/compare.js";

export function initFiltering(elements, indexes) {
    // 1. Заполнение выпадающих списков
    // Проходим по ключам переданного объекта indexes (в main.js мы передали { searchBySeller: ... })
    Object.keys(indexes).forEach(elementName => {
        const select = elements[elementName];
        if (select) {
            // Очищаем текущие опции
            select.innerHTML = '';
            
            // Добавляем дефолтную опцию
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = '—';
            select.appendChild(defaultOption);
            
            // Добавляем опции из данных
            Object.values(indexes[elementName]).forEach(value => {
                const option = document.createElement('option');
                option.value = value;
                option.textContent = value;
                select.appendChild(option);
            });
        }
    });

    // 2. Создаем компаратор на базе стандартных правил
    const compare = createComparison(defaultRules);

    return (data, state, action) => {
        // 3. Обработка кнопки очистки фильтра
        if (action && action.name === 'clear') {
            const fieldName = action.dataset.field; // например 'date' или 'customer'
            // Находим input рядом с кнопкой
            const wrapper = action.closest('.filter-wrapper');
            const input = wrapper ? wrapper.querySelector('input') : null;
            
            if (input) {
                input.value = ''; // Визуальная очистка
                state[fieldName] = ''; // Логическая очистка для текущего цикла
            }
        }

        // 4. Подготовка state для сравнения
        // Копируем state, чтобы модифицировать его под правила сравнения
        const filterState = { ...state };

        // Преобразуем поля диапазона (totalFrom, totalTo) в одно поле (total), 
        // которое ожидает правило 'arrayAsRange' и которое есть в данных (row.total)
        if (filterState.totalFrom || filterState.totalTo) {
            filterState.total = [
                filterState.totalFrom, 
                filterState.totalTo
            ];
            // Удаляем исходные поля, чтобы правило 'skipNonExistentSourceFields' не блокировало проверку,
            // так как в строке данных (row) нет полей totalFrom/totalTo
            delete filterState.totalFrom;
            delete filterState.totalTo;
        }

        // 5. Применяем фильтрацию используя компаратор
        return data.filter(row => compare(row, filterState));
    }
}