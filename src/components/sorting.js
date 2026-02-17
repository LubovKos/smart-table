import {sortCollection, sortMap} from "../lib/sort.js";

export function initSorting(columns) {
    return (data, state, action) => {
        let field = null;
        let order = 'none';

        if (action && action.name === 'sort') {
            // Если кликнули по кнопке сортировки:
            // 1. Переключаем состояние (none -> up -> down -> none)
            const nextOrder = sortMap[action.dataset.value];
            action.dataset.value = nextOrder;
            
            // 2. Запоминаем текущие параметры для сортировки ПРЯМО СЕЙЧАС
            field = action.dataset.field;
            order = nextOrder;

            // 3. Сбрасываем остальные колонки
            columns.forEach(column => {
                if (column !== action) {
                    column.dataset.value = 'none';
                }
            });
        } else {
            // Если это просто перерисовка (например, поиск), ищем активную колонку
            const activeColumn = columns.find(column => column.dataset.value !== 'none');
            if (activeColumn) {
                field = activeColumn.dataset.field;
                order = activeColumn.dataset.value;
            }
        }

        // Применяем сортировку
        return sortCollection(data, field, order);
    }
}