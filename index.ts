const baseopts = {
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
const settings = [
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
const ls = localStorage;
const lsName = "kefirgo:data";
let options:object = {};
let lang:object = {};

function init() {
    load();
    let site = "view-main";
    if(Object.keys(options).length==0) {
        site = "view-welcome";
    }
    let settings = new URLSearchParams(window.location.search).get("settings");
    if(settings!=null && settings == "true") {
        site = "view-settings";
    }
    loadModules();
    viewSite(site);
}
init();

function viewSite(site: string) {
    document.querySelectorAll(".view").forEach(e => {
        if(!e.className.includes(site)) e.setAttribute("style", "display: none !important;");
    });
}

function up(str: string) {
    return str.charAt(0).toUpperCase() + str.substring(1);
}

function search() {
    window.location.href = getHost()+encodeURIComponent(document.querySelector(".search-field")["value"]);
}

function getHost() {
    switch(options["engine"]) {
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
    document.querySelector(".search-btn").addEventListener("click", (e) => {
        search();
    });
    document.querySelector(".search-field").addEventListener("keydown", (e) => {
        if((e as any).key=="Enter") search();
    });
    document.querySelector(".finish").addEventListener("click", () => {
        let lang = (document.querySelector(".lang") as any).selectedOptions[0].value.toLowerCase();
        let engine = (document.querySelector(".engine") as any).selectedOptions[0].value.toLowerCase();
        let name = (document.querySelector(".name-input") as any).value;

        if(name.replaceAll(" ", "")=="") return;

        let json:object = {...baseopts};

        json["lang"] = lang;
        json["engine"] = engine;
        json["name"] = name;

        options = json;
        save();
        window.location.reload();
    });
    document.querySelector(".settings-button").addEventListener("click", (e:Event) => {
        window.location.search = "?settings=true";
    });
    document.querySelector(".back-button").addEventListener("click", (e:Event) => {
        window.location.search = "";
    });
}

function reset() {
    ls.removeItem(lsName);
    window.location.reload();
}

function loadModules() {
    let list = document.querySelector(".settings-list");
    settings.forEach(e => {
        let el = document.createElement("div");
        el.className = "setting";
        
        el.innerHTML+='<span class="'+e.span+'"></span>';

            let txt = document.createElement("div");
            txt.className = "texts";
            
            txt.innerHTML+='<div class="title">'+e.title+'</div>';
            txt.innerHTML+='<div class="description">'+e.desc+'</div>';
            
            el.appendChild(txt);

        el.innerHTML+='<input type="'+e.value.type+'" class="setting-input-'+e.value.type+'" placeholder="'+e.title+'">';

        list.appendChild(el);
    });
}

// LOCALSTORAGE
function load() {
    let v = ls.getItem(lsName);
    if(v!=null) {
        options = JSON.parse(v);
        fetch("lang/"+options["lang"]+".json").then(e => e.json()).then(e => {
            lang = e;
            
            Object.keys(lang).forEach(el => {
                let h = document.documentElement.innerHTML as any;
                document.documentElement.innerHTML = h.replaceAll("$"+el+"$", lang[el]).replaceAll("%search-engine%", up(options["engine"]));
            });
            listeners();
        });
    } else {
        listeners();
    }
}

function save() {
    ls.setItem(lsName, JSON.stringify(options));
}