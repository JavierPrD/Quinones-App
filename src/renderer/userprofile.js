const nunjucks = require('nunjucks');

const env = new nunjucks.Environment(new nunjucks.FileSystemLoader('html'));
const html = env.render('UserProfile_view.html', { data });
