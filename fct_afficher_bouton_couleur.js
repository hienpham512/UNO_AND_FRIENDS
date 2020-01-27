'use strict';

function generateColorButtons({pari, pseudo, password, credit, table_index}) {
    const colors = {
        b: 'bleu',
        r: 'rouge',
        j: 'jaune',
        v: 'vert'
    };

    let html = '';

    Object.entries(colors).forEach(([key, value]) => {
        html += `<a href="/req_submit_cards?pseudo=${pseudo}&pari=${pari}&password=${password}&credit=${credit}&table=${table_index}&chosenColor=${key}" style="margin-right: 15px" class="${value}">${value}</a>`;
    });
    html += '<br>';
    return html;
}

module.exports = generateColorButtons;