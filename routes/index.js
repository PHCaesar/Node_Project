var express = require('express');
var fs = require('fs');
var router = express.Router();
var app = express();


app.use(express.static(__dirname + '/public'));

app.get("/", (req, res) => {
    readFilesFromName("index.html", res, "html");
});

app.listen(() => {
    createGetters();
})

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/*
            @Author: Philipp Cserich
            @Date: 2.08.21
            @Description: 
            This programm provides a generated URL tree , which consists of all existing Files in the "public" Folder
*/

function createGetters() {
    app.get("/Doc", (req, res) => {
        cardGenerator(res, "Doc");
    });

    fs.readdirSync("./public").forEach(site => {
        generateListeners(fs.readdirSync('./public/' + site), site);
        app.get("/Doc/" + site, (req, res) => {
            cardGenerator(res, site);
        });
    })
}
/** 
 * generates one Get request for every file in those directorys
 **/
function generateListeners(list, dirname) {
    list.forEach(site => {
        app.get("/Doc/" + dirname + "/" + site, (req, res) => {
            console.log(`You are right now at ${site}`);
            readFilesFromName("public/" + dirname + "/" + site, res, "plain");
        });
    })
}

function readFilesFromName(name, res, type) {
    if (!name.includes(".")) {
        cardGenerator(res, name.substring(7, name.length));
        generateListeners(fs.readdirSync("./" + name), name.substring(7, name.length))
        return;
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/' + type);
    fs.readFile(name, (err, data) => {
        res.end(data);
    });
}

function cardGenerator(res, directoryname) {
    res.write("<script src='https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js'></script> <script src = 'https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js' > </script> <link rel = 'stylesheet'href = '../css/docStyles.css' /><link rel = 'stylesheet'href = 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css'integrity = 'sha384-/Y6pD6FV/Vv2HJnA6t+vslU6fwYXjCFtcEpHbNJ0lyAFsXTsjBbfaDjzALeQsN6M'crossorigin = 'anonymous' > </link>");

    var dirname = directoryname;
    if (directoryname === "Doc")
        var directory = fs.readdirSync('./public')
    else {
        var directory = fs.readdirSync('./public/' + directoryname)
        if (directoryname.includes("/"))
            directoryname = directoryname.substring(directoryname.lastIndexOf("/") + 1, directoryname.length)
    }

    if (directory.length === 0) {
        res.write("<div class='row align-items-center gap-3 ' style='margin: 5%;' id='HTMLS'>");
        res.write("<div style='background-color:DDDDDD;margin-left: 5%;border-radius: 30px;width:80%;height:60%'><p style='border-radius: 100%;background-color:#FF0F00;margin-left: -1%;margin-top: -1%;width:50px;height: 50px;position: absolute;'></p><h1 style='margin-left: 10%;margin-top: 10%;position: relative;padding-top:5%'><b>This Folder is empty</b></h1><div style='margin-left: 10%;padding-top: 5%;'><h5>Come back to visit <b>" + directoryname.toUpperCase() + "</b> when you have added any new Files or other Folders to fill this gap.</h5><br><h5>The Button on the right hand corner will bring you back to the /public overview.</h5><br><br><h5>Thank you for using ______ </h5></div><button onclick=\"window.location.href='/Doc'\" style='margin-top: 5%;width:250px;float:right;margin-right:3%;margin-bottom:3%;border-radius: 20px;background-color: #C4C4C4;' ><img src='../img/cursor.png' style='height:50px;'><b>Explore other Files</b></button></div>")
    } else {
        res.write("<style type='text/css'>.hidden {display: none;}.navbar {position: absolute;width: 100%;background-color: black;margin: 0px;height: 50px;padding-top: 0%;margin-top: -5%;}#searchbar {margin-top: auto;border-radius: 20px;float: right;margin-right: 20px;}</style><script>function search() {show(document.getElementById('searchbar').value.toUpperCase());}function show(input) {console.log(input);var list = document.getElementsByClassName('Headers');console.log(list);for (let item of list) {if (!item.innerHTML.toUpperCase().startsWith(input)) {item.parentNode.parentNode.parentNode.classList.add('hidden');} else {item.parentNode.parentNode.parentNode.classList.remove('hidden');}}}</script><div class='navbar'><div><button style='background-color:white;border-radius:100%;float:left;' onclick=\"window.location.href='/Doc'\"><img src='../img/home.png' height='25px' width='25px' style='padding:2px'></button>")
        if (directoryname !== "Doc")
            res.write("<button style='background-color:red;border-radius:100%;float:left;' onclick=\"window.location.href='/Doc/" + dirname.substring(0, dirname.lastIndexOf('/')) + "'\"><img src='../img/back.png' height='25px' width='25px' style='padding:2px'></button>")
        res.write("</div><input id='searchbar' onchange='search()'></input></div>")
        res.write("<div class='row align-items-center gap-3 ' style='margin: 5%;' id='HTMLS'>");
        directory.forEach(site => {
            var color = "white";
            var picture = "folder.png";
            if (site.endsWith(".html")) {
                color = "#EF712B";
                picture = "Html.png"
                cardforhtml(color, picture, directoryname, site, res)
            } else if (site.endsWith(".css")) {
                color = "#72D227";
                picture = "Css.png"
                cardforfile(color, picture, directoryname, site, res)
            } else if (site.endsWith(".js")) {
                color = "#FFF61F";
                cardforfile(color, picture, directoryname, site, res)
            } else {
                if (!site.endsWith(".png") && !directoryname.toUpperCase().includes("DOC")) {
                    directoryname = "./Doc/" + dirname;
                } else if (site.toUpperCase().includes(".")) {
                    picture = "png-file.png"
                    color = "#1FAEFF"
                }
                res.write("<div class='col - sm - 6 p - 2 '><div class='card' style='height: 25em;border-radius: 30px;background-color:white;border: 0px solid;margin-top: 10%;background-color: #DDDDDD;'><div class='card-title'><p style='background-color: " + color + ";border-radius: 100%;width: 50px;height:50px;margin-left: -1.5%;margin-top: -1.5%;border-color: black;border-width: 1px;'><img src='../img/" + picture + "' height='60%' style='margin:20%'></p></div><div class='card-body'><h1 class='text-center Headers  '>" + site + "</h1><div style='width:100%;vertical-align: middle;margin-top: 15%;display: flex;justify-content: center; /* align horizontal */align-items: center; /* align vertical */'><button onclick=\"window.location.href='/" + directoryname + "/" + site + "'\" style='height:50px;width:110px;border-radius: 10px;border-color: black;border-width: 2px;background-color: #C4C4C4;'><img src='../img/cursor.png' height='80%'><b>Open</b></button></div></div></div></div>")
            }
        })
    }
    res.end("</div>")
}

function cardforhtml(color, picture, directoryname, site, res) {

    res.write("<div class='col - sm - 6 p - 2 '><div class='card' style='height: 25em;border-radius: 30px;background-color:white;border: 0px solid;margin-top: 10%;background-color: #DDDDDD;'><div class='card-title'><p style='background-color: " + color + ";border-radius: 100%;width: 50px;height:50px;margin-left: -1.5%;margin-top: -1.5%;border-color: black;border-width: 1px;'><img src='../img/" + picture + "' height='60%' style='margin:20%'></p></div><div class='card-body'><h1 class='text-center Headers  '>" + site.toUpperCase() + "</h1><div style='width:100%;vertical-align: middle;margin-top: 15%;'><button onclick=\"window.location.href='/Doc/" + directoryname + "/" + site + "'\" style='height:50px;width:25%;border-radius: 10px;border-color: black;border-width: 2px;background-color: #C4C4C4;'><img src='../img/code.png' height='80%'><b>Code</b></button><button onclick=\"window.location.href='/" + directoryname + "/" + site + "'\" style='margin-left: 46%;height:50px;width:25%;border-radius: 10px;border-color: black;border-width: 2px;background-color: #C4C4C4;'><img src='../img/cursor.png' height='80%'><b>Open</b></button></div> </div> </div> </div>");
}

function cardforfile(color, picture, directoryname, site, res) {
    res.write("<div class='col - sm - 6 p - 2 '><div class='card' style='height: 25em;border-radius: 30px;background-color:white;border: 0px solid;margin-top: 10%;background-color: #DDDDDD;'><div class='card-title'><p style='background-color: " + color + ";border-radius: 100%;width: 50px;height:50px;margin-left: -1.5%;margin-top: -1.5%;border-color: black;border-width: 1px;'><img src='../img/" + picture + "' height='60%' style='margin:20%'></p></div><div class='card-body'><h1 class='text-center Headers'>" + site + "</h1><div style='width:100%;vertical-align: middle;margin-top: 15%;display: flex;justify-content: center; /* align horizontal */align-items: center; /* align vertical */'><button onclick=\"window.location.href='/" + directoryname + "/" + site + "'\" style='height:50px;width:110px;border-radius: 10px;border-color: black;border-width: 2px;background-color: #C4C4C4;'><img src='../img/cursor.png' height='80%'><b>Open</b></button></div></div></div></div>")
}
module.exports = router;