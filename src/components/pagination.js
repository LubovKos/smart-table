import {getPages} from "../lib/utils.js";

export const initPagination = ({pages, fromRow, toRow, totalRows}, createPage) => {
    // Подготовка шаблона кнопки для страницы
    const pageTemplate = pages.firstElementChild.cloneNode(true);
    pages.firstElementChild.remove();

    return (data, state, action) => {
        // Расчет количества страниц
        const rowsPerPage = state.rowsPerPage;
        const pageCount = Math.ceil(data.length / rowsPerPage);
        let page = state.page;

        // Обработка действий пагинации
        if (action) {
            switch(action.name) {
                case 'prev': 
                    page = Math.max(1, page - 1); 
                    break;
                case 'next': 
                    page = Math.min(pageCount, page + 1); 
                    break;
                case 'first': 
                    page = 1; 
                    break;
                case 'last': 
                    page = pageCount; 
                    break;
            }
        }

        // Получение списка видимых страниц и их вывод
        const visiblePages = getPages(page, pageCount, 5);
        pages.replaceChildren(...visiblePages.map(pageNumber => {
            const el = pageTemplate.cloneNode(true);
            return createPage(el, pageNumber, pageNumber === page);
        }));

        // Обновление статуса пагинации
        fromRow.textContent = (page - 1) * rowsPerPage + 1;
        toRow.textContent = Math.min((page * rowsPerPage), data.length);
        totalRows.textContent = data.length;

        // Получение среза данных для текущей страницы
        const skip = (page - 1) * rowsPerPage;
        return data.slice(skip, skip + rowsPerPage);
    }
}