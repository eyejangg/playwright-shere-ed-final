const path = require('path');
const { randomUUID } = require('node:crypto');

const images = {
    coverPng: path.resolve(__dirname, 'images/cover.png'),
    coverJpg: path.resolve(__dirname, 'images/cover.jpg'),
    coverOver2MB: path.resolve(__dirname, 'images/cover-over-2mb.png'),

    image01: path.resolve(__dirname, 'images/image01.png'),
    imageOver2MB: path.resolve(__dirname, 'images/image-over-2mb.png'),
    imageGif: path.resolve(__dirname, 'images/image01.gif'),
};

const pdf = {
    normal: path.resolve(__dirname, 'pdf/document.pdf'),
    size20MB: path.resolve(__dirname, 'pdf/document-20mb.pdf'),
    over20MB: path.resolve(__dirname, 'pdf/document-over-20mb.pdf'),
    docx: path.resolve(__dirname, 'pdf/document.docx'),
};

function imagePath(fileName) {
    return path.resolve(__dirname, `images/${fileName}`);
}

const images05 = [
    imagePath('image01.png'),
    imagePath('image02.png'),
    imagePath('image03.png'),
    imagePath('image04.png'),
    imagePath('image05.png'),
];

const images06 = [
    ...images05,
    imagePath('image06.png'),
];

const images15 = [
    imagePath('image01.png'),
    imagePath('image02.png'),
    imagePath('image03.png'),
    imagePath('image04.png'),
    imagePath('image05.png'),
    imagePath('image06.png'),
    imagePath('image07.png'),
    imagePath('image08.png'),
    imagePath('image09.png'),
    imagePath('image10.png'),
    imagePath('image11.png'),
    imagePath('image12.png'),
    imagePath('image13.png'),
    imagePath('image14.png'),
    imagePath('image15.png'),
];

const images16 = [
    ...images15,
    imagePath('image16.png'),
];

function generateUniqueTitle(prefix = 'AutoTest') {
    const run = process.env.GITHUB_RUN_ID || 'local';
    return `${prefix} ${run}-${randomUUID().slice(0, 8)}`.slice(0, 100);
}

const authPaths = {
    memberA: path.resolve(__dirname, '../playwright/.auth/member-a.json'),
};

module.exports = {
    images,
    pdf,
    images05,
    images06,
    images15,
    images16,
    generateUniqueTitle,
    authPaths,
};
