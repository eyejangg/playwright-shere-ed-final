const fs = require('fs');
const { educationalPosts } = require('../test-data/educational/posts-data');

console.log('Total educational posts:', educationalPosts.length);
educationalPosts.forEach((p, idx) => {
  console.log(`[Post ${idx + 1}] ${p.title}`);
  console.log(`  Grade: ${p.grade} | Subject: ${p.subject}`);
  console.log(`  Cover: ${p.cover} (exists: ${fs.existsSync(p.cover)})`);
  console.log(`  Gallery: ${p.gallery.length} files (all exist: ${p.gallery.every(g => fs.existsSync(g))})`);
  console.log(`  PDF: ${p.pdf} (exists: ${fs.existsSync(p.pdf)})`);
  console.log(`  Tags: ${p.tags.join(', ')}`);
});
