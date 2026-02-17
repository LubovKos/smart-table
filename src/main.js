import './fonts/ys-display/fonts.css'
import './style.css'

import {data as sourceData} from "./data/dataset_1.js";
import {initData} from "./data.js";
import {processFormData} from "./lib/utils.js";

import {initTable} from "./components/table.js";
import {initPagination} from "./components/pagination.js";
import {initSorting} from "./components/sorting.js";
import {initFiltering} from "./components/filtering.js";
import {initSearching} from "./components/searching.js";

// Исходные данные
const {data, ...indexes} = initData(sourceData);

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
    const state = processFormData(new FormData(sampleTable.container));
    
    // ВАЖНО: Приводим значения к числам, иначе пагинация будет работать со строками ("1" + 1 = "11")
    const rowsPerPage = parseInt(state.rowsPerPage || 10);
    const page = parseInt(state.page || 1);

    return {
        ...state,
        rowsPerPage,
        page
    };
}

/**
 * Перерисовка состояния таблицы
 * @param {HTMLButtonElement?} action
 */
function render(action) {
    let state = collectState();
    let result = [...data];
    
    // Применяем модули в правильном порядке:
    // 1. Поиск (отсеивает лишнее по тексту)
    // 2. Фильтрация (отсеивает по колонкам)
    // 3. Сортировка (упорядочивает)
    // 4. Пагинация (режет на страницы)
    result = applySearching(result, state, action);
    result = applyFiltering(result, state, action);
    result = applySorting(result, state, action);
    result = applyPagination(result, state, action);

    sampleTable.render(result)
}

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination']
}, render);

// Инициализация модулей

const applyPagination = initPagination(
    sampleTable.pagination.elements,
    (el, page, isCurrent) => {
        const input = el.querySelector('input');
        const label = el.querySelector('span');
        input.value = page;
        input.checked = isCurrent;
        label.textContent = page;
        return el;
    }
);

const applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);

const applyFiltering = initFiltering(sampleTable.filter.elements, {
    // ВАЖНО: Ключ здесь должен совпадать с data-name в HTML шаблоне 'filter'
    // В index.html это <select ... data-name="searchBySeller">
    searchBySeller: indexes.sellers
});

const applySearching = initSearching('search'); // data-name поля поиска

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

render();