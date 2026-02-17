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

const {data, ...indexes} = initData(sourceData);

function collectState() {
    const state = processFormData(new FormData(sampleTable.container));
    
    // ВАЖНО: Приводим к числам, иначе пагинация сломается (строка "1" + 1 = "11")
    const rowsPerPage = parseInt(state.rowsPerPage || 10);
    const page = parseInt(state.page || 1);

    return {
        ...state,
        rowsPerPage,
        page
    };
}

function render(action) {
    let state = collectState();
    let result = [...data];

    // Порядок применения важен:
    // 1. Глобальный поиск (Search)
    // 2. Фильтрация по колонкам (Filter)
    // 3. Сортировка (Sort)
    // 4. Пагинация (Pagination) - применяется последней, чтобы резать уже готовый список
    result = applySearching(result, state, action);
    result = applyFiltering(result, state, action);
    result = applySorting(result, state, action);
    result = applyPagination(result, state, action);

    sampleTable.render(result);
}

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    // Подключаем шаблоны поиска, заголовка и фильтров перед таблицей
    before: ['search', 'header', 'filter'],
    after: ['pagination']
}, render);

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
    seller: indexes.sellers // Важно: имя поля в indexes должно совпадать с name в html (seller)
});

const applySearching = initSearching('search'); // Поле, откуда берем строку поиска

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

render();