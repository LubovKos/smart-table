import {getPages} from "../lib/utils.js";

export const initPagination = ({pages, fromRow, toRow, totalRows}, createPage) => {
    // Сохраняем шаблон кнопки страницы и очищаем контейнер
    const pageTemplate = pages.firstElementChild.cloneNode(true);
    pages.replaceChildren(); // Очищаем полностью

    return (data, state, action) => {
        const rowsPerPage = Number(state.rowsPerPage);
        const pageCount = Math.ceil(data.length / rowsPerPage) || 1; // Защита от деления на 0
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

        // Если после фильтрации страниц стало меньше, чем текущая - сбрасываем
        if (page > pageCount) page = pageCount;

        // Рендеринг кнопок страниц
        const visiblePages = getPages(page, pageCount, 5); // Показываем 5 кнопок
        
        const pageElements = visiblePages.map(pageNumber => {
            const el = pageTemplate.cloneNode(true);
            // createPage заполняет input и span значениями
            return createPage(el, pageNumber, pageNumber === page);
        });
        
        pages.replaceChildren(...pageElements);

        // Обновление текстовой статистики (1-10 of 50)
        // Если данных нет, пишем 0
        const currentTotal = data.length;
        if (currentTotal > 0) {
            fromRow.textContent = (page - 1) * rowsPerPage + 1;
            toRow.textContent = Math.min(page * rowsPerPage, currentTotal);
        } else {
            fromRow.textContent = 0;
            toRow.textContent = 0;
        }
        totalRows.textContent = currentTotal;

        // Возвращаем "срезанный" кусок данных
        const skip = (page - 1) * rowsPerPage;
        return data.slice(skip, skip + rowsPerPage);
    }
}