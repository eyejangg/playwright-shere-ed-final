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

const { educationalPosts } = require('./educational/posts-data');

module.exports = {
    images,
    pdf,
    images15,
    images16,
    educationalPosts
};