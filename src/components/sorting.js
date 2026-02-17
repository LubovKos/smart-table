import {sortCollection, sortMap} from "../lib/sort.js";

export function initSorting(columns) {
    return (data, state, action) => {
        let field = null;
        let order = 'none';

        if (action && action.name === 'sort') {
            // Если событие вызвано кликом по кнопке сортировки
            
            // 1. Вычисляем следующее состояние по кругу (none -> up -> down -> none)
            const nextOrder = sortMap[action.dataset.value];
            
            // 2. Обновляем DOM атрибут нажатой кнопки
            action.dataset.value = nextOrder;
            
            // 3. Запоминаем параметры для текущей сортировки
            field = action.dataset.field;
            order = nextOrder;

            // 4. Сбрасываем состояние остальных кнопок сортировки
            columns.forEach(column => {
                if (column !== action) {
                    column.dataset.value = 'none';
                }
            });
        } else {
            // Если это обычная перерисовка (например, при фильтрации),
            // находим активную колонку сортировки, если она есть
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