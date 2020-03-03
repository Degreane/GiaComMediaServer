var moment=require('moment');
var mongoose=require('mongoose');
var MovieSchema = new mongoose.Schema({
    'title': {type:String},
    'year': {type: Number},
    "runtime" : {type:String},
    "genres" : {type:String},
    "actors" : {type:String},
    "plot" : {type:String},
    "languages" : {type:String},
    "country" : {type:String},
    "poster" : {type:String},
    "fileInDB" : {type:String}
});
module.exports = mongoose.model('movies',MovieSchema);
/*
{
        "_id" : ObjectId("5c30b5493b295e7419bf4435"),
        "title" : "127 Hours",
        "_year_data" : "2010",
        "year" : 2010,
        "rated" : "R",
        "runtime" : "94 min",
        "genres" : "Adventure, Biography, Drama, Thriller",
        "director" : "Danny Boyle",
        "writer" : "Danny Boyle (screenplay), Simon Beaufoy (screenplay), Aron Ralston (book)",
        "actors" : "James Franco, Kate Mara, Amber Tamblyn, Sean Bott",
        "plot" : "127 Hours is the true story of mountain climber Aron Ralston's remarkable adventure to save himself after a fallen boulder crashes on his arm and traps him in an isolated canyon in Utah. Over the next five days Ralston examines his life and survives the elements to finally discover he has the courage and the wherewithal to extricate himself by any means necessary, scale a 65 foot wall and hike over eight miles before he can be rescued. Throughout his journey, Ralston recalls friends, lovers, family, and the two hikers he met before his accident. Will they be the last two people he ever had the chance to meet?",
        "languages" : "English, Italian",
        "country" : "USA, UK, France",
        "awards" : "Nominated for 6 Oscars. Another 23 wins & 141 nominations.",
        "poster" : "https://m.media-amazon.com/images/M/MV5BMTc2NjMzOTE3Ml5BMl5BanBnXkFtZTcwMDE0OTc5Mw@@._V1_SX300.jpg",
        "metascore" : "82",
        "rating" : "7.6",
        "votes" : "316,465",
        "imdbid" : "tt1542344",
        "type" : "movie",
        "dvd" : "01 Mar 2011",
        "boxoffice" : "$18,329,466",
        "production" : "Fox Searchlight",
        "website" : "http://www.127hoursmovie.com/",
        "response" : "True",
        "series" : false,
        "imdburl" : "https://www.imdb.com/title/tt1542344",
        "fileInDB" : "127.Hours.2010.DVDSCR.AC3.XViD-T0XiC-iNK_xvid",
        "fileInDBStripped" : "127 Hours",
        "ratings" : [
                {
                        "Source" : "Internet Movie Database",
                        "Value" : "7.6/10"
                },
                {
                        "Source" : "Rotten Tomatoes",
                        "Value" : "93%"
                },
                {
                        "Source" : "Metacritic",
                        "Value" : "82/100"
                }
        ],
        "__v" : 0
}
*/