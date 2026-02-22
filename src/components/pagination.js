import {getPages} from "../lib/utils.js";

export const initPagination = ({pages, fromRow, toRow, totalRows}, createPage) => {
    const pageTemplate = pages.firstElementChild.cloneNode(true);
    pages.replaceChildren();
    
    let pageCount; 

    const applyPagination = (query, state, action) => {
        const limit = Number(state.rowsPerPage);
        let page = Number(state.page);

        if (action) {
            switch(action.name) {
                case 'prev': page = Math.max(1, page - 1); break;
                case 'next': page = Math.min(pageCount || 1, page + 1); break;
                case 'first': page = 1; break;
                case 'last': page = pageCount || 1; break;
            }
        }

        return Object.assign({}, query, { limit, page });
    };

    const updatePagination = (total, { page, limit }) => {
        pageCount = Math.ceil(total / limit) || 1;
        
        if (page > pageCount) page = pageCount;

        const visiblePages = getPages(page, pageCount, 5);
        
        const pageElements = visiblePages.map(pageNumber => {
            const el = pageTemplate.cloneNode(true);
            return createPage(el, pageNumber, pageNumber === page);
        });
        
        pages.replaceChildren(...pageElements);

        if (total > 0) {
            fromRow.textContent = (page - 1) * limit + 1;
            toRow.textContent = Math.min(page * limit, total);
        } else {
            fromRow.textContent = 0;
            toRow.textContent = 0;
        }
        totalRows.textContent = total;
    };

    return { applyPagination, updatePagination };
}