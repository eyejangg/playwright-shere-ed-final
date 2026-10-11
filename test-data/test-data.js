const path = require('path');


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

module.exports = { images, pdf, images05, images06 };
