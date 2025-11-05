function removeDiacritics(str: string): string {

    str = str.replace(/đ/g, 'd').replace(/Đ/g, 'D'); // special case not included in Unicode NFD

    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export function createUniqueEmail(prefix: string, browserName: string): string {

    const now = new Date();

    const timestamp = [
        now.getFullYear().toString().slice(-2),
        (now.getMonth() + 1).toString().padStart(2, '0'),
        now.getDate().toString().padStart(2, '0'),
    ].join('') + '.' + [
        now.getHours().toString().padStart(2, '0'),
        now.getMinutes().toString().padStart(2, '0'),
        now.getSeconds().toString().padStart(2, '0'),
    ].join('');

    const cleanPrefix = removeDiacritics(prefix).replace(/\s/g, '');

    const cleanBrowserName = browserName.toLowerCase();

    return `${cleanPrefix}_${timestamp}_${cleanBrowserName}@example.com`;
}