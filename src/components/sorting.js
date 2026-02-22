import {sortMap} from "../lib/sort.js";

export function initSorting(columns) {
    return (query, state, action) => {
        let field = null;
        let order = 'none';

        if (action && action.name === 'sort') {
            const nextOrder = sortMap[action.dataset.value];
            action.dataset.value = nextOrder;
            field = action.dataset.field;
            order = nextOrder;

            columns.forEach(column => {
                if (column !== action) {
                    column.dataset.value = 'none';
                }
            });
        } else {
            const activeColumn = columns.find(column => column.dataset.value !== 'none');
            if (activeColumn) {
                field = activeColumn.dataset.field;
                order = activeColumn.dataset.value;
            }
        }

        const sort = (field && order !== 'none') ? `${field}:${order}` : null; 
        
        return sort ? Object.assign({}, query, { sort }) : query; 
    }
}