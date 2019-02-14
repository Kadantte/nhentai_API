const fetch = require('node-fetch');
const cheerio = require('cheerio');
const minify = require('html-minifier');

const Pageurl = 'https://nhentai.net/?page=';
const Hentaiurl = 'https://nhentai.net/g/';

function gethentaip(gethentaiterm) {
    return fetch(`${Pageurl}${gethentaiterm}`)
        .then(response => response.text())
        .then(body =>{
            const hentais = [];
            const $ = cheerio.load(body);
            $('.gallery').each(function(i, element){
                const $element = $(element);
                const $image = $element.find('img');
                const $title = $element.find('div.caption');
                const $hID = $element.find('a.cover');
                const hentai = {
                    ID: $hID.attr('href'),
                    title: $title.text(),
                    image: $image.attr('data-src')
                };
                hentais.push(hentai);
            });
            return hentais;
        });

}

function gethentai(ID) {
    return fetch(`${Hentaiurl}${ID}`)
        .then(response => response.text())
        .then(body => {
            const $ = cheerio.load(body);
            const $English = $('.container h1');
            const $Japanese = $('.container h2');
            

            const English = $English.first().contents().filter(function() {
                return this.type === 'text';
            }).text();
            const Japanese = $Japanese.first().contents().filter(function() {
                return this.type === 'text';
            }).text();
            const CoverID = $('div#cover a img').attr('data-src').match(/\d+/);//.replace(/\b((http|https):\/\/?)(t.nhentai.net\/)+(galleries\/)/g,"").trim(); //Change this shit :p .
            const Cover = $('div#cover a img').attr('data-src');
            // I need to Complete this ASAP! - See  from: https://youtu.be/U0btOGPwrIY?t=2343
            // Assis: #-https://nhentai.net/g/263002/ #-http://localhost:3000/g/263002/ #-
            const Tags = [];
            $('.tags a.tag').each(function(i, element){
                const $tagurl = $(element).attr('href');
                const $tagname = $(element).text().replace(/\((.*?)\)/g, "").trim()
                const $tagID = $(element).attr('class').replace('tag tag-',"").trim();
                const tag = {
                    ID: $tagID,
                    URL: $tagurl,
                    Name: $tagname
                };
                Tags.push(tag);
            });



            return {
                English,
                Japanese,
                CoverID,
                Cover,
                Tags
            }
        });
}

module.exports = {
    gethentaip,
    gethentai
    
};