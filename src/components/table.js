import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate);

    // Вывод дополнительных шаблонов до таблицы (в обратном порядке для prepend)
    if (before && before.length) {
        [...before].reverse().forEach(templateId => {
            root[templateId] = cloneTemplate(templateId);
            root.container.prepend(root[templateId].container);
        });
    }

    // Вывод дополнительных шаблонов после таблицы
    if (after && after.length) {
        after.forEach(templateId => {
            root[templateId] = cloneTemplate(templateId);
            root.container.append(root[templateId].container);
        });
    }

    // Обработка событий
    root.container.addEventListener('change', () => {
        onAction();
    });

    root.container.addEventListener('reset', () => {
        const sortButtons = root.container.querySelectorAll('button[name="sort"]');
        sortButtons.forEach(btn => btn.dataset.value = 'none');
        setTimeout(() => onAction(), 0);
    });

    root.container.addEventListener('submit', (e) => {
        e.preventDefault();
        onAction(e.submitter);
    });

    root.container.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
            e.preventDefault(); 
            e.target.blur();   
        }
    });

    const render = (data) => {
        const nextRows = data.map(item => {
            const row = cloneTemplate(rowTemplate);
        
            Object.keys(item).forEach(key => {
                if (row.elements[key]) {
                    row.elements[key].textContent = item[key];
                }
            });
            
            return row.container;
        });
        
        root.elements.rows.replaceChildren(...nextRows);
    }

    return {...root, render};
}