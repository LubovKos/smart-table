import {rules, createComparison} from "../lib/compare.js";

export function initSearching(searchField) {
    // Настройка компаратора для поиска
    const compare = createComparison(
        ['skipEmptyTargetValues'],
        [
            rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false)
        ]
    );

    return (data, state, action) => {
        // Применение поиска к данным
        return data.filter(row => compare(row, state));
    }
}