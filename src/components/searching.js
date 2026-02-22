export function initSearching(searchField) {
    return (query, state, action) => {
        const searchValue = state[searchField]?.trim();
        if (searchValue) {
            return Object.assign({}, query, { search: searchValue });
        }
        return query;
    }
}