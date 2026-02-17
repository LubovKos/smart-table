import {getPages} from "../lib/utils.js";

export const initPagination = ({pages, fromRow, toRow, totalRows}, createPage) => {
    // Сохраняем шаблон кнопки и очищаем контейнер
    const pageTemplate = pages.firstElementChild.cloneNode(true);
    pages.replaceChildren();

    return (data, state, action) => {
        // Убеждаемся, что работаем с числами
        const rowsPerPage = Number(state.rowsPerPage);
        // Вычисляем количество страниц, минимум 1
        const pageCount = Math.ceil(data.length / rowsPerPage) || 1;
        let page = Number(state.page);

        // Обработка навигации
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

        // Если после фильтрации текущая страница вышла за пределы, возвращаем на последнюю
        if (page > pageCount) page = pageCount;

        // Рендерим кнопки страниц
        const visiblePages = getPages(page, pageCount, 5);
        
        const pageElements = visiblePages.map(pageNumber => {
            const el = pageTemplate.cloneNode(true);
            return createPage(el, pageNumber, pageNumber === page);
        });
        
        pages.replaceChildren(...pageElements);

        // Обновляем статистику
        const currentTotal = data.length;
        if (currentTotal > 0) {
            fromRow.textContent = (page - 1) * rowsPerPage + 1;
            toRow.textContent = Math.min(page * rowsPerPage, currentTotal);
        } else {
            fromRow.textContent = 0;
            toRow.textContent = 0;
        }
        totalRows.textContent = currentTotal;

        // Возвращаем данные для текущей страницы
        const skip = (page - 1) * rowsPerPage;
        return data.slice(skip, skip + rowsPerPage);
    }
}