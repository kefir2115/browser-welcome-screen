var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var baseopts = {
    lang: "english",
    engine: "google",
    clock: true,
    date: true,
    recentSites: true,
    sites: [],
    background: {
        r: 20,
        g: 20,
        b: 20
    }
};
var settings = [
    {
        title: "Language",
        desc: "Change your preferred language",
        span: "fa-solid fa-globe",
        value: {
            type: "select",
            optionValue: "lang"
        }
    },
    {
        title: "Search Engine",
        desc: "Change your search engine",
        span: "fa-brands fa-google",
        value: {
            type: "select",
            optionValue: "engine"
        }
    },
    {
        title: "Clock",
        desc: "Display clock",
        span: "fa-regular fa-clock",
        value: {
            type: "checkbox",
            optionValue: "clock"
        }
    },
    {
        title: "Date",
        desc: "Display date",
        span: "fa-regular fa-calendar",
        value: {
            type: "checkbox",
            optionValue: "date"
        }
    },
    {
        title: "Recent Sites",
        desc: "Display recent sites",
        span: "fa-solid fa-clock-rotate-left",
        value: {
            type: "checkbox",
            optionValue: "recentSites"
        }
    }
];
var ls = localStorage;
var lsName = "kefirgo:data";
var options = {};
var lang = {};
function init() {
    load();
    var site = "view-main";
    if (Object.keys(options).length == 0) {
        site = "view-welcome";
    }
    var settings = new URLSearchParams(window.location.search).get("settings");
    if (settings != null && settings == "true") {
        site = "view-settings";
    }
    loadModules();
    viewSite(site);
}
init();
function viewSite(site) {
    document.querySelectorAll(".view").forEach(function (e) {
        if (!e.className.includes(site))
            e.setAttribute("style", "display: none !important;");
    });
}
function up(str) {
    return str.charAt(0).toUpperCase() + str.substring(1);
}
function search() {
    window.location.href = getHost() + encodeURIComponent(document.querySelector(".search-field")["value"]);
}
function getHost() {
    switch (options["engine"]) {
        case "google": {
            return "https://google.com/search?q=";
        }
        case "duckduckgo": {
            return "https://duckduckgo.com/?q=";
        }
        case "yahoo": {
            return "https://search.yahoo.com/search?p=";
        }
        case "you.com": {
            return "https://you.com/search?q=";
        }
        case "brave search": {
            return "https://search.brave.com/search?q=";
        }
    }
}
function listeners() {
    document.querySelector(".search-btn").addEventListener("click", function (e) {
        search();
    });
    document.querySelector(".search-field").addEventListener("keydown", function (e) {
        if (e.key == "Enter")
            search();
    });
    document.querySelector(".finish").addEventListener("click", function () {
        var lang = document.querySelector(".lang").selectedOptions[0].value.toLowerCase();
        var engine = document.querySelector(".engine").selectedOptions[0].value.toLowerCase();
        var name = document.querySelector(".name-input").value;
        if (name.replaceAll(" ", "") == "")
            return;
        var json = __assign({}, baseopts);
        json["lang"] = lang;
        json["engine"] = engine;
        json["name"] = name;
        options = json;
        save();
        window.location.reload();
    });
    document.querySelector(".settings-button").addEventListener("click", function (e) {
        window.location.search = "?settings=true";
    });
    document.querySelector(".back-button").addEventListener("click", function (e) {
        window.location.search = "";
    });
}
function reset() {
    ls.removeItem(lsName);
    window.location.reload();
}
function loadModules() {
    var list = document.querySelector(".settings-list");
    settings.forEach(function (e) {
        var el = document.createElement("div");
        el.className = "setting";
        el.innerHTML += '<span class="' + e.span + '"></span>';
        var txt = document.createElement("div");
        txt.className = "texts";
        txt.innerHTML += '<div class="title">' + e.title + '</div>';
        txt.innerHTML += '<div class="description">' + e.desc + '</div>';
        el.appendChild(txt);
        el.innerHTML += '<input type="' + e.value.type + '" class="setting-input-' + e.value.type + '" placeholder="' + e.title + '">';
        list.appendChild(el);
    });
}
// LOCALSTORAGE
function load() {
    var v = ls.getItem(lsName);
    if (v != null) {
        options = JSON.parse(v);
        fetch("lang/" + options["lang"] + ".json").then(function (e) { return e.json(); }).then(function (e) {
            lang = e;
            Object.keys(lang).forEach(function (el) {
                var h = document.documentElement.innerHTML;
                document.documentElement.innerHTML = h.replaceAll("$" + el + "$", lang[el]).replaceAll("%search-engine%", up(options["engine"]));
            });
            listeners();
        });
    }
    else {
        listeners();
    }
}
function save() {
    ls.setItem(lsName, JSON.stringify(options));
}
